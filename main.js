const fs = require('fs');
const AsyncLock = require('async-lock');
var lock = new AsyncLock();

//@author Bryan Janse Van Vuuren u16217498
//This function will create and insert into a flatfile.
function insertFlatFile(clientID, OTP, timestamp, success) {
  let fileName = 'flatfile.json';
  lock.acquire('key', function (done) {
    // async work
    var jsonContent = [];
    fs.exists(fileName, function (exists) {
      if (exists) {
        var contents = fs.readFileSync(fileName);
        if (contents.length == 0) {
          //console.log("No data in file");
        }
        else {
          jsonContent = JSON.parse(contents);
        }

        let lastIndex = 0;
        for (var i = 0; i < jsonContent.length; i++) {
          var obj = jsonContent[i];
          lastIndex = obj.id;
        }
        let insertLog = {
          id: lastIndex + 1,
          clientID: clientID,
          OTP: OTP,
          timestamp: timestamp,
          success: success
        };
        jsonContent.push(insertLog);
        fs.writeFile(fileName, JSON.stringify(jsonContent), function (err) {
          if (err) {
            throw err;
          }
          console.log('Inserted into flatfile');
        });
      } else {
        let insertLog = {
          id: 0,
          clientID: clientID,
          OTP: OTP,
          timestamp: timestamp,
          success: success
        };

        let lines = [];
        lines.push(insertLog);
        fs.appendFile(fileName, JSON.stringify(lines), function (err) {
          if (err) {
            throw err;
          }
          console.log('Inserted into flatfile');
        });
      }
    });

  }, function (err, ret) {
    // lock released
  });

}

//generate otp pin, 5 digit long
function generateOtp() {
  return Math.floor(Math.random() * 100000);
}

/*
  TODO
  create a function that will return a stringified collection from the flatfile between 2 dates
*/
function getLogs(startDay, endDay){

}


/* 
  TODO
  See if this can still be used else remove it
*/

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
  OTPToken,
  insertFlatFile,
  getLogs
};