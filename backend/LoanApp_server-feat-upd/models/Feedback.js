const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  investor_id: { type:String, ref: "Investor", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String, trim: true },
  submitted_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
