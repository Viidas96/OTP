const express = require('express');
const fs = require('fs');

const OTPToken = require('./OTPToken')
const app = express();

//const for flatfile storage
const flatFileString = (clientID, otp, successfull) => {
  switch (successfull){
    case true: `${clientID} login request, ${otp} granted, login successful`;
    case false: `${clientID} login request, ${otp} granted, login unsuccessful`;
  }
}

//generate otp pin, 5 digit long
function generateOtp() 
{
  return Math.floor(Math.random() * 100000);
}

//functions below is purely to use OTPToken it is a testing function and will be removed at a later stage
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
  
//



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
