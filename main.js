const fs = require('fs');

//const for flatfile storage
///////////////////////////////////////////////////////////////////////////////////////
//NB this needs to be changed to be json on request of the reporting group
const flatFileString = (clientID, otp, successfull) => {
  `{'clientID': '${clientID}',
    'otp': '${otp}',
    'status': '${successfull}'
    }`;
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

//The Token class
class OTPToken {
    //constructor for token
    constructor(seconds = 60) {
      this.resetToken(seconds)
    }
    
    //set the valid time (the time the token is valid for)
    resetToken(seconds = 60) {
      this.currentTime = new Date();
      this.expireTime = new Date(this.currentTime.getTime() + seconds * 1000);
    }
  
    //returns whether the token has expired
    hasExpired() {
      var now = new Date();
      return (this.expireTime < now);
    }
  }

module.exports = {
	flatFileString, 
	generateOtp, 
	sleep,
	OTPToken
};