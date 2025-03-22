const  Loan  = require("../models/Loan");
const { User } = require("../models/User");
const LoanDetails = require("../models/LoanDetails");
const sendEmail = require("./emailService");
const moment = require("moment");

exports.userApprovalNotification = async (loan_id) => {
  try {
    
    const loan = await Loan.findOne({ loan_id }).select("user_id amount");
    if (!loan) {
      console.error(`Loan with ID ${loan_id} not found`);
      return;
    }

    const user = await User.findOne({ user_id: loan.user_id }).select("email");
    if (!user) {
      console.error(`User with ID ${loan.user_id} not found`);
      return;
    }

    const subject = "Loan Approved!";
    const content = `
      <p>Dear User,</p>
      <p>Congratulations! Your loan application (Loan ID: <strong>${loan_id}</strong>) has been approved.</p>
      <p>Loan Amount: <strong>${loan.amount}</strong></p>
      <p>Please check your dashboard for further details.</p>
      <p>Thank you for choosing our services.</p>
    `;

  
    await sendEmail(user.email, subject, content);
    console.log(`Loan approval email sent to ${user.email} for Loan ID: ${loan_id}`);
  } catch (error) {
    console.error("Error sending loan approval notification:", error);
  }
};
exports.sendRepaymentReminder = async () => {
    try {
      const reminderDate = moment().add(5, "days").startOf("day").toDate(); 
      const loans = await LoanDetails.find({
        "repayment_schedule.date": { $gte: reminderDate, $lt: moment(reminderDate).add(1, "day").toDate() },
      }).populate({
        path: "loan_id",
        model: "Loan",
        select: "_id",  
      });
  
      if (!loans.length) {
        console.log("No upcoming repayments in 5 days.");
        return;
      }
  
      for (const loanDetail of loans) {
        const user = await User.findOne({ user_id: loanDetail.loan_id.user_id }).select("email");
        if (!user) {
          console.error(`User not found for Loan ID: ${loanDetail.loan_id}`);
          continue;
        }
  
        const repayment = loanDetail.repayment_schedule.find(
          (r) =>
            moment(r.date).startOf("day").toDate().toString() === moment(reminderDate).startOf("day").toDate().toString()
        );
  
        if (!repayment) continue;
  
        const subject = "Upcoming Loan Repayment Reminder";
        const content = `
          <p>Dear User,</p>
          <p>This is a reminder that your next loan repayment (Loan ID: <strong>${loanDetail.loan_id.toString()}</strong>) is due in <strong>5 days</strong>.</p>
          <p>Amount Due: <strong>${repayment.amount}</strong></p>
          <p>Due Date: <strong>${moment(repayment.date).format("YYYY-MM-DD")}</strong></p>
          <p>Please ensure timely payment to avoid penalties.</p>
          <p>Thank you.</p>
        `;
  
        await sendEmail(user.email, subject, content);
        console.log(`Repayment reminder sent to ${user.email} for Loan ID: ${loanDetail.loan_id.toString()}`);
      }
    } catch (error) {
      console.error("Error sending repayment reminder:", error);
    }
  };
  