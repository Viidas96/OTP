const express = require('express');
const main = require('./main.js');
var moment = require('moment');
const app = express();
const fetch = require('node-fetch');

let clients = [];
app.use(express.json());

try{
  main.client.connect();
  console.log("Connected to postgress")
}
catch(err)
{
  console.log(err);
}


const rootStr = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Ocean OTP root page</title>
		<style>
			table{
				margin: auto;
			}
			table, tr, td {
				border: 1px solid black;
				text-align: center;
			}
		</style>
	</head>
	<body>
		<div>
			<table style="width:1000px">
				<tr><td colspan="7"><p>Endpoints Available</p></td></tr>
				<tr>
					<td><p>Endpoint</p></td>
					<td><p>Description</p></td>
					<td><p>Method</p></td>
					<td><p>Parameter</p></td>
					<td><p>Example Parameters</p></td>
					<td><p>Response</p></td>
					<td><p>Example Response</p></td>
				</tr>
				<tr>
					<td><code>/genotp</code></td>
					<td><code>Generates a otp code and sends it to notification module</code></td>
					<td><code>POST</code></td>
					<td><code>clientID: string</code></td>
					<td><code>'clientID': 'c12345'</code></td>
					<td><code>status: bool</code></td>
					<td><code>'status': true</code></td>
				</tr>
				<tr>
					<td><code>/validate</code></td>
					<td><code>Tests a given OTP and returns the status</code></td>
					<td><code>POST</code></td>
					<td><code>clientID: string, otp: string</code></td>
					<td><code>'clientID': 'c12345', 'otp': '12345'</code></td>
					<td><code>status: bool</code></td>
					<td><code>'status': true</code></td>
				</tr>
			</table>
			<!--<table style="width:720px">
				<tr>
					<td>Endpoint</td>
					<td>Statuses returned</td>
					<td>Code</td>
				</tr>
				<tr>
					<td>/genotp</td>
					<td>Success</td>
					<td>200</td>
				</tr>
				<tr>
					<td>/genotp</td>
					<td>/genotp Failure</td>
					<td>503</td>
				</tr>
				<tr>
					<td>/genotp</td>
					<td>Notification Failure</td>
					<td>Appropriot error sent by Notification</td>
				</tr>
				<tr>
					<td>/validate</td>
					<td>Success</td>
					<td>200</td>
				</tr>
				<tr>
					<td>/validate</td>
					<td>Failure</td>
					<td>401</td>
				</tr>
			</table>-->
		</div>
	</body>
</html>`;

//This is needed
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//The URL endpoints that we wil use to make POST requests
const notificationUrl = "https://fnbsim.southafricanorth.cloudapp.azure.com/otp";

app.get("/", (req, res) => {
  res.send(rootStr);
});

//our endpoint and it expects a json object {'clientID':'someID'}
app.post("/genotp", async (req, res) => {
  //generate a 5 digit OTP
  const tclientID = req.body.clientID;
  const totp = main.generateOtp();

  //send a post request to Notification containing the clientID and the OTP we generated
  let notified = null;

  try {
    const notifiedRes = await fetch(notificationUrl, {
      method: 'POST',
      body: JSON.stringify({
        clientID: tclientID,
        otp: totp
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    notified = await notifiedRes.text();
  }
  catch (err) {
    notified = { "status": false };
  }

  //create timestamp after notifications is polled
  const dateTime = new Date().toString();

  var client = {
    clientID: tclientID,
    otp: totp,
    timestamp: dateTime
  };

  if (notified == "Email sent successfully") {
    notified = { "status": true };
  }
  else {
    notified = { "status": false };
  }

  clients.push(client);
  //needs to be notified
  res.json(notified);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/validate", async (req, res) => {
  //get clientID and pin then validate
  const clientID = req.body.clientID;
  const testOTP = req.body.otp;
  let response = null;
  let createdTime = clients.find(client => client.clientID === clientID);
  if (createdTime != null) {
    createdTime = createdTime.timestamp;

    const clientOTP = clients.find(client => client.clientID === clientID);
    const clientIndex = clients.findIndex(client => client.clientID === clientID);
    if (testOTP == clientOTP.otp) {
      //60000 because it returns miliseconds not seconds
      response = { status: main.validateTime(createdTime) };
    }
    else {
      response = { status: false };
    }

    //insert a log of this validation to the flatfile
    var value = main.insertFlatFile(clientID, clientOTP.otp, moment().unix(), response.status);

    //remove the object from the array
    clients.splice(clientIndex, 1);
  }
  else {
    response = { status: false };
    clients.splice(clientIndex, 1);
  }

  res.json(response);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//function to run in intervals
var minutes = 1;
var the_interval = minutes * 60 * 1000;
setInterval(async function () {
  reportingUrl = "https://fnbreports-6455.nodechef.com/api";
  console.log("Sending Logs to reporting");
  // do your stuff here
  var result = await main.getLogs();
  if(result.length == 0)
  {
    //Do nothing
    console.log("No data to send");
  }
  else {
    result = JSON.stringify(result);
    try {
      const reportingRes = await fetch(reportingUrl, {
        method: 'POST',
        body: JSON.stringify({
          system: "OTPS",
          data: result
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      reporting = await reportingRes.text();
    }
    catch (err) {
      reporting = { "status": false };
      console.log(JSON.stringify(reporting));
    }
  }
  //console.log(result);
  //Need to call post to other sub system
}, the_interval);

//running the server

//process.env.PORT
app.listen(process.env.PORT, () => {
  console.log(`API Running on heroku`);
});