const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    required: true, 
    ref: "User" 
  },
  name: { type: String, default: "Default Name" },
  email: { type: String, required: true },
  address: { type: String, default: "Default Address" },
  phone: { type: String, required: true },
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
module.exports = { UserProfile };
