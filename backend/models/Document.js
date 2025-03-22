const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    required: true, 
    ref: "User" 
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
  },
  file_path: {
    type: String,
    required: true,
  },
  uploaded_at: {
    type: Date,
    default: Date.now,
  },
});

const Document = mongoose.model("Document", documentSchema);

module.exports = { Document };
