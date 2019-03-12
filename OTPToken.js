class OTPToken {
    constructor(seconds = 60) {
      this.resetToken(seconds)
    }
  
    resetToken(seconds = 60) {
      this.currentTime = new Date();
      this.expireTime = new Date(this.currentTime.getTime() + seconds * 1000);
    }
  
    hasExpired() {
      var now = new Date();
      return (this.expireTime < now);
    }
  }

  module.exports = OTPToken