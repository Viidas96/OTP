const fs = require('fs');

/**
 * It adds the parameters parameters to a flat file in JSON format.
 * @param {String} clientID 
 * @param {String} OTP 
 * @param {String} timestamp 
 * @param {Bool} success 
 */
//Will happen sync
 function insertFlatFile(clientID, OTP, timestamp, success) {
  let fileName = 'flatfile.json';
    // async work
    var jsonContent = [];
    try{
    if(fs.existsSync(fileName)){
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
        fs.writeFileSync(fileName, JSON.stringify(jsonContent)); 
    }
    else {
      let insertLog = {
        id: 0,
        clientID: clientID,
        OTP: OTP,
        timestamp: timestamp,
        success: success
      };

      let lines = [];
      lines.push(insertLog);
      fs.appendFileSync(fileName, JSON.stringify(lines));
    }
    return true;
  }
  catch(e)
  {
    return false;
  }
}

/**
 * It checks the time the pin was created and checks it against the current time
 * and if its less than a minute it returns true  otherwise false.
 * @param {String} createdTime 
 * @param {String} checkTime 
 */
function validateTime(createdTime, checkTime = new Date()){
  createdTime = new Date(createdTime);
  
  return ((checkTime - createdTime) < 180000);
}

//generate otp pin, 5 digit long
function generateOtp() 
{
  
  var arr = [];
  for(var i=0; i<5;i++)
  {
    arr.push(Math.floor(Math.random()*10)+0);
  }
  var finalAns = "";
  for(var i=0; i<5;i++)
  {
    finalAns += arr[i];
  }
  return finalAns;
}

//Will happen sync
//This function gets all logs then removes them
 function getLogs(){
  //Need to read flatfile
  let fileName = 'flatfile.json';
  var jsonContent = [];
  var logs = [];
  if(fs.existsSync(fileName)) {
      var contents = fs.readFileSync(fileName);
      if (contents.length == 0) {
      }
      else {
        jsonContent = JSON.parse(contents);
      }

      let lastIndex = 0;
      for (var i = 0; i < jsonContent.length; i++) {
        var obj = jsonContent[i];
        logs.push(obj);
      }

      //Delete contents of file
      fs.writeFileSync(fileName,"");

      return JSON.stringify(logs);
      
    } else {
     //File does not exist
     fs.writeFileSync(fileName,"");
     return JSON.stringify(logs);
    }
}

module.exports = {
  generateOtp,
  insertFlatFile,
  getLogs,
  validateTime
};