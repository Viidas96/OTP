const express = require('express');
const OTPToken = require('./OTPToken')
const app = express();

//start

//generate otp pin, 5 digit long
function generateOtp() 
{
  return Math.floor(Math.random() * 100000);
}

//functions below is purely to use OTPToken
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
  
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

test(6)

//end of OTPToken Test
