const mongoose = require("mongoose");

const interestrateSchema = new mongoose.Schema({
  frequency: {
    type: String,
    enum: ["Monthly", "Yearly", "Weekly", "Quarterly"],
    required: true,
    unique: true, // Each frequency should have only one ROI setting
  },
  interest_rate: { type: Number, required: true }, // ROI set by admin
});

const InterestRate = mongoose.model("InterestRate", interestrateSchema);

module.exports = InterestRate;
