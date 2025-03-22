const  {Investor}  = require("../models/Investor");
const { Portfolio } = require("../models/Portfolio");
const { UserProfile } = require("../models/UserProfile");
const { Investment } = require("../models/Investment");
const Earnings = require("../models/Earnings");
const NotificationPreference = require("../models/NotificationPreference");
const { generateToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const { validatePhoneNumber, generateAndSendOtp } = require("../components/common/otpHandler");
const { generateOtp, validateOtp, hashPassword, comparePassword,generatePortfolioId ,generateInvestmentId ,generateInvestorId } = require("../services/otpService"); 
const { handleBadRequest, handleInternalError } = require('../components/common/errorHandler');
const Loan = require("../models/Loan");
const LoanDetails = require("../models/LoanDetails");
const notificationService = require("../services/loanNotificationService");
const {userApprovalNotification}= require("../services/UserNotification");
const sendEmail = require("../services/emailService");

exports.investorRegisterGenerateOtp = async (req, res) => {
  const { mobile_number, email, password } = req.body;

  try {
    if (!mobile_number || !email || !password) {
      return res.status(400).json({
        uniqueCode: "LA18",
        message: "Mobile number, email, and password are required",
        data: "",
      });
    }
    
    let investor = await Investor.findOne({ $or: [{ mobile_number }, { email }] });
    if (investor) {
      return res.status(400).json({
        uniqueCode: "LA18",
        message: "Investor already registered. Please log in instead.",
        data: "",
      });
    }

    const investor_id = await generateInvestorId(); 

    investor = new Investor({
      investor_id,
      mobile_number,
      email,
      password: await hashPassword(password),
      role: "investor", 
    });

    const otp=await generateAndSendOtp(investor, mobile_number, email);
    await sendEmail(email, "Your OTP for Registration", `<p>Your OTP: <strong>${otp}</strong></p>`);

    return res.status(200).json({
      uniqueCode: "INV18",
      message: "OTP sent for investor registration",
      data: "",
    });
  } catch (error) {
    console.error("Error during registration OTP generation:", error);
    return res.status(500).json({
      uniqueCode: "INV18",
      message: "Error during investor registration OTP generation",
      data: error.message,
    });
  }
};


exports.investorRegisterValidateOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const investor = await Investor.findOne({ email });

    
    const { valid, message } = validateOtp(otp, investor.otp, investor.otp_expiry);
    if (!valid) {
      console.log("OTP validation failed, deleting investor...");
      await Investor.deleteOne({ _id: investor._id }); 
      return res.status(400).json({ uniqueCode: "INV19", message, data: "" });
    }

    
    let existingPortfolio = await Portfolio.findOne({ investor_id: investor.investor_id });

    if (!existingPortfolio) {
      const portfolio_id = await generatePortfolioId();
      if (!portfolio_id) {
        return res.status(500).json({ message: "Error generating portfolio ID" });
      }
    
      existingPortfolio = await Portfolio.create({
        portfolio_id,
        investor_id: investor.investor_id,
        total_funds: 0,
        active_loans: 0,
        roi: 0,
        monthly_earnings: 0,
      });
    }

    
    const accessToken = generateToken(null, investor.investor_id, "investor");

    const refreshToken = generateRefreshToken({ investor_id: investor.investor_id });

    return res.status(200).json({
      status: "success",
      uniqueCode: "INV21",
      message: "Investor register successful",
      accessToken,
      refreshToken,
      role: investor.role, 
    });
  } catch (error) {
    console.error("Error validating OTP for investor registration:", error);

   
    await Investor.deleteOne({ mobile_number });

    return res.status(500).json({
      uniqueCode: "INV19",
      message: "Error validating OTP for investor registration",
      data: "",
    });
  }
};


exports.investorLoginGenerateOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        uniqueCode: "LA03",
        message: "Email is required",
        data: "",
      });
    }

    const investor = await Investor.findOne({ email });
    if (!investor) {
      return res.status(400).json({
        uniqueCode: "INV20",
        message: "Investor not found. Please register first!",
        data: "",
      });
    }

  
    const otp = await generateAndSendOtp(investor, investor.mobile_number);
  
    await sendEmail(email, "Your OTP for Login", `<p>Your OTP: <strong>${otp}</strong></p>`);

    return res.status(200).json({
      uniqueCode: "INV20",
      message: "OTP sent for login",
      data: "",
    });
  } catch (error) {
    return res.status(500).json({
      uniqueCode: "INV20",
      message: "Error during login OTP generation",
      data: "",
    });
  }
};

