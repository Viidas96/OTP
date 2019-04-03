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
- Authentication sends the pin to OTP team to check if the pin sent before is the same as the pin entered by the client.
- OTP team  does the validation of the pin and sends the status of it to the Authentication team.
- OTP team then sends the audit log to the Report team.
---
## Sequence Diagrams
![image](https://raw.githubusercontent.com/Viidas96/OTP/Documentation/OTPAuthentication.jpg)
1. Authentication sends the client ID to the the OTP who generates a pin
2. OTP sends the generated pin along with the client ID to notifications so they can send a notification the OTP to the client with the clientID.
3. Notifications sends delivery report(true/false)
4. OTP passes on the delivery report to Authentication
5. Authentication sends the OTP received from ATM simulation that the client had entered along with the client ID for OTP to validate by checking whether the OTP sent through is the same as the OTP generated.
6. OTP sends back the the validity report(true/false)

![image](https://raw.githubusercontent.com/Viidas96/OTP/Documentation/newLogs.jpg)
1. OTP sends their transaction logs to Reporting every 10 minutes.
2. Reporting sends response(successful/not successful)
---
[![Waffle.io - Issues in progress](https://badge.waffle.io/Viidas96/OTP.png?label=in%20progress&title=In%20Progress)](http://waffle.io/Viidas96/OTP)
---
