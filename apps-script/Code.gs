/**
 * Black Turtle signups -> Google Sheet
 *
 * Paste this into Extensions > Apps Script in your Google Sheet,
 * change SECRET, then Deploy > New deployment > Web app
 * (Execute as: Me, Who has access: Anyone).
 */
const SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';
const SHEET_NAME = 'Signups';

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const data = JSON.parse(e.postData.contents);
    if (data.secret !== SECRET) return reply({ ok: false, error: 'unauthorized' });

    const email = String(data.email || '').trim().toLowerCase();
    const phone = String(data.phone || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return reply({ ok: false, error: 'invalid_email' });
    if (!/^\d{10}$/.test(phone)) return reply({ ok: false, error: 'invalid_phone' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date & time (IST)', 'Email', 'Mobile number']);
      sheet.setFrozenRows(1);
      sheet.getRange('A:C').setNumberFormat('@'); // plain text: no formulas, no 9.88E+09
      sheet.getRange('A1:C1').setFontWeight('bold').setBackground('#111111').setFontColor('#ffffff');
      sheet.setColumnWidth(1, 170); sheet.setColumnWidth(2, 280); sheet.setColumnWidth(3, 140);
    }

    // Reject duplicates
    const last = sheet.getLastRow();
    if (last > 1) {
      const rows = sheet.getRange(2, 2, last - 1, 2).getValues();
      for (let i = 0; i < rows.length; i++) {
        if (String(rows[i][0]).toLowerCase() === email) return reply({ ok: false, error: 'duplicate_email' });
        if (String(rows[i][1]) === phone) return reply({ ok: false, error: 'duplicate_phone' });
      }
    }

    const stamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow([stamp, email, phone]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: 'server_error' });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
