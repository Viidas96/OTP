const express = require('express');
conts app = express();

//start 

//generate otp pin, 5 digit long
function generateOtp() 
{
  return Math.floor(Math.random() * 100000);
}