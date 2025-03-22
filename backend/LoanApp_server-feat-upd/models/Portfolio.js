const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    portfolio_id: { type: String, unique: true }, 
    investor_id: { type: String, 
      required: true, 
      ref: "Investor" },
    total_funds: { type: Number, default: 0 },
    active_loans: { type: Number, default: 0 },
    roi: { type: Number, default: 0 },
    monthly_earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
module.exports = {Portfolio} ;
