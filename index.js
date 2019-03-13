const express = require('express');
const bodyParser = require('body-parser');
const main = require('./main.js');

const app = express();
const port = 5001;
let clients = {};

app.use(bodyParser.json);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//The URL endpoints that we wil use to make POST requests
const notificationUrl = "";

//our endpoint and it expects a json object {'clientID':'someID'}
app.post("/genotp", async (req, res) => {
  //generate a 5 digit OTP
  const clientID = req.body.clientID;
  clients[clientID].otp = main.generateOtp();
  clients[clientID].timecreated = new Date().toISOString;

  //send a post request to Notification containing the clientID and the OTP we generated
  let notified = null;

  try {
    const notifiedRes = await fetch(notificationUrl, {
      method: 'POST',
      body: JSON.stringify({
        clientID: req.body.clientID,
        otp: OTP
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    notified = await notifiedRes.json();
  }
  catch (err) {
    notified = { "status": false };
    //for testing we will do other things in here 
  }

  res.json(notified);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/validate", async (req, res) => {
  //get clientID and pin then validate
  const clientID = req.body.clientID;
  const testOTP = req.body.otp;

  let createdTime = new Date(clients[clientID].createdTime);

  let response = null;
  if (testOTP == clients[clientID].otp) {
    //60000 because it returns miliseconds not seconds
    response = { status : main.validateTime(createdTime)};
  }
  else {
    response = { status: false };
  }

  //insert a log of this validation to the flatfile
  main.insertFlatFile(clientID, clients[clientID].otp, new Date().toISOString(), response.status);

  //remove the object from the array
  delete clients[clientID];

  res.json(response);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/getlogs", async (req, res) => {
  //test data because function not implemented fully

  let result = main.getLogs();

  res.json({ "id": 1, "clientID": "c1234", 'OTP': '12345', 'timeStamp': '2019-03-13T19:07:30.695Z', 'success': true }, { "id": 2, "clientID": "c1235", 'OTP': '98765', 'timeStamp': '2019-03-13T19:09:30.695Z', 'success': false });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//running the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//testing thing
main.insertFlatFile('1', '55500', '', true);