exports.investorLoginValidateOtp = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const investor = await Investor.findOne({ email });

    if (!investor) {
      return res.status(400).json({
        uniqueCode: "INV21",
        message: "Investor not found. Please register first!",
        data: "",
      });
    }

    if (!password) {
      return res.status(400).json({
        uniqueCode: "INV21",
        message: "Password is required",
        data: "",
      });
    }

    if (!investor.password) {
      return res.status(400).json({
        uniqueCode: "INV21",
        message: "Investor has no password set",
        data: "",
      });
    }

    const { valid, message } = await comparePassword(password, investor.password);
    if (!valid) {
      return res.status(400).json({
        uniqueCode: "INV21",
        message,
        data: "",
      });
    }

    const { valid: otpValid, message: otpMessage } = validateOtp(otp, investor.otp, investor.otp_expiry);
    if (!otpValid) {
      return res.status(400).json({
        uniqueCode: "INV21",
        message: otpMessage,
        data: "",
      });
    }
    const accessToken = generateToken(null, investor.investor_id, "investor");

    const refreshToken = generateRefreshToken({ investor_id: investor.investor_id.toString(), role: investor.role });
    
    return res.status(200).json({
      status: "success",
      uniqueCode: "INV21",
      message: "Investor login successful",
      accessToken,
      refreshToken,
      role: investor.role, 
    });
    
  } catch (error) {
    return res.status(500).json({
      uniqueCode: "INV21",
      message: "Error validating OTP for login",
      data: "",
    });
  }
};
  

exports.investorRefreshTokenHandler = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        uniqueCode: "INV22",
        message: "Refresh token not provided",
        data: "",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const investor = await Investor.findById(decoded.id);

    if (!investor) {
      return res.status(401).json({
        uniqueCode: "INV22",
        message: "Investor not found",
        data: "",
      });
    }

    const newAccessToken = generateToken(investor._id);

    return res.status(200).json({
      status: "success",
      uniqueCode: "INV22",
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Error refreshing token:", err.message);
    return res.status(403).json({
      uniqueCode: "INV22",
      message: "Error refreshing token",
      data: "",
    });
  }
};


exports.getLoanOpportunities = async (req, res) => {
  try {
    const { investor_id, roi, tenure, amount = 50, sortBy, order } = req.query;
    let query = { status: "Pending" };

    if (roi) query.interest_rate = { $gte: parseFloat(roi) };
    if (tenure) query["loanDetails.repayment_schedule"] = { $size: parseInt(tenure) };
    if (amount) query.amount = { $gte: parseFloat(amount) };

    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    const loans = await Loan.find(query).sort(sortOptions).lean();

    if (!loans.length) {
      return res.status(404).json({
        uniqueCode: "INV26",
        message: `No loan opportunities available with amount ≥ ${amount}`,
        data: [],
      });
    }

    const loanList = await Promise.all(
      loans.map(async (loan) => {
        const userProfile = await UserProfile.findOne({ user_id: loan.user_id }).lean();
        const loanDetails = await LoanDetails.findOne({ loan_id: loan.loan_id }).lean();
        const tenureMonths = loanDetails ? loanDetails.repayment_schedule.length : 0;

        return {
          loan_id: loan.loan_id,
          borrower_name: userProfile ? userProfile.name : "Unknown",
          amount: loan.amount,
          roi: `${loanDetails ? loanDetails.interest_rate : 0}%`,
          tenure: `${tenureMonths} months`,
          status: loan.status, // Keep status as-is
        };
      })
    );

    return res.status(200).json({
      uniqueCode: "INV27",
      message: "Loan opportunities fetched successfully",
      data: loanList,
    });

  } catch (error) {
    console.error("Error fetching loan opportunities:", error);

    return res.status(500).json({
      uniqueCode: "INV28",
      message: "Error fetching loan opportunities",
      data: "",
      error: error.message,
    });
  }
};


exports.updateLoanStatusToUnderReview = async (req, res) => {
  try {
    const {  loan_id } = req.body;
    const investor_id = req.user?.investor_id;
    if (!investor_id || !loan_id) {
      return res.status(400).json({
        uniqueCode: "INV29",
        message: "Investor ID and Loan ID are required",
      });
    }

    const loan = await Loan.findOne({ loan_id });

    if (!loan) {
      return res.status(404).json({
        uniqueCode: "INV30",
        message: "Loan not found",
      });
    }

    if (loan.status !== "Pending") {
      return res.status(400).json({
        uniqueCode: "INV31",
        message: "Loan is not available for selection",
      });
    }

    await Loan.updateOne({ loan_id }, { status: "Under Review" });

 
    await notificationService.sendLoanOpportunityNotification(loan_id);

    return res.status(200).json({
      uniqueCode: "INV32",
      message: "Loan status updated to Under Review",
    });

  } catch (error) {
    console.error("Error updating loan status:", error);

    return res.status(500).json({
      uniqueCode: "INV33",
      message: "Error updating loan status",
      error: error.message,
    });
  }
};

