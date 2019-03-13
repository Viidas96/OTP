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
### Description
Authentication will poll OTP as soon as a client logs in to the application, OTP will then generate a code that is valid for {60} seconds, this code will be sent to Notifications alongside the clientID so a notification can be sent to the client, a prompt will be displayed on the app to tell the user that they should insert their pin. This pin will be sent back to OTP and validated, after it has been validated either true or false will be sent to Authentication.