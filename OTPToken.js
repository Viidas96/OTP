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

  module.exports = OTPToken