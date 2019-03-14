const express = require('express');
const bodyParser = require('body-parser');
const main = require('./main.js');

const app = express();
const port = 5001;
let clients = {};

//app.use(bodyParser.json);

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
  var value = main.insertFlatFile(clientID, clients[clientID].otp, new Date().toISOString(), response.status);

  //remove the object from the array
  delete clients[clientID];

  res.json(response);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/getlogs", async (req, res) => {
  console.log("called");
  //test data because function not implemented fully
  const fromDate = new Date(req.body.fromDate);
  const toDate = new Date(req.body.toDate);
  
  console.log(fromDate);
  console.log(toDate);
  let result = main.getLogs(fromDate,toDate);

  res.json(result);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//running the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//Bryan Testing
/*let valid = false;
valid = main.insertFlatFile(1,'555000','2019-03-13T19:07:30.695Z',false);
console.log(valid);
valid = main.insertFlatFile(1,'555001','2019-03-14T19:07:35.695Z',false);
console.log(valid);
//main.insertFlatFile(1,'555002','2019-03-15T19:07:32.695Z',false);
//main.insertFlatFile(1,'555003','2019-03-11T19:07:32.695Z',false);
//main.insertFlatFile(1,'555004','2019-03-13T19:07:32.695Z',false);
//main.insertFlatFile(1,'555005','2019-03-13T19:07:32.695Z',false);
let result = main.getLogs(new Date('2019-03-13T19:07:30.695Z'),new Date('2019-03-14T19:07:30.695Z'));
console.log(result);*/
