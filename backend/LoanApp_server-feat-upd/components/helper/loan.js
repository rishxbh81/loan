const Loan = require("../../models/Loan");
const LoanDetails = require("../../models/LoanDetails");
const { generateRepaymentSchedule } = require("../../utils/loanUtils");

const createLoan = async (user_id, loan_id, amount, start_date,  end_date,frequency, interest_rate, duration) => {
  try {
    if (!user_id || typeof user_id !== "string") {
      throw new Error(`Invalid user_id: Expected a string, got ${typeof user_id}`);
    }

    console.log("✅ user_id before saving:", typeof user_id, user_id);

    // ✅ Generate repayment schedule
    const { repayments, totalRepaymentAmount, totalInterestPaid } = generateRepaymentSchedule(
      start_date, frequency, amount, interest_rate, amount, duration
    );

    if (!totalRepaymentAmount || isNaN(totalRepaymentAmount) || totalRepaymentAmount <= 0) {
      throw new Error(`❌ Invalid total repayment amount: ${totalRepaymentAmount}`);
    }

    // ✅ Create Loan
    const loan = new Loan({
      user_id,
      loan_id,
      amount,
      total_repayment: totalRepaymentAmount,
      remaining_balance: totalRepaymentAmount,
      frequency,
      duration,
      interest_rate,
      start_date, // ✅ Include start_date
      end_date,   // ✅ Include end_date
      status: "Draft"
    });

    await loan.save();

    // ✅ Create Loan Details
    const loanDetails = new LoanDetails({
      loan_id: loan.loan_id,
      repayment_schedule: repayments,
      interest_rate,
      total_repayment: totalRepaymentAmount,
      total_interest: totalInterestPaid,
    });

    await loanDetails.save();

    return loan;
  } catch (error) {
    console.error("❌ Error creating loan:", error.message);
    throw error;
  }
};




const updateLoanStatus = async (loan_id, status) => {
  return await Loan.findOneAndUpdate(
    { loan_id: loan_id },  
    { status },         
    { new: true }       
  );
};


const processLumpSumRepayment = async (loan_id, payment_amount) => {
  const loan = await Loan.findById(loan_id);
  if (!loan) throw new Error("Loan not found");

  loan.remaining_balance -= payment_amount;
  if (loan.remaining_balance <= 0) {
    loan.status = "Paid";
    loan.remaining_balance = 0; 
  }
  await loan.save();

  return loan;
};


const getCompleteLoanDetails = async (loan_id) => {
  try {
   
    const loan = await Loan.findOne({ loan_id }); 
    const loanDetails = await LoanDetails.findOne({ loan_id }); 

    return { loanDetails,loan  };
  } catch (error) {
    throw new Error("Error fetching complete loan details from the database");
  }
};



const fetchLoanById = async (loan_id) => {
  return await LoanDetails.findOne({ loan_id });
};

const updateLoanDetails = async (loan, amount, interest_rate, start_date, frequency) => {
  
  const { repayments, totalRepaymentAmount } = generateRepaymentSchedule(start_date, frequency, amount, interest_rate, amount);

  if (isNaN(totalRepaymentAmount) || totalRepaymentAmount <= 0) {
    throw new Error(`Invalid total repayment: ${totalRepaymentAmount}`);
  }

  if (!Array.isArray(repayments) || repayments.length === 0) {
    throw new Error("Invalid repayment schedule generated");
  }

 
  loan.amount = amount;
  loan.total_repayment = totalRepaymentAmount;
  loan.remaining_balance = totalRepaymentAmount;
  await loan.save();


  await saveUpdatedLoanDetails(loan, interest_rate, totalRepaymentAmount, repayments);

  return { total_repayment: totalRepaymentAmount, repayment_schedule: repayments };
};




const saveUpdatedLoanDetails = async (loan, interest_rate, total_repayment, repayment_schedule) => {
  
  if (typeof total_repayment !== 'number' || isNaN(total_repayment) || total_repayment <= 0) {
    throw new Error(`Invalid total repayment: ${total_repayment}`);
  }
  if (!Array.isArray(repayment_schedule) || repayment_schedule.length === 0) {
    throw new Error('Invalid repayment schedule');
  }

  console.log('Saving loan details...');
  const loanDetails = await LoanDetails.findOneAndUpdate(
    { loan_id: loan.loan_id },
    { repayment_schedule, interest_rate, total_repayment },
    { new: true, upsert: true }
  );

  if (!loanDetails) {
    throw new Error(`Loan details not found for loan_id: ${loan._id}`);
  }

  console.log('Loan details saved successfully:', loanDetails);
  return loanDetails;
};

const getLoansForUser = async (user_id) => {
  try {
  
    const loans = await Loan.find({ user_id }, "loan_id status total_repayment");
    if (loans.length === 0) {
      return [];  
    }

    return loans; 
  } catch (error) {

    throw new Error("Error fetching loans for user: " + error.message);
  }
};


module.exports = {
  createLoan,
  updateLoanStatus,
  processLumpSumRepayment,
  getCompleteLoanDetails,
  fetchLoanById,
  updateLoanDetails,
  saveUpdatedLoanDetails,
  getLoansForUser,
};
