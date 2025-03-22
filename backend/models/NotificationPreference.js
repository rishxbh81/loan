const mongoose = require("mongoose");

const NotificationPreferenceSchema = new mongoose.Schema({
  investor_id: { type: String, 
    required: true, 
    ref: "Investor" },
  enable_notifications: { type: Boolean, default: true }, 
});

module.exports = mongoose.model("NotificationPreference", NotificationPreferenceSchema);
