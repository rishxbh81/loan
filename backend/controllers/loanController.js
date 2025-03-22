const loanService = require("../components/helper/loan");
const errorHandler = require("../components/common/errorHandler");
const loanValidation = require("../utils/loanValidation");
const {generateLoanId} = require("../services/otpService");
const Loan = require("../models/Loan");
const LoanDetails = require("../models/LoanDetails");
const notificationService = require("../services/loanNotificationService");
const moment = require("moment");
const InterestRate = require("../models/InterestRate");


exports.saveDraft = [
  ...loanValidation.saveDraftValidation, 
  async (req, res) => {
    let { amount, start_date, end_date, frequency, duration } = req.body;  
    const user_id = req.user?.user_id?.toString();  

    if (!user_id) {
      return res.status(401).json({
        uniqueCode: "LA06",
        status: "error",
        message: "Unauthorized",
        data: ""
      });
    }

    try {
      frequency = frequency.charAt(0).toUpperCase() + frequency.slice(1).toLowerCase();
      console.log("📌 Normalized Frequency:", frequency);
      const interestData = await InterestRate.findOne({ frequency });
      console.log("📌 Interest Data:", interestData);

      if (!interestData) {
        return res.status(400).json({
          uniqueCode: "LA07",
          status: "error",
          message: "Interest rate not found for the given frequency",
          data: ""
        });
      }
      
      const interest_rate = interestData.interest_rate;

      if (!duration || isNaN(duration) || duration <= 0) {
        throw new Error("Invalid duration");
      }

      const loan_id = await generateLoanId();
      console.log("📌 Generating Loan with frequency:", frequency);
      
      const loan = await loanService.createLoan(
        user_id, loan_id, amount, start_date, end_date, frequency, interest_rate, duration
      );

      res.status(200).json({
        uniqueCode: "LA06",
        status: "success",
        message: "Loan draft saved successfully",
        loan_id: loan.loan_id
      });
    } catch (error) {
      errorHandler.handleInternalError(res, error, "Error saving loan draft", "LA06");
    }
  },
];


exports.submitLoan = async (req, res) => {
  try {
    const { loan_id } = req.body;

    if (!loan_id) {
      return res.status(400).json({ status: "error", message: "Loan ID is required" });
    }

    
    const loan = await loanService.updateLoanStatus(loan_id, "Pending");

    if (!loan) {
      return res.status(404).json({ status: "error", message: "Loan not found" });
    }

    
    await notificationService.sendLoanOpportunityNotification(loan_id);

    res.status(200).json({ status: "success", message: "Loan submitted successfully, investors notified" });
  } catch (error) {
    console.error("Error submitting loan:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};


exports.makeLumpSumRepayment = async (req, res) => {
  const { loan_id, payment_amount } = req.body;

  if (!loan_id || !payment_amount) {
    return res.status(400).json({ 
      uniqueCode: "LA08", 
      status: "error", 
      message: "Loan ID and payment amount are required", 
      data: "" 
    });
  }

  try {
    const loan = await loanService.processLumpSumRepayment(loan_id, payment_amount);

    res.status(200).json({ 
      uniqueCode: "LA08", 
      status: "success", 
      message: "Lump-sum repayment successful", 
        remaining_balance: loan.remaining_balance, 
        loan_status: loan.status 
      
    });
  } catch (error) {
    errorHandler.handleInternalError(res, error, "Error processing lump-sum repayment", "LA08");
  }
};

exports.getCompleteLoanDetails = async (req, res) => {
  const { loan_id } = req.params;

  try {
    
    const { loan, loanDetails } = await loanService.getCompleteLoanDetails(loan_id);

    
    if (!loan || !loanDetails) {
      return errorHandler.handleBadRequest(
        res,
        "Loan details not found in one or both schemas"
      );
    }

    
    res.status(200).json({
      status: "success",
      loan,
      loanDetails,
    });
  } catch (error) {
    errorHandler.handleInternalError(
      res,
      error,
      "Error retrieving complete loan details"
    );
  }
};



exports.updateLoanDetails = [
  ...loanValidation.saveDraftValidation, 
  async (req, res) => {
    const { loan_id, amount, interest_rate, start_date, frequency } = req.body;

    if (!loan_id) {
      return res.status(400).json({ 
        uniqueCode: "LA10", 
        status: "error", 
        message: "Loan ID is required", 
        data: "" 
      });
    }

    try {
      const loan = await loanService.fetchLoanById(loan_id);

      if (!loan) {
        return res.status(400).json({ 
          uniqueCode: "LA10", 
          status: "error", 
          message: "Loan not found", 
          data: "" 
        });
      }

      const { total_repayment, repayment_schedule } = await loanService.updateLoanDetails(
        loan,
        amount,
        interest_rate,
        start_date,
        frequency
      );

      res.status(200).json({
        uniqueCode: "LA10",
        status: "success",
        message: "Loan details updated successfully",
          loan_id: loan._id,
          total_repayment,
          repayment_schedule,
      });
    } catch (error) {
      res.status(500).json({ 
        uniqueCode: "LA10", 
        status: "error", 
        message: error.message, 
        data: "" 
      });
    }
  },
];



exports.getAllLoansForUser = async (req, res) => {
  try {
    
    const user_id = req.user?.user_id?.toString(); 

    if (!user_id || typeof user_id !== "string") {
      return res.status(401).json({
        uniqueCode: "LA12",
        status: "error",
        message: "Unauthorized. Invalid user ID format.",
        data: "",
      });
    }

    console.log("Fetching loans for user_id:", user_id); 
    const loans = await loanService.getLoansForUser(user_id);

    if (!loans || loans.length === 0) {
      return res.status(200).json({
        uniqueCode: "LA12",
        status: "success",
        message: "No loans found for this user.",
        data: [],
      });
    }

    
    const loanSummary = loans.map((loan) => ({
      loan_id: loan.loan_id,
      status: loan.status,
      total_repayment: loan.total_repayment,
    }));

    return res.status(200).json({
      uniqueCode: "LA12",
      status: "success",
      message: "Loans fetched successfully",
      data: loanSummary,
    });
  } catch (error) {
    console.error("Error fetching loans:", error); 
    errorHandler.handleInternalError(res, error, "Error retrieving loans", "LA12");
  }
};


exports.updateLoanStatus = async (req, res) => {
  const { loan_id, status } = req.body;

  try {
   
    const loan = await Loan.findOneAndUpdate(
      { loan_id },
      { status, updated_at: new Date() },
      { new: true } 
    );

    if (!loan) {
      return res.status(404).json({
        status: "error",
        message: "Loan not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: `Loan status updated to ${status}`,
      loan,
    });
  } catch (error) {
    console.error("Error updating loan status:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating loan status",
    });
  }
};

exports.getPendingRepayments = async (req, res) => {
  try {
    const user_id = req.user?.user_id?.toString();
    if (!user_id) return res.status(401).json({ error: "Unauthorized: User ID missing" });

    const userLoans = await Loan.find({ user_id });
    console.log("User Loans:", userLoans);

    if (!userLoans.length) {
      return res.json({ message: "No loans found for this user." });
    }

    const loanIds = userLoans.map((loan) => loan.loan_id);
    const loanDetails = await LoanDetails.find({ loan_id: { $in: loanIds } });

    console.log("Loan Details Found:", loanDetails);
    if (!loanDetails.length) {
      return res.json({ message: "No repayment schedules found for these loans." });
    }

    let pendingRepayments = [];
    const today = moment();
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");
    const lastMonthStart = moment().subtract(1, "month").startOf("month");
    const lastMonthEnd = moment().subtract(1, "month").endOf("month");

    loanDetails.forEach((loan) => {
      loan.repayment_schedule.forEach((schedule) => {
        const dueDate = moment(schedule.date);
        console.log(`Checking Loan ID: ${loan.loan_id}, Due Date: ${dueDate.format("YYYY-MM-DD")}`);

        let status = null;

        if (schedule.status === "Paid") {
          // Ignore paid repayments
          return;
        } else if (dueDate.isBetween(startOfMonth, endOfMonth, "day", "[]")) {
          status = "Due This Month";
        } else if (dueDate.isBetween(lastMonthStart, lastMonthEnd, "day", "[]")) {
          status = "Overdue";
        }

        if (status) {
          pendingRepayments.push({
            loan_id: loan.loan_id,
            due_date: dueDate.format("MMMM Do, YYYY"), 
            amount: schedule.amount,
            status: status,
          });
        }
      });
    });

    console.log("Final Pending Repayments: ", pendingRepayments);
    res.json({ repayments: pendingRepayments.length ? pendingRepayments : "No pending repayments" });
  } catch (error) {
    console.error("Error fetching repayments:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const user_id = req.user?.user_id?.toString();

    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: User ID missing" });
    }

    console.log("Fetching data for user_id:", user_id);

    const userLoans = await Loan.find({ user_id });

    if (!userLoans.length) {
      return res.json({ message: "No loan history available." });
    }

    const activeLoansCount = userLoans.filter((loan) => loan.status === "Approved").length;
    const pendingApplicationsCount = userLoans.filter((loan) => loan.status === "Pending").length;
    const approvedLoans = userLoans.filter((loan) => loan.status === "Approved");
    
    const totalBorrowed = approvedLoans.reduce((sum, loan) => sum + (loan.total_repayment || 0), 0);
    const remainingBalance = userLoans.reduce((sum, loan) => sum + (loan.remaining_balance || 0), 0);
    const totalPendingAmount = userLoans
      .filter((loan) => loan.status === "Pending")
      .reduce((sum, loan) => sum + (loan.total_repayment || 0), 0);

    const loanIds = userLoans.map((loan) => loan.loan_id);
    const loanDetails = await LoanDetails.find({ loan_id: { $in: loanIds } });

    // **Calculate total_repaid dynamically based on paid repayments**
    const totalRepaid = loanDetails.reduce((sum, loan) => {
      return sum + loan.repayment_schedule
        .filter((payment) => payment.status === "Paid")
        .reduce((innerSum, payment) => innerSum + payment.amount, 0);
    }, 0);

    const notifications = ["Loan Approved", "EMI Due"];

    res.json({
      active_loans: activeLoansCount,
      pending_applications: pendingApplicationsCount,
      financial_history: {
        total_repaid: totalRepaid, // Dynamically calculated
        remaining_balance: remainingBalance,
        totalamount: totalPendingAmount,
      },
      notifications: notifications,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.uploadPaymentProof = async (req, res) => {
  try {
    const { loan_id, repayment_date } = req.body;

    if (!loan_id || !repayment_date || !req.file) {
      return res.status(400).json({ status: "error", message: "Loan ID, repayment date, and proof file are required" });
    }

    const loan = await LoanDetails.findOne({ loan_id });
    if (!loan) {
      return res.status(404).json({ status: "error", message: "Loan not found" });
    }

    const repaymentEntry = loan.repayment_schedule.find(
      (repayment) => repayment.date.toISOString().split("T")[0] === repayment_date
    );

    if (!repaymentEntry) {
      return res.status(404).json({ status: "error", message: "Repayment entry not found" });
    }
    repaymentEntry.payment_proof = req.file.path;
    repaymentEntry.status = "Paid";

    await loan.save();

    return res.status(200).json({ status: "success", message: "Payment proof uploaded successfully.", file_path: req.file.path });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server error", error: error.message });
  }
};

exports.getRepaymentsForUser = async (req, res) => {
  try {
    const user_id = req.user?.user_id?.toString();

    if (!user_id || typeof user_id !== "string") {
      return res.status(401).json({
        uniqueCode: "RP10",
        status: "error",
        message: "Unauthorized. Invalid user ID format.",
        data: "",
      });
    }
    const loans = await Loan.find({ user_id, status: { $regex: /^Approved$/i } });
    if (!loans || loans.length === 0) {
      return res.status(200).json({
        uniqueCode: "RP10",
        status: "success",
        message: "No repayments found for approved loans.",
        data: [],
      });
    }

    const loanIds = loans.map((loan) => loan.loan_id);
    const repayments = await LoanDetails.find({
      loan_id: { $in: loanIds },
    });
    if (!repayments || repayments.length === 0) {
      return res.status(200).json({
        uniqueCode: "RP10",
        status: "success",
        message: "No repayment schedules found for approved loans.",
        data: [],
      });
    }

    const repaymentSummary = repayments.map((loan) => ({
      loan_id: loan.loan_id,
      repayment_schedule: loan.repayment_schedule.map((repayment) => ({
        date: new Date(repayment.date).toLocaleDateString("en-GB"),
        amount: repayment.amount,
        status: repayment.status,
      })),
    }));

    return res.status(200).json({
      uniqueCode: "RP10",
      status: "success",
      message: "Repayment schedules for approved loans fetched successfully",
      data: repaymentSummary,
    });
  } catch (error) {
    console.error("Error fetching repayments:", error);
    handleInternalError(res, error, "Error retrieving repayments", "RP10");
  }
};
