const main = require("./main.js");

test('Testing that OTP has 5 characters', () => {
	expect(main.generateOtp().toString().length).toBe(5);
});