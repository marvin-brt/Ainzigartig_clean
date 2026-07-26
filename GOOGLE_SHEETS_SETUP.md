# Google Sheets & Automated Confirmation Email Setup Guide

This guide explains how to connect your Ainzigartig lead capture form directly to a Google Sheet and automatically dispatch confirmation emails to leads and notification emails to your team.

---

## 1. Create your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a **Blank spreadsheet**.
2. Name the spreadsheet: `Ainzigartig Leads`.
3. In Sheet1, set up the header row (Row 1):

| Column | A | B | C | D | E | F | G | H |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Header** | Zeitstempel | Vorname | Nachname | E-Mail | Mobile | Firma | Wie können wir dir helfen? | Quelle |

---

## 2. Add Google Apps Script Code

1. In your Google Sheet, click on **Extensions (Erweiterungen)** > **Apps Script**.
2. Delete any default code in `Code.gs` and paste the following snippet:

```javascript
/**
 * Ainzigartig Lead Capture Handler & Automated Email Dispatcher
 */
function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // 1. Anti-Spam Check (Honeypot)
    if (data.hp_website && data.hp_website.length > 0) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'ignored' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var timestamp = new Date();
    var firstName = data.firstName || '';
    var lastName = data.lastName || '';
    var email = data.email || '';
    var mobile = data.mobile || '';
    var company = data.company || '';
    var message = data.message || '';
    var source = data.source || 'Website Lead Form';

    // 2. Append Row to Spreadsheet
    sheet.appendRow([
      timestamp,
      firstName,
      lastName,
      email,
      mobile,
      company,
      message,
      source
    ]);

    // 3. Send Automatic Confirmation Email to the Lead
    if (email) {
      var emailSubject = "Vielen Dank für deine Anfrage bei Ainzigartig!";
      var emailBody = "Hallo " + firstName + ",\n\n" +
        "vielen Dank für dein Interesse an Ainzigartig! Wir haben deine Anfrage erfolgreich erhalten.\n\n" +
        "Hier sind die Details deiner Anfrage:\n" +
        "- Name: " + firstName + " " + lastName + "\n" +
        "- Firma: " + company + "\n" +
        "- E-Mail: " + email + "\n" +
        "- Telefon / Mobile: " + (mobile ? mobile : 'Nicht angegeben') + "\n" +
        "- Nachricht: " + (message ? message : 'Keine Nachricht angegeben') + "\n\n" +
        "Unser Team meldet sich innerhalb von 24 Stunden bei dir mit Terminvorschlägen für unser Erstgespräch.\n\n" +
        "Herzliche Grüße,\n" +
        "Dein Ainzigartig Team\n" +
        "https://ainzigartig.de";

      MailApp.sendEmail({
        to: email,
        subject: emailSubject,
        body: emailBody
      });
    }

    // 4. Send Notification Email to Internal Team (Optional - edit address as needed)
    var NOTIFICATION_EMAIL = "info@ainzigartig.de"; // Replace with your team email
    if (NOTIFICATION_EMAIL) {
      var teamSubject = "⚡ Neuer Lead eingegangen: " + firstName + " " + lastName + " (" + company + ")";
      var teamBody = "Ein neuer Lead wurde über die Website erfasst:\n\n" +
        "Name: " + firstName + " " + lastName + "\n" +
        "Firma: " + company + "\n" +
        "E-Mail: " + email + "\n" +
        "Mobile: " + (mobile ? mobile : '-') + "\n" +
        "Nachricht: " + (message ? message : '-') + "\n" +
        "Datum: " + timestamp.toLocaleString("de-DE");

      try {
        MailApp.sendEmail({
          to: NOTIFICATION_EMAIL,
          subject: teamSubject,
          body: teamBody
        });
      } catch (err) {
        console.warn("Could not send team notification email:", err);
      }
    }

    lock.releaseLock();

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click the **Save** icon (💾) or press `Cmd+S` / `Ctrl+S`.

---

## 3. Deploy as a Web App

1. Click on **Deploy (Bereitstellen)** > **New deployment (Neue Bereitstellung)** in the top right.
2. Click the gear icon next to *Select type* and choose **Web app (Web-App)**.
3. Configure the settings:
   - **Description**: `Ainzigartig Lead Capture API`
   - **Execute as (Ausführen als)**: `Me (deine E-Mail)`
   - **Who has access (Wer hat Zugriff)**: `Anyone (Jeder)` *(Required for frontend POST requests)*
4. Click **Deploy (Bereitstellen)**.
5. Authorize access when prompted by Google.
6. Copy the generated **Web App URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 4. Link Web App URL in your Codebase

Open [`main.js`](file:///Users/marvin/Documents/Coding/Ainzigartig/ainzigartig3_antigravity/main.js) and paste your Web App URL into the `GOOGLE_SCRIPT_URL` constant at the top of the file:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```

---

## 5. Testing & Verification

1. Open your website in the browser.
2. Click "Erstgespräch buchen" / open contact modal.
3. Fill out **Vorname**, **Nachname**, **E-Mail**, **Mobile**, **Firma**, **Nachricht** and check the **DSGVO checkbox**.
4. Click **Anfrage absenden**.
5. Check your Google Sheet to verify the new row has been added!
6. Check the entered lead E-Mail inbox for the confirmation email.
