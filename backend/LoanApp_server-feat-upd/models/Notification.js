const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  investor_id: {  type: String, 
    required: true, 
    ref: "Investor"},
  loan_id: {  type: String, 
    required: true, 
    ref: "Loan"  },
  message: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
