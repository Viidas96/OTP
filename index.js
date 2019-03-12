const express = require('express');
const app = express();

const main = require('./main.js')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DO NOT TOUCH THIS IS FOR LATER IN PHAZE 3
/*
const frontEndUrl = "";
const notificationUrl = "";


app.post("/otp", async (req, res) => {
  // handle req.body to get clientID
  let OTP = main.generateOtp();

  //body will be clientID and OTP in json form
  fetch(notificationUrl, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  });
  //need to do a get request to user interface (so the user can input)
  const data = await fetch(frontEndUrl);
  //convert to json to access user OTP
  const dataAsJson = await data.json();

  //check if user entered same otp
  //set valid to result

  res.json({valid});
});
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//test "main" to demonstrate the working functionallity of the OTP 
async function test(seconds) {
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
}


//main function calls
test(6)

//end of OTPToken Test
