const mongoose = require("mongoose");

const loanDetailsSchema = new mongoose.Schema({
  loan_id: { 
    type: String, 
    required: true, 
    ref: "Loan" 
  },
  repayment_schedule: [
    {
      date: { type: Date, required: true },
      amount: { type: Number, required: true },
      status: { type: String, enum: ["Pending", "Paid"], default: "Pending" }, 
      payment_proof: { type: String, default: "" }, 
    },
  ],
  interest_rate: { type: Number, required: true },
  total_interest: { type: Number, required: true },  // ✅ Added total interest
  total_repayment: { type: Number, required: true },
});

const LoanDetails = mongoose.model("LoanDetails", loanDetailsSchema);
module.exports = LoanDetails;
