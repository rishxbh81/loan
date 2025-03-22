const { User } = require("../models/User");
const { UserProfile } = require("../models/UserProfile");
const { Investor } = require("../models/Investor");
const { generateOtp, validateOtp } = require("../services/otpService");
const { handleBadRequest, handleInternalError } = require("../components/common/errorHandler");
const sendEmail = require("../services/emailService");
const { BankingInfo } = require("../models/BankingInfo");
const { EmploymentProfile } = require("../models/Employment");
const { PersonalProfile } = require("../models/PersonalInformation");

const getProfileByRole = async (userId, role) => {
  if (role === "user") return await UserProfile.findOne({ user_id: userId });
  if (role === "investor") return await Investor.findOne({ investor_id: userId });
  return null;
};

const extractUserDetails = (req) => {
  const user = req.user?.user_id || req.user;
  return {
    userId: user?.user_id || user,
    role: req.user?.role || user?.role,
  };
};

exports.getUserProfile = async (req, res) => {
  try {
    const { userId, role } = extractUserDetails(req);
    if (!userId || !role) return handleBadRequest(res, "LA14", "Invalid user_id or role format");

    const profile = await getProfileByRole(userId, role);
    if (!profile) return handleBadRequest(res, "LA14", "Profile not found");

    return res.status(200).json({ uniqueCode: "LA14", status: "success", profile });
  } catch (error) {
    return handleInternalError(res, "LA14", "Server error");
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { profile, bankingInfo, employmentDetails, personalDetails } = req.body;
    const { userId, role } = extractUserDetails(req);

    if (!userId || !role) return handleBadRequest(res, "LA15", "Invalid user_id or role format");

    const user = await getUserByRole(userId, role);
    if (!user) return handleBadRequest(res, "LA15", "User not found");

    let userProfile = await getProfileByRole(userId, role);
    if (!userProfile) return handleBadRequest(res, "LA15", "Profile not found");

    const newEmail = profile?.email;

    if (newEmail && newEmail !== userProfile.email) {
      const otp = req.body.otp;
      if (!otp) return handleBadRequest(res, "LA15", "OTP is required for email update.");

      const otpValidationResult = validateOtpForEmailUpdate(newEmail, otp, user);
      if (!otpValidationResult.valid) return handleBadRequest(res, "LA15", otpValidationResult.message);

      userProfile.email = newEmail;
    }

    updateProfile(userProfile, profile);
    const updatedBankingInfo = bankingInfo ? await updateBankingInfo(userId, bankingInfo) : null;
    const updatedEmploymentProfile = employmentDetails ? await updateEmploymentProfile(userId, employmentDetails) : null;
    const updatedPersonalProfile = personalDetails ? await updatePersonalProfile(userId, personalDetails) : null;

    await userProfile.save();

    return res.status(200).json({
      uniqueCode: "LA15",
      status: "success",
      message: "Profile updated successfully",
      updatedProfile: await getProfileByRole(userId, role),
      updatedBankingInfo,
      updatedEmploymentProfile,
      updatedPersonalProfile,
    });
  } catch (error) {
    return handleInternalError(res, "LA15", "Server error");
  }
};

const getUserByRole = async (userId, role) => {
  return role === "user" ? await User.findOne({ user_id: userId }) : await Investor.findOne({ investor_id: userId });
};

const validateOtpForEmailUpdate = (email, otp, user) => {
  if (!otp) return { valid: false, message: "OTP is required for email update." };
  return validateOtp(otp, user.otp, user.otp_expiry);
};

const updateProfile = (userProfile, profile) => {
  if (!profile) return;
  if (profile.name) userProfile.name = profile.name;
  if (profile.address) userProfile.address = profile.address;
};

const updateBankingInfo = async (userId, bankingInfo) => {
  let userBankingInfo = await BankingInfo.findOne({ user_id: userId });

  if (!userBankingInfo) {
    userBankingInfo = new BankingInfo({ user_id: userId, ...bankingInfo });
  } else {
    Object.keys(bankingInfo).forEach((key) => {
      if (bankingInfo[key] !== undefined) userBankingInfo[key] = bankingInfo[key];
    });

    if (bankingInfo.account_number) {
      const existingAccount = await BankingInfo.findOne({ account_number: bankingInfo.account_number });
      if (existingAccount && existingAccount.user_id !== userId) {
        throw new Error("Account number already exists");
      }
    }
  }

  await userBankingInfo.save();
  return userBankingInfo;
};

const updateEmploymentProfile = async (userId, employmentDetails) => {
  let employmentProfile = await EmploymentProfile.findOne({ user_id: userId });

  if (!employmentProfile) {
    employmentProfile = new EmploymentProfile({ user_id: userId, ...employmentDetails });
  } else {
    Object.keys(employmentDetails).forEach((key) => {
      if (employmentDetails[key] !== undefined) employmentProfile[key] = employmentDetails[key];
    });
  }

  await employmentProfile.save();
  return employmentProfile;
};

const updatePersonalProfile = async (userId, personalDetails) => {
  let personalProfile = await PersonalProfile.findOne({ user_id: userId });

  if (!personalProfile) {
    personalProfile = new PersonalProfile({ user_id: userId, ...personalDetails });
  } else {
    Object.keys(personalDetails).forEach((key) => {
      if (personalDetails[key] !== undefined) personalProfile[key] = personalDetails[key];
    });
  }

  await personalProfile.save();
  return personalProfile;
};

exports.generateOtpForEmailChange = async (req, res) => {
  try {
    const { email } = req.body;
    const { userId, role } = extractUserDetails(req);

    if (!email) return handleBadRequest(res, "LA16", "Email is required.");

    const user = role === "user"
      ? await User.findOne({ user_id: userId })
      : await Investor.findOne({ investor_id: userId });

    if (!user) return handleBadRequest(res, "LA16", "User not found");

    const { otp, otpHash, otpExpiry } = generateOtp();

    user.otp = otpHash;
    user.otp_expiry = otpExpiry;
    await user.save();

    await sendEmail(email, "Your OTP for Email Update", `<p>Your OTP: <strong>${otp}</strong></p>`);

    return res.status(200).json({ uniqueCode: "LA16", status: "success", message: "OTP sent successfully" });
  } catch (error) {
    return handleInternalError(res, "LA16", "Server error");
  }
};
