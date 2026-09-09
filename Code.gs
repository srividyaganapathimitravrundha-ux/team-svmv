/**
 * Team SVMV Google Apps Script backend.
 * Create one Google Spreadsheet with sheets named:
 * Website_Content, Payment_Settings, Contact, Gallery, Festival_Programme, Contributions
 * Deploy as Web App: Execute as Me; Who has access: Anyone.
 * Keep the spreadsheet itself private.
 */
const SPREADSHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';

function doGet(e) {
  const action = (e.parameter && e.parameter.action) || 'site';
  if (action === 'site') {
    return json_(buildSitePayload_());
  }
  return json_({ok:false,error:'Unknown action'});
}

function doPost(e) {
  try {
const body = JSON.parse(e.postData.contents || '{}');
    if (body.action !== 'contribution') return json_({ok:false,error:'Unknown action'});
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss,'Contributions',['Timestamp','Name','Mobile','Amount']);
    sheet.appendRow([new Date(), body.name || '', body.mobile || '', Number(body.amount || 0)]);
    return json_({ok:true});
  } catch(err) {
    return json_({ok:false,error:String(err)});
  }
}

function buildSitePayload_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const content = keyValue_(ss.getSheetByName('Website_Content'));
  const payment = keyValue_(ss.getSheetByName('Payment_Settings'));
  const contact = keyValue_(ss.getSheetByName('Contact'));
  const gallery = rows_(ss.getSheetByName('Gallery'));
  const programme = rows_(ss.getSheetByName('Festival_Programme'));
  return {
    config: {
      whatsapp: content.WhatsAppLink || undefined,
      instagram: content.InstagramLink || undefined,
      upiId: payment.UPIId || undefined,
      upiName: payment.UPIName || undefined,
      festivalStart: content.FestivalStartISO || undefined,
      festivalEnd: content.FestivalEndISO || undefined,
      programmeImage: content.ProgrammePoster || undefined
    },
    content: content,
    payment: payment,
    contact: contact,
    gallery: gallery.filter(r => String(r.Active).toLowerCase() !== 'no' && r.ImageURL).map(r => ({src:r.ImageURL,caption:r.Caption || '',year:r.Year || ''})),
    programme: programme
  };
}

function keyValue_(sheet) {
  if (!sheet) return {};
  const values = sheet.getDataRange().getValues();
  const out = {};
  values.slice(1).forEach(r => { if (r[0]) out[String(r[0]).trim()] = r[1]; });
  return out;
}

function rows_(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map(String);
  return values.filter(r => r.some(Boolean)).map(r => {
    const o = {}; headers.forEach((h,i)=>o[h]=r[i]); return o;
  });
}

function getOrCreateSheet_(ss,name,headers) {
  let s = ss.getSheetByName(name);
  if (!s) { s=ss.insertSheet(name); s.appendRow(headers); }
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function testGalleryFiles() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Gallery");
  const values = sheet.getDataRange().getValues();
  const headers = values[0];

  values.slice(1).forEach(row => {
    const item = {};
    headers.forEach((header, index) => {
      item[String(header)] = row[index];
    });

    const folderUrl = String(item.Drive_Folder_URL || "").trim();
    if (!folderUrl) return;

    const folderId = extractDriveFolderId(folderUrl);
    if (!folderId) return;

    try {
      const folder = DriveApp.getFolderById(folderId);
      const files = folder.getFiles();

      while (files.hasNext()) {
        const file = files.next();

        Logger.log(
          "YEAR: " + item.Year +
          " | FILE: " + file.getName() +
          " | MIME: " + file.getMimeType()
        );
      }
    } catch (error) {
      Logger.log("ERROR: " + error.message);
    }
  });
}
