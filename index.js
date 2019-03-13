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
//1. Require OTP so call this function from AUTH sub system
app.post("/otp", async (req, res) => {
  //generate a 5 digit OTP
  let OTP = main.generateOtp();
  console.log("Generated OTP:" + OTP);

  //timer with default 60 seconds
  let timer = new main.OTPToken();

  //send a post request to Notification containing the clientID and the OTP we generated
  /*const notified = await fetch(notificationUrl, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  })*/
  
  //a post to the ATM interface, userEnter will be the OTP the user entered in json form
  /*const userEnter = await fetch(frontEndUrl, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  });*/

  //compare OTP with userEnter, and check that timer.hasExpired is false then set valid to true and return the body to Authenticatrion

  res.json(true);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
  TODO
  we need a get request that will respond with the 
*/

//test "main" to demonstrate the working functionallity of the OTP 
/*async function test(seconds) {
  console.log('Creating token with 5 seconds expire time.');
  let t = new OTPToken(5);
  console.log('Token Created.');
  console.log('Sleeping for ' + seconds + ' seconds');
  await sleep(seconds * 1000);
  console.log('Awaken');
  console.log('Has your token expired?');
  
  if (t.hasExpired()) {
    console.log('Yes');
  } 
  else { 
    console.log('No');  
  }
}*/

//main function calls
//test(6)

//end of OTPToken Test
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
