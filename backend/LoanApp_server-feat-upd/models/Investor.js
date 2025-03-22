const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema(
  {
    investor_id: { type: String, unique: true },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    mobile_number: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["investor", "admin"], default: "investor" },
    otp: { type: String },
    otp_expiry: { type: Date },
  },
  { timestamps: true }
);


const Investor = mongoose.model("Investor", investorSchema);
module.exports =  {Investor };
