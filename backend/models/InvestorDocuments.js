const mongoose = require("mongoose");

const investorDocumentSchema = new mongoose.Schema({
  investor_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Investor", 
    required: true 
  },
  name: {
    type: String,
    required: true,
  },
  parent_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  mobile_number: {
    type: String,
    required: true,
  },
  bank_account_number: {
    type: String,
    required: true,
  },
  type: { 
    type: String, 
    required: true, 
    enum: ["ID Proof", "Address Proof"] 
  },
  file_path: { 
    type: String, 
    required: true 
  },
  uploaded_at: { 
    type: Date, 
    default: Date.now 
  }
});

const InvestorDocument = mongoose.model("InvestorDocument", investorDocumentSchema);

module.exports = InvestorDocument;
