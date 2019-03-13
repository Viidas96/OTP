const express = require('express');
const app = express();

const main = require('./main.js');
const port = 5001;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DO NOT TOUCH THIS IS FOR LATER IN PHAZE 3

//The URL endpoints that we wil use to make POST requests
const frontEndUrl = "";
const notificationUrl = "";

//our endpoint and it expects a json object {'clientID':'someID'}
app.post("/otp", async(req,res) => {
  //generate a 5 digit OTP
  let OTP = main.generateOtp();
  //timer with default 60 seconds
  let timer = new main.OTPToken();

  //send a post request to Notification containing the clientID and the OTP we generated
  /*const notified = await fetch(notificationUrl, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  })*/
  
  alert(OTP);

  //a post to the ATM interface, userEnter will be the OTP the user entered in json form
  const userEnter = await fetch(frontEndUrl, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  });

  //compare OTP with userEnter, and check that timer.hasExpired is false then set valid to true and return the body to Authenticatrion

  res.json({valid});
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
  TODO
  we need a get request that will respond with the 
*/

//end of OTPToken Test
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

main.insertFlatFile('1','55500' , '',true);
