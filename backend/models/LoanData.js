const mongoose = require("mongoose");

const loanDetailsSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    required: true, 
    ref: "User" 
  },
  loan_amount_required: { type: Number, required: true },
  loan_purpose: { 
    type: String, 
    enum: ["Home Loan", "Personal Loan", "Business Loan", "Education Loan", "Vehicle Loan", "Other"], 
    required: true 
  },
  preferred_tenure: { type: Number, required: true }, 
  existing_loans_credit_cards: { type: String, default: "None" } 
});

const LoanDetails = mongoose.model("LoanDetails", loanDetailsSchema);
module.exports = { LoanDetails };
