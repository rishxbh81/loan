const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  user_id: { type: String, unique: true }, 
  mobile_number: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  otp: { type: String },
  otp_expiry: { type: Date },
  created_at: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "investor"], default: "user" },
});


const User = mongoose.model("User", userSchema);
module.exports = { User };
