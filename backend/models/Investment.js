const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  investment_id: { type: String, unique: true, required: true },
  investor_id: { type: String, required: true, ref: "Investor" },
  loan_id: { type: String, required: true, ref: "Loan" },
  totalInvestment: { type: Number, required: true }, 
  totalInterestEarned: { type: Number, required: true }, 
  confirmed_at: { type: Date, default: Date.now }, 
  monthlyInterest: {
    type: [{ month: String, interestEarned: Number }],
    default: [],  // ✅ Initialize as an empty array
  },
});

const Investment = mongoose.model("Investment", investmentSchema);

module.exports = { Investment };
