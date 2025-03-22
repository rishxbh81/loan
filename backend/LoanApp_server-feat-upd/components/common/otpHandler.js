const otpService = require("../../services/otpService");
const { User } = require("../../models/User");


const validatePhoneNumber = (mobile_number) => /^[6-9]\d{9}$/.test(mobile_number);


const generateAndSendOtp = async (user, mobile_number, email = null) => {
  const { otp, otpHash, otpExpiry } = otpService.generateOtp();
  console.log(`Generated OTP for ${mobile_number}: ${otp}`);

  user.mobile_number = mobile_number;
  user.email = email || user.email;
  user.otp = otpHash;
  user.otp_expiry = otpExpiry;
  user.created_at = new Date();

  await user.save();
  return otp; 
};

module.exports = {
  validatePhoneNumber,
  generateAndSendOtp,
};
