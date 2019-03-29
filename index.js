const express = require('express');
const bodyParser = require('body-parser');
const main = require('./main.js');

const app = express();
//const port = process.env.PORT || 8080;
let clients = [];
app.use(express.json());

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
			<table style="width:900px">
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
		</div>
	</body>
</html>`;

//This is needed
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//The URL endpoints that we wil use to make POST requests
const notificationUrl = "";

app.get("/", (req, res) => {
  res.send(rootStr);
});

//our endpoint and it expects a json object {'clientID':'someID'}
app.post("/genotp", async (req, res) => {
  //generate a 5 digit OTP
  const clientID = req.body.clientID;
  const otp = main.generateOtp();

  //send a post request to Notification containing the clientID and the OTP we generated
  let notified = null;

  try {
    const notifiedRes = await fetch(notificationUrl, {
      method: 'POST',
      body: JSON.stringify({
        clientID: req.body.clientID,
        otp: otp
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    notified = await notifiedRes.json();
  }
  catch (err) {
    notified = {"status": false};
  }

  //create timestamp after notifications is polled
  const dateTime =  new Date().toString();

  var client = {
    clientID: clientID,
    otp:  otp,
    timestamp:dateTime
  };

  clients.push(client);

  res.json(notified);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/validate", async (req, res) => {
  //get clientID and pin then validate
  const clientID = req.body.clientID;
  const testOTP = req.body.otp;
  let response = null;
  let createdTime = clients.find( client => client.clientID === clientID);
  if(createdTime != null)
  {
    createdTime = createdTime.timestamp;
 
  const clientOTP = clients.find( client => client.clientID === clientID);
  const clientIndex = clients.findIndex(client => client.clientID === clientID);
  if (testOTP == clientOTP.otp) {
    //60000 because it returns miliseconds not seconds
    response = { status : main.validateTime(createdTime)};
    //if ran out of time clear array
    if(response.status == false)
    {
      clients.splice(clientIndex,1);
    }
  }
  else {
    response = { status: false };
  }

  //insert a log of this validation to the flatfile
  var value = main.insertFlatFile(clientID, clientOTP.otp, new Date().toISOString(), response.status);

  //remove the object from the array
  //delete clients[clientID];
  clients.splice(clientIndex,1);
  }
  else
  {
    response = { status: false };
  }
  res.json(response);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function to run in intervals
var minutes = 10;
var the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("I am doing my "+minutes+" minutes check");
  // do your stuff here
  var result = main.getLogs();
  //Need to call post to other sub system
}, the_interval);

//running the server
app.listen(process.env.PORT, () => 
{
  console.log(`API Running on heroku`);
});