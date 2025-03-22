const { User } = require("../models/User");
const { UserProfile } = require("../models/UserProfile");
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { validatePhoneNumber, generateAndSendOtp } = require('../components/common/otpHandler');
const { generateOtp, validateOtp, hashPassword, comparePassword, generateCustomUserId } = require("../services/otpService");
const sendEmail = require("../services/emailService");


exports.registerGenerateOtp = async (req, res) => {
  const { email, password, mobile_number } = req.body;

  try {
    if (!email || !password || !mobile_number) {
      return res.status(400).json({
        uniqueCode: "LA01",
        message: "Email, password, and mobile number are required",
        data: "",
      });
    }

    if (!validatePhoneNumber(mobile_number)) {
      return res.status(400).json({
        uniqueCode: "LA01",
        message: "Invalid mobile number format",
        data: "",
      });
    }

    const existingProfile = await UserProfile.findOne({ phone: mobile_number });
    if (existingProfile) {
      return res.status(400).json({
        uniqueCode: "LA01",
        message: "User is already registered. Please log in instead.",
        data: "",
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = new User({
        user_id: await generateCustomUserId(),
        email: email.toLowerCase(),
        password: await hashPassword(password),
        mobile_number,
        role: "user",
      });
    } else {
      user.password = await hashPassword(password);
    }

    const otp = await generateAndSendOtp(user, mobile_number, email);

    await user.save();

    console.log("Saved User Data:", user); 
    await sendEmail(email, "Your OTP for Registration", `<p>Your OTP: <strong>${otp}</strong></p>`);

    return res.status(200).json({
      uniqueCode: "LA01",
      message: "OTP sent for registration",
      data: "",
    });
  } catch (error) {
    console.error("Error in registerGenerateOtp:", error);
    return res.status(500).json({
      uniqueCode: "LA01",
      message: "Error during registration OTP generation",
      data: "",
    });
  }
};


exports.registerValidateOtp = async (req, res) => {
  const { email,otp } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        uniqueCode: "LA02",
        message: "User not found. Please register first.",
        data: "",
      });
    }

    console.log("Stored OTP:", user.otp, "Expiry:", user.otp_expiry); 
    console.log("Received OTP:", otp, "Type:", typeof otp);

  
    const { valid, message } = validateOtp(otp, user.otp, user.otp_expiry);

    if (!valid) {
      console.log("OTP Validation Failed:", message); 
      return res.status(400).json({
        uniqueCode: "LA02",
        message,
        data: "",
      });
    }

    user.otp = null;
    user.otp_expiry = null;

    if (!user.user_id) {
      user.user_id = await generateCustomUserId();
      user.role = "user";
    }

    await user.save();

    let userProfile = await UserProfile.findOne({ user_id: user.user_id });
    if (!userProfile) {
      userProfile = new UserProfile({
        user_id: user.user_id,
        name: "Default Name",
        address: "Default Address",
        email: user.email,
        phone: user.mobile_number,
      });

      await userProfile.save();
    }

    const accessToken = generateToken(user.user_id, null, user.role);
    const refreshToken = generateRefreshToken(user.user_id);

    return res.status(200).json({
      status: "success",
      uniqueCode: "LA02",
      message: "Registration successful",
      accessToken,
      refreshToken,
      role: user.role
    });
  } catch (error) {
    console.error("Error in registerValidateOtp:", error);
    return res.status(500).json({
      uniqueCode: "LA02",
      message: "Error validating OTP for registration",
      data: "",
    });
  }
};


exports.loginGenerateOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        uniqueCode: "LA03",
        message: "Email is required",
        data: "",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        uniqueCode: "LA03",
        message: "User not found. Please register first!",
        data: "",
      });
    }
    if (!user.mobile_number) {
      return res.status(400).json({
        uniqueCode: "LA03",
        message: "User's mobile number is missing. Please update your profile.",
        data: "",
      });
    }

    const otp = await generateAndSendOtp(user, user.mobile_number);
  


    await sendEmail(email, "Your OTP for Login", `<p>Your OTP: <strong>${otp}</strong></p>`);

    return res.status(200).json({
      uniqueCode: "LA03",
      message: "OTP sent for login",
      data: "",
    });
  } catch (error) {
    console.error("Error in loginGenerateOtp:", error);
    return res.status(500).json({
      uniqueCode: "LA03",
      message: "Error during login OTP generation",
      data: "",
    });
  }
};

exports.loginValidateOtp = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        uniqueCode: "LA04",
        message: "User not found. Please register first!",
        data: "",
      });
    }

    // Validate password presence
    if (!password) {
      return res.status(400).json({
        uniqueCode: "LA04",
        message: "Password is required",
        data: "",
      });
    }

    // Ensure user has a password set
    if (!user.password) {
      return res.status(400).json({
        uniqueCode: "LA04",
        message: "User has no password set",
        data: "",
      });
    }

    // Validate password (Fix Applied)
    try {
      const { valid: passwordValid, message: passwordMessage } = await comparePassword(password, user.password);
      console.log("Password Validation Result:", passwordValid);

      if (!passwordValid) {
        console.log("Incorrect password. Returning response.");
        return res.status(400).json({
          uniqueCode: "LA04",
          message: passwordMessage || "Incorrect password",
          data: "",
        });
      }
    } catch (err) {
      console.error("Error comparing password:", err);
      return res.status(500).json({
        uniqueCode: "LA04",
        message: "Error while verifying password",
        data: "",
      });
    }

    // Debugging OTP validation
    console.log("Stored OTP:", user.otp, "Expiry:", user.otp_expiry);
    console.log("Received OTP:", otp, "Type:", typeof otp);
    console.log("OTP Expiry Time:", user.otp_expiry, "Current Time:", Date.now());

    // Validate OTP
    const { valid: otpValid, message: otpMessage } = validateOtp(otp, user.otp, user.otp_expiry);
    if (!otpValid) {
      return res.status(400).json({
        uniqueCode: "LA04",
        message: otpMessage,
        data: "",
      });
    }

    // Clear OTP after successful validation
    user.otp = null;
    user.otp_expiry = null;
    await user.save();

    // Generate tokens
    const accessToken = generateToken(user.user_id, null, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Successful response
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      accessToken,
      refreshToken,
      role: user.role,
      uniqueCode: "LA04",
    });

  } catch (error) {
    console.error("Error in loginValidateOtp:", error);
    return res.status(500).json({
      uniqueCode: "LA04",
      message: "Error validating OTP for login",
      data: "",
    });
  }
};


exports.refreshTokenHandler = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        uniqueCode: "LA05",
        message: "Refresh token not provided",
        data: "",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        uniqueCode: "LA05",
        message: "User not found",
        data: "",
      });
    }

    const newAccessToken = generateToken(user._id);

    return res.status(200).json({
      status: "success",
      uniqueCode: "LA05",
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(403).json({
      uniqueCode: "LA05",
      message: "Error refreshing token",
      data: "",
    });
  }
};
