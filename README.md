## The Documentation for the OTP service for the OCEAN Team
---
## Requirements
- Node
- npm

## Setup
### To run
- npm install --save
- npm start / node index.js
### To test
- npm install --save-dev
- npm run test  
---
## Unit testing 
- Unit tests are setup using [jest](https://jestjs.io/docs/en/getting-started) and tests are written in main.test.js
---
## How it works
- Authentication team sends the OTP team the client ID.
- OTP team generates the OPT.
- The OTP and client ID is passed down to the notification team.
- The notification team sends the OTP to the client based on the client ID .
- The ATM Stimulation team captures the pin types in and sends it to the authentication team.
- Authentication sends the pin to OTP team to check if the pin send before is equal to the pin entered by the client.
- OTP team  does the validation of the pin and sends the status of it to the Authentication team.
- OTP team then sends the audit log to the Report team.
---
## Functions

```javascript
validateTime(createdTime, checkTime = new Date())
```
It checks the time the pin was created and checks it against the current time
and if its less than a minute it returns true  otherwise false.

```javascript
generateOtp()
```
Returns a 5 digit OTP.

```javascript
getLogs(startDay, endDay)
```
It returns logs from the startDay to the endDay.

```javascript
insertFlatFile(clientID, OTP, timestamp, success)
```

It adds the following parameters {clientID, OTP, timestamp, success} 
to a flat file in Json format.
