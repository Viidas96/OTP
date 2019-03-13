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

function validateTime(createdTime, checkTime = new Date()){
  return ((checkTime.getTime() - createdTime.getTime()) < 60000)
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//generate otp pin, 5 digit long
function generateOtp() {
  let number = '';
  for(let i = 0; i < 5; i++){
    number += getRandomInt(10);
  }
  return number;
}

/*
  TODO
  create a function that will return a stringified collection from the flatfile between 2 dates
*/
function getLogs(startDay, endDay){

}

module.exports = {
  generateOtp,
  insertFlatFile,
  getLogs,
  validateTime
};