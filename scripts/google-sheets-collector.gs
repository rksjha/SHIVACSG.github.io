/**
 * SCG Google Sheets Form Data Collector
 * ==========================================
 * Paste this entire script into Google Apps Script, then deploy
 * it as a Web App to receive form submissions from all SCG websites.
 *
 * SETUP STEPS:
 * 1. Open https://sheets.new and create a sheet.
 *    Rename the first sheet tab to "Submissions".
 * 2. Click Extensions → Apps Script.
 * 3. Delete the default code and paste this entire file.
 * 4. Save (Ctrl+S), then click Deploy → New Deployment.
 *    - Type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Authorise and copy the Deployment URL.
 * 6. Paste the URL into form-data-collector.js as SCG_SHEETS_URL.
 */

var SHEET_NAME = 'Submissions';

/* ── Receive POST from form-data-collector.js ── */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    appendRow(data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ── Receive GET (health-check) ── */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'online', service: 'SCG Form Collector' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ── Append a row to the sheet ── */
function appendRow(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  // Build header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    var headers = buildHeaders(data);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#0d2b5e')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  var existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Add any new columns that don't exist yet
  Object.keys(data).forEach(function (key) {
    if (existingHeaders.indexOf(key) === -1) {
      existingHeaders.push(key);
      sheet.getRange(1, existingHeaders.length).setValue(key)
        .setBackground('#0d2b5e').setFontColor('#ffffff').setFontWeight('bold');
    }
  });

  // Build the row in correct column order
  var row = existingHeaders.map(function (h) {
    return data[h] != null ? data[h] : '';
  });

  sheet.appendRow(row);
}

function buildHeaders(data) {
  // Priority columns first
  var priority = ['_timestamp', '_form', '_source', 'full_name', 'name',
                  'email', 'phone', 'mobile', 'company', 'service', 'message'];
  var headers  = [];
  priority.forEach(function (h) { if (data[h] != null) headers.push(h); });
  Object.keys(data).forEach(function (k) {
    if (headers.indexOf(k) === -1) headers.push(k);
  });
  return headers;
}