exports.confirmInvestment = async (req, res) => {
  try {
    const { loan_id, amount } = req.body;
    const investor_id = req.user?.investor_id;

    if (!investor_id) {
      return res.status(401).json({ status: "error", message: "Unauthorized: Investor ID missing" });
    }

    if (!loan_id || !amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ status: "error", message: "Valid Loan ID and Amount are required" });
    }

    // ✅ Find the loan
    const loan = await Loan.findOne({ loan_id });
    if (!loan) {
      return res.status(404).json({ status: "error", message: "Loan not found" });
    }

    if (!["Pending", "Under Review"].includes(loan.status)) {
      return res.status(400).json({ status: "error", message: "Loan is not open for investment" });
    }

    // ✅ Fetch total interest from LoanDetails
    const loanDetails = await LoanDetails.findOne({ loan_id });
    if (!loanDetails) {
      return res.status(404).json({ status: "error", message: "Loan details not found" });
    }

    const totalInterest = parseFloat(loanDetails.total_interest) || 0;

    // ✅ Get Current Month
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: "YYYY-MM"

    // ✅ Check if the investor already invested in this **specific loan**
    let investment = await Investment.findOne({ investor_id});

    if (investment) {
      // Ensure `monthlyInterest` exists as an array
      if (!Array.isArray(investment.monthlyInterest)) {
        investment.monthlyInterest = [];
      }

      // Investor already invested in this loan, update the investment
      const existingInvestment = parseFloat(investment.totalInvestment) || 0;
      const existingInterest = parseFloat(investment.totalInterestEarned) || 0;
      const newInvestment = parseFloat(amount) || 0;

      investment.totalInvestment = existingInvestment + newInvestment;
      investment.totalInterestEarned = existingInterest + totalInterest;

      // ✅ Update Monthly Interest
      const monthIndex = investment.monthlyInterest.findIndex((entry) => entry.month === currentMonth);
      if (monthIndex > -1) {
        investment.monthlyInterest[monthIndex].interestEarned += totalInterest;
      } else {
        investment.monthlyInterest.push({ month: currentMonth, interestEarned: totalInterest });
      }

      await investment.save();
    } else {
      // ✅ If no existing investment, create a new one
      const investment_id = await generateInvestmentId();
      investment = new Investment({
        investment_id,
        investor_id,
        loan_id,
        totalInvestment: parseFloat(amount) || 0,
        totalInterestEarned: totalInterest,
        confirmed_at: new Date(),
        monthlyInterest: [{ month: currentMonth, interestEarned: totalInterest }], // ✅ Initialize properly
      });

      await investment.save();
    }

    // ✅ Update loan status to "Approved" if investment is made
    await Loan.updateOne({ loan_id }, { status: "Approved" });
    await userApprovalNotification(loan_id);

    return res.json({
      status: "success",
      message: "Investment confirmed successfully, loan status updated to Approved",
      investment_id: investment.investment_id,
      totalInvestment: investment.totalInvestment,
      totalInterestEarned: investment.totalInterestEarned,
      monthlyInterest: investment.monthlyInterest,
    });

  } catch (error) {
    console.error("Error processing investment:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};


exports.getEarningsSchedule = async (req, res) => {
  try {
    const investor_id = req.user?.investor_id; 
    if (!investor_id) {
      return res.status(401).json({ status: "error", message: "Unauthorized: Investor ID missing" });
    }
    const earnings = await Earnings.find({ investor_id }).populate("loan_id");

    res.json({ status: "success", schedule: earnings });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};


exports.setNotificationPreferences = async (req, res) => {
  try {
    const investor_id = req.user?.investor_id; 
    if (!investor_id) {
      return res.status(401).json({ status: "error", message: "Unauthorized: Investor ID missing" });
    }

    const { enable_notifications } = req.body;

    const preferences = await NotificationPreference.findOneAndUpdate(
      { investor_id },
      { enable_notifications },
      { new: true, upsert: true }
    );

    res.status(200).json({ status: "success", message: "Notification preferences updated", preferences });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
exports.getInvestorMonthlyROI = async (req, res) => {
  try {
    const { year, month } = req.body;
    const investor_id = req.user?.investor_id; // Extract investor ID from request

    if (!investor_id) {
      return res.status(401).json({ status: "error", message: "Unauthorized: Investor ID missing" });
    }

    if (!year || !month) {
      return res.status(400).json({ status: "error", message: "Year and month are required" });
    }

    const formattedMonth = `${year}-${String(month).padStart(2, "0")}`;

    // ✅ Find all investments for the investor
    const investments = await Investment.find({ investor_id });

    if (!investments.length) {
      return res.status(404).json({ status: "error", message: "No investments found for this investor" });
    }

    let totalInvestment = 0;
    let totalInterestEarned = 0;

    // ✅ Calculate total investment and monthly interest
    investments.forEach((investment) => {
      totalInvestment += investment.totalInvestment;

      const monthEntry = investment.monthlyInterest?.find((entry) => entry.month === formattedMonth);
      if (monthEntry) {
        totalInterestEarned += monthEntry.interestEarned;
      }
    });

    // ✅ Prevent division by zero
    const monthlyROI = totalInvestment > 0
      ? (totalInterestEarned / totalInvestment) * 100
      : 0;

    return res.json({
      status: "success",
      investor_id,
      month: formattedMonth,
      totalInvestment,
      totalInterestEarned,
      monthlyROI: monthlyROI.toFixed(2) + "%"
    });

  } catch (error) {
    console.error("Error calculating investor's monthly ROI:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};