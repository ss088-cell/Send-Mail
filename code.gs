function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function sendFileToEmail(fileName, fileContent) {
  try {
    var email = 'recipient@example.com'; // Replace with the email you want to send the file to
    var blob = Utilities.newBlob(Utilities.base64Decode(fileContent.split(',')[1]), MimeType.MICROSOFT_EXCEL, fileName);

    // Send email with attached file
    MailApp.sendEmail({
      to: email,
      subject: 'Uploaded Google Sheet',
      body: 'Please find the attached sheet.',
      attachments: [blob]
    });

    return 'File sent successfully';
  } catch (error) {
    Logger.log(error);
    return 'Error sending file';
  }
}
