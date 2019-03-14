const express = require('express');
const bodyParser = require('body-parser');
const main = require('./main.js');

const app = express();
const port = 5001;
let clients = [];
app.use(express.json());

//This is needed
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//The URL endpoints that we wil use to make POST requests
const notificationUrl = "";

//our endpoint and it expects a json object {'clientID':'someID'}
app.post("/genotp", async (req, res) => {
  //generate a 5 digit OTP
  const clientID = req.body.clientID;
  const otp = main.generateOtp();
  //clients[clientID].otp = main.generateOtp();
  //clients[clientID].timecreated = new Date().toISOString;
  const dateTime =  new Date().toString();
  var client = {
    clientID: clientID,
    otp:  otp,
    timestamp:dateTime
  };
 // console.log(new Date().getTimezoneOffset());
  clients.push(client);

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

    //notified = {"status": false};
    //for testing we will do other things in here 
    //We will never send otp aswell only for testing
    notified = {"status": true,"otp":otp};
  }

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
  var value = main.insertFlatFile(clientID, clientOTP.otp, new Date().toString(), response.status);

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

app.post("/getlogs", async (req, res) => {
  //test data because function not implemented fully
  const fromDate = new Date(req.body.fromDate);
  const toDate = new Date(req.body.toDate);
  
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
