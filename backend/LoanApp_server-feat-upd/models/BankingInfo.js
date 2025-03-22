const mongoose = require("mongoose");

const bankingInfoSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    required: true, 
    ref: "User" 
  },
  bank_name: { type: String, required: true },
  branch: { type: String, required: true },
  account_number: { type: String, required: true, unique: true },
  account_type: { 
    type: String, 
    enum: ["Savings", "Current"], 
    required: true 
  },
  salary_credit_mode: { 
    type: String, 
    enum: ["Bank Transfer", "Cheque", "Cash", "Other"], 
    required: true 
  },
  credit_score: { type: Number, default: null } 
});

const BankingInfo = mongoose.model("BankingInfo", bankingInfoSchema);
module.exports = { BankingInfo };
