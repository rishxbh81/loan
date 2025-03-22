const rateLimit = require("express-rate-limit");

const otpRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message:
    "Too many OTP requests from this IP, please try again after 15 minutes",
  headers: true,
});

module.exports = { otpRateLimiter };
