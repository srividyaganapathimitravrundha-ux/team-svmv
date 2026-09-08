# Team SVMV Website

A free, mobile-first bilingual website starter for Sri Vidyaganapathi Mitra Vrundha (Team SVMV).

## Included
- Home + About combined
- High-priority WhatsApp / Instagram / Contribution actions
- WhatsApp and Instagram QR codes
- 2026 Ganeshotsava programme poster
- Live countdown for 14–18 September 2026
- English / Kannada toggle
- Gallery-ready Google Drive / Google Sheets backend
- Contribution form: Name + Mobile + Amount
- Dynamic UPI QR with amount prefilled
- UPI deep link button for compatible mobile apps
- Private contribution logging to Google Sheets through Apps Script
- Contact page

## Free hosting
The frontend is static and can be hosted on GitHub Pages. Google Apps Script is used only for optional Sheet-backed content and contribution logging.

## Google Sheet setup
Create one private Google Spreadsheet with these tabs and headers:

### Website_Content
`Key | Value`
Recommended keys: `WhatsAppLink`, `InstagramLink`, `FestivalStartISO`, `FestivalEndISO`, `ProgrammePoster`

### Payment_Settings
`Key | Value`
Recommended keys: `UPIId`, `UPIName`

### Contact
`Key | Value`

### Gallery
`ImageURL | Year | Category | Caption | Active`

### Festival_Programme
`Date | Time | Event | Description | Active`

### Contributions
`Timestamp | Name | Mobile | Amount`

## Apps Script deployment
1. Open the private Google Sheet.
2. Extensions → Apps Script.
3. Paste `google-apps-script/Code.gs`.
4. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with the spreadsheet ID.
5. Deploy → New deployment → Web app.
6. Execute as: Me.
7. Who has access: Anyone.
8. Copy the Web App URL into `config.js` as `APPS_SCRIPT_URL`.

## Google Drive gallery
For the first version, put image URLs into the Gallery sheet. If you use Drive, the URL must be a browser-viewable/direct image URL that permits public viewing. Do not expose your private contribution sheet.

## Important payment note
UPI apps vary by device. The site always shows a QR. The "Pay via UPI" button uses a standard `upi://pay` intent and may open a compatible UPI application on supported phones. Payment completion is handled by the UPI app/bank, not by the website.
