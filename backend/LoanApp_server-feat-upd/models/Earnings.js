const mongoose = require("mongoose");

const earningsSchema = new mongoose.Schema({
  earning_id: { type: String, unique: true, required: true },
  investor_id: { type: String, required: true, ref: "Investor" },
  loan_id: { type: String, required: true, ref: "Loan" },
  due_date: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
  created_at: { type: Date, default: Date.now },
});

const Earnings = mongoose.model("Earnings", earningsSchema);

module.exports = Earnings;
