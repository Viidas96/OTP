## The Documentation for the OTP service for the OCEAN Team
---
### Description
Authentication will poll OTP as soon as a client logs in to the application, OTP will then generate a code that is valid for {60} seconds, this code will be sent to Notifications alongside the clientID so a notification can be sent to the client, a prompt will be displayed on the app to tell the user that they should insert their pin. This pin will be sent back to OTP and validated, after it has been validated either true or false will be sent to Authentication.

### For Testing
Step 1: npm install on the demo server
Step 2: npm run
Step 3: type localhost:5001/test1 to see a valid use of the OTP client
Step 4: type localhost:5001/test2 to see a invalid use of the OTP client