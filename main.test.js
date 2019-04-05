const main = require("./main.js");

const notificationUrl = "https://fnbsim.southafricanorth.cloudapp.azure.com/otp";

test('OTP has 5 characters', () => {
	expect(main.generateOtp().toString().length).toBe(5);
});

test('Validate returns true if time difference is less than 60s', () => {
	expect(main.validateTime(new Date('2019-03-13T19:09:30.695Z'), new Date('2019-03-13T19:09:50.695Z'))).toBe(true);
});

test('Validate returns false if time difference is more than 60s', () => {
	expect(main.validateTime(new Date('2019-03-13T19:9:30.695Z'), new Date('2019-03-13T19:10:50.695Z'))).toBe(false);
});

// test('Validate returns true if insert into flatfile correct',()=>
// {
// 	expect(main.insertFlatFile('1','555000',new Date(),false));
// });