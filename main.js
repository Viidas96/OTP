const fs = require('fs');
const { Client } = require('pg')
//const client = new Client('postgres://daafgflhjhwmzt:1d7788d71fbe3cf20d1814dc9cb8159b57a5b7dff28cd5c01b0ad820c71e3932@ec2-184-73-210-189.compute-1.amazonaws.com:5432/de6ur42bgaj3ss');
const client = new Client({
  host: 'ec2-184-73-210-189.compute-1.amazonaws.com',
  port: 5432,
  user: 'daafgflhjhwmzt',
  database:'de6ur42bgaj3ss',
  ssl:true,
  password: '1d7788d71fbe3cf20d1814dc9cb8159b57a5b7dff28cd5c01b0ad820c71e3932',
})
/**
 * It adds the parameters parameters to a flat file in JSON format.
 * @param {String} clientID 
 * @param {String} OTP 
 * @param {String} timestamp 
 * @param {Bool} success 
 */
//Will happen sync
  async function insertFlatFile(clientID, OTP, timestamp, success) {
    timestamp = timestamp * 1000;
    client.query('INSERT INTO public.logs(timestamp,"clientID","OTP",success) VALUES ($1,$2,$3,$4)',[timestamp,clientID,OTP,success])
    .then(res => {
      console.log("Inserted");
      return true;
    })
    .catch(e => 
      {
        console.error("Failed to insert");
        console.log(e);
        return false;
      });
 /* let fileName = 'flatfile.json';
  timestamp = timestamp * 1000;
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

        for (var i = 0; i < jsonContent.length; i++) {
          var obj = jsonContent[i];
        }
        let insertLog = {
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
  }*/
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
 async function getLogs(){
  var results = [];
  results = await client.query('SELECT * FROM public.logs ORDER BY timestamp desc',[]);
  return results.rows;
    
  //Need to read flatfile
  /*let fileName = 'flatfile.json';
  var jsonContent = [];
  var logs = [];
  try{
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

      return logs;
      
    } else {
     //File does not exist
     fs.writeFileSync(fileName,"");
     return logs;
    }
  }
  catch(err)
  {
    console.log(JSON.stringify(err));
    return logs;
  }*/
}

module.exports = {
  generateOtp,
  insertFlatFile,
  getLogs,
  validateTime,
  client
};