// Backend Code
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function loadPicker() {
  var developerKey = 'YOUR_DEVELOPER_KEY'; // Replace with your Google Developer Key
  return developerKey;
}

function getOAuthToken() {
  return ScriptApp.getOAuthToken();
}

function sendSheetToEmail(fileId) {
  try {
    var email = 'recipient@example.com';  // Replace with the email ID you want to send the file to
    var file = DriveApp.getFileById(fileId);  // Get the selected file from Drive by its ID

    var blob = file.getBlob();  // Convert file to Blob format

    // Send the file via email
    MailApp.sendEmail({
      to: email,
      subject: 'Selected Google Sheet',
      body: 'Here is the selected Google Sheet from your Drive.',
      attachments: [blob]
    });

    return 'File sent successfully';
  } catch (error) {
    Logger.log(error);
    return 'Error sending file';
  }
}
