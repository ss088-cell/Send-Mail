<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #e3f2fd;
      padding: 20px;
    }

    h1 {
      color: #4CAF50;
    }

    select, button, input {
      font-size: 16px;
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      border: 1px solid #ccc;
      max-width: 400px;
      width: 100%;
      transition: transform 0.2s ease-in-out;
    }

    select:hover, button:hover, input:hover {
      transform: scale(1.05);
    }

    #loading {
      display: none;
      color: green;
    }

    #statusMessage {
      color: red;
      margin-top: 20px;
    }

    #csvUploadSection {
      display: none;
      margin-top: 20px;
    }

    #loadingAnimation {
      display: none;
      text-align: center;
      padding: 20px;
      color: #4CAF50;
      font-size: 18px;
    }

    .loading-animation {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      border: 5px solid #f3f3f3;
      border-radius: 50%;
      border-top: 5px solid #4CAF50;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    #toast {
      display: none;
      min-width: 250px;
      background-color: #333;
      color: #fff;
      text-align: center;
      border-radius: 2px;
      padding: 16px;
      position: fixed;
      z-index: 1;
      right: 30px;
      top: 30px;
      font-size: 17px;
      white-space: pre-line;
    }

    #macroscopeNotification {
      display: none;
      min-width: 250px;
      background-color: #4CAF50;
      color: #fff;
      text-align: left;
      border-radius: 4px;
      padding: 16px;
      position: fixed;
      z-index: 1;
      right: 30px;
      top: 0;
      font-size: 17px;
      white-space: normal;
      max-width: 300px;
    }

    #visualizeButton {
      display: none;
      background-color: #2196F3;
      color: white;
      border: none;
      cursor: pointer;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 16px;
      transition: transform 0.2s ease-in-out;
    }

    #visualizeButton:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>

  <h1>Generate CSV</h1>

  <label for="appDropdown">Application:</label>
  <select id="appDropdown"></select>

  <button id="generateCsvButton" onclick="generateReport()">Generate CSV</button>

  <p id="loading">Loading applications, please wait...</p>
  
  <div id="statusMessage"></div>

  <div id="csvUploadSection">
    <h2>Upload CSV</h2>
    <label for="csvUpload">Upload CSV:</label>
    <input type="file" id="csvUpload" accept=".csv" />
    <button onclick="handleCsvUpload()">Upload CSV</button>
  </div>

  <div id="loadingAnimation">
    <div class="loading-animation"></div>
    <p id="loadingText">Generating CSV...</p>
  </div>

  <div id="toast"></div>
  
  <div id="macroscopeNotification"></div> <!-- Macroscope Notification -->

  <button id="visualizeButton" onclick="visualizeReport()">Visualize</button> <!-- Visualize Button -->

  <div id="emailSection" style="display:none; margin-top:20px;">
    <h2>Send Report via Email</h2>
    <label for="emailInput">Recipient Email:</label>
    <input type="email" id="emailInput" placeholder="Enter recipient email" />
    <button onclick="sendReportEmail()">Send Email</button>
  </div>

  <script>
    let teamName, appName, date, month, year, spreadsheetUrl;

    function loadApplications() {
      document.getElementById('loading').style.display = 'block';
      
      google.script.run.withSuccessHandler(function(applications) {
        document.getElementById('loading').style.display = 'none';

        let dropdown = document.getElementById('appDropdown');
        
        if (applications.length === 0) {
          document.getElementById('statusMessage').innerText = "No applications found!";
          return;
        }
        
        applications.forEach(function(app) {
          let option = document.createElement('option');
          option.value = JSON.stringify({
            appId: app.appId, 
            engagementId: app.engagementId,
            name: app.name
          });
          option.innerText = `${app.name} (ID: ${app.appId})`;
          dropdown.appendChild(option);
        });
      }).getApplications();
    }

    function generateReport() {
      const selectedApp = JSON.parse(document.getElementById('appDropdown').value);
      appName = selectedApp.name;
      teamName = selectedApp.engagementId; // Assuming engagementId is the team name
      date = new Date().getDate();
      month = new Date().getMonth() + 1; // Month is zero-indexed
      year = new Date().getFullYear();

      document.getElementById('loadingAnimation').style.display = 'block';
      document.getElementById('loadingText').innerText = 'Generating report...';

      google.script.run.withSuccessHandler(function(url) {
        spreadsheetUrl = url;
        document.getElementById('loadingAnimation').style.display = 'none';
        document.getElementById('emailSection').style.display = 'block'; // Show email section
        document.getElementById('macroscopeNotification').innerText = 'Report generated successfully! You can send it via email.';
        document.getElementById('macroscopeNotification').style.display = 'block';
        showToast("Report generated successfully!");
        document.getElementById('visualizeButton').style.display = 'block'; // Show visualize button
      }).uploadFiles("Your CSV Data Here", teamName, appName, date, month, year);
    }

    function sendReportEmail() {
      let recipientEmail = document.getElementById('emailInput').value;
      if (!recipientEmail) {
        alert("Please enter a recipient email!");
        return;
      }

      google.script.run.withSuccessHandler(function(response) {
        alert(response);
      }).sendEmail(spreadsheetUrl, recipientEmail);
    }

    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.innerText = message;
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
    }

    function visualizeReport() {
      google.script.run.withSuccessHandler(function(html) {
        const visualizationWindow = window.open('', '_blank');
        visualizationWindow.document.write(html);
        visualizationWindow.document.close();
      }).visualizeData(spreadsheetUrl);
    }

    // Load applications when the page loads
    window.onload = loadApplications;
  </script>

</body>
</html>
