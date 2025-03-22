const express = require('express');
const router = express.Router();
const { otpRateLimiter } = require("../middleware/rateLimiter");
const { 
  registerGenerateOtp, 
  registerValidateOtp, 
  loginGenerateOtp, 
  loginValidateOtp, 
  refreshTokenHandler 
} = require("../controllers/AuthController");
const { 
  investorRegisterGenerateOtp, 
  investorRegisterValidateOtp, 
  investorLoginGenerateOtp, 
  investorLoginValidateOtp, 
  investorRefreshTokenHandler 
} = require("../controllers/investorAuthController");

router.post("/register/generate-otp", otpRateLimiter, registerGenerateOtp);
router.post("/register/validate-otp", registerValidateOtp);
router.post("/login/generate-otp", otpRateLimiter, loginGenerateOtp);
router.post("/login/validate-otp", loginValidateOtp);
router.post("/refresh-token", refreshTokenHandler);

router.post("/investor/register/generate-otp", otpRateLimiter, investorRegisterGenerateOtp);
router.post("/investor/register/validate-otp", investorRegisterValidateOtp);
router.post("/investor/login/generate-otp", otpRateLimiter, investorLoginGenerateOtp);
router.post("/investor/login/validate-otp", investorLoginValidateOtp);
router.post("/investor/refresh-token", investorRefreshTokenHandler);

module.exports = router;
