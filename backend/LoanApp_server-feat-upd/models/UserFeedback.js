const mongoose = require("mongoose");

const userFeedbackSchema = new mongoose.Schema({
  user_id: { type: String, ref: "User", required: true }, // Reference to User
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1-5
  comments: { type: String, trim: true }, // Optional comment
  submitted_at: { type: Date, default: Date.now } // Auto-filled submission date
});

module.exports = mongoose.model("UserFeedback", userFeedbackSchema);
