const crypto = require("crypto");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const  {Investor}  = require("../models/Investor");
const { User } = require("../models/User"); 
const Loan = require("../models/Loan");  
const { Portfolio } = require("../models/Portfolio");
const { Investment } = require("../models/Investment"); 
const { Earnings } = require("../models/Earnings"); 

const generateOtp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  const otpExpiry = moment().add(5, "minute").toDate();
  return { otp, otpHash, otpExpiry };
};

const validateOtp = (inputOtp, storedOtpHash, otpExpiry) => {
  const inputOtpHash = crypto.createHash("sha256").update(inputOtp).digest("hex");

  if (inputOtpHash !== storedOtpHash) {
    return { valid: false, message: "Invalid OTP" };
  }

  if (moment().isAfter(moment(otpExpiry))) {
    return { valid: false, message: "OTP has expired" };
  }

  return { valid: true };
};


const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.error("Error hashing password:", err);
    throw new Error('Error hashing password');
  }
};

const comparePassword = async (enteredPassword, storedHashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
    console.log("Password comparison result:", isMatch); 

    return { valid: isMatch, message: isMatch ? "Password is correct" : "Incorrect password" };
  } catch (err) {
    console.error("Error comparing passwords:", err);
    return { valid: false, message: "Error comparing passwords" };
  }
};



const generateCustomUserId = async () => {
  const generateId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alpha = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
    const number = Math.floor(10000 + Math.random() * 90000); 
    return alpha + number; 
  };

  let unique = false;
  let userId;

  while (!unique) {
    userId = generateId();
    const existingUser = await User.findOne({ user_id: userId });
    if (!existingUser) unique = true; 
  }

  return userId;
};

const generateLoanId = async () => {
  const generateId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alpha = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
    const number = Math.floor(10000 + Math.random() * 90000); 
    return 'L' + alpha + number;
  };

  let unique = false;
  let loanId;

  while (!unique) {
    loanId = generateId();
    const existingLoan = await Loan.findOne({ loan_id: loanId });
    if (!existingLoan) unique = true; 
  }

  return loanId;
};

const generatePortfolioId = async () => {
  const generateId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alpha = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
    const number = Math.floor(10000 + Math.random() * 90000); 
    return "P" + alpha + number;
  };

  let unique = false;
  let portfolioId;

  while (!unique) {
    portfolioId = generateId();
    const existingPortfolio = await Portfolio.findOne({ portfolio_id: portfolioId });
    if (!existingPortfolio) unique = true;
  }

  return portfolioId;
};


const generateInvestmentId = async () => {
  const generateId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alpha = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
    const number = Math.floor(10000 + Math.random() * 90000); 
    return "I" + alpha + number;  
  };

  let unique = false;
  let investmentId;

  
  while (!unique) {
    investmentId = generateId();
    const existingInvestment = await Investment.findOne({ investment_id: investmentId }); 
    if (!existingInvestment) unique = true;  
  }

  return investmentId;
};


const generateEarningId = async () => {
  const generateId = () => {
    const number = Math.floor(100000 + Math.random() * 900000); 
    return "E" + number;
  };

  let unique = false;
  let earningId;

  while (!unique) {
    earningId = generateId();
    const existingEarning = await Earnings.findOne({ earning_id: earningId });
    if (!existingEarning) unique = true;
  }

  return earningId;
};

const generateInvestorId = async () => {
  const generateId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alpha = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
    const number = Math.floor(10000 + Math.random() * 90000);
    return "IV" + alpha + number; // Format: IVAB12345
  };

  let unique = false;
  let investorId;

  while (!unique) {
    investorId = generateId();
    const existingInvestor = await Investor.findOne({ investor_id: investorId });
    if (!existingInvestor) unique = true;
  }

  return investorId;
};



module.exports = { generateOtp, validateOtp, hashPassword, comparePassword ,generateCustomUserId,generateLoanId,generatePortfolioId,generateInvestmentId,generateInvestorId};
