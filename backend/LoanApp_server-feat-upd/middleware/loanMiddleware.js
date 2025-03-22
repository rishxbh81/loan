const sendLoanStatusUpdateEmail = require("../services/loanNotificationService");
const User = require("../models/User");

const loanStatusMiddleware = {
  preSave: function (next) {
    this._previousStatus = this.isNew ? undefined : this.status; 
    next();
  },

  
  postSave: async function (loan, next) {
    if (loan.status !== loan._previousStatus) { 
      try {
        const user = await User.findById(loan.user_id); // Fetch user details
        if (!user) return next(new Error("User not found"));

   
        const recipientEmail = user.email;
        const userName = user.name;
        const loanDetails = {
          amount: loan.amount,
          total_repayment: loan.total_repayment,
          remaining_balance: loan.remaining_balance,
        };

      
        await sendLoanStatusUpdateEmail(
          recipientEmail,
          userName,
          loan.loan_id,
          loan.status,
          loanDetails
        );
        console.log("Notification email sent successfully");
      } catch (error) {
        console.error("Error sending loan status email:", error.message);
      }
    }

    next(); 
  },
};

module.exports = loanStatusMiddleware;
