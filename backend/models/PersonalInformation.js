const mongoose = require("mongoose");

const personalSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    required: true, 
    ref: "User" 
  },
  full_name: { type: String, required: true },
  father_or_mother_name: { type: String, required: true },
  marital_status: { 
    type: String, 
    enum: ["Single", "Married", "Divorced", "Widowed"], 
    required: true 
  },
  current_address: { type: String, required: true },
  permanent_address: { type: String, required: true },
  mobile_number: { type: String, required: true },
  email_id: { type: String, required: true },
  educational_qualification: { type: String, required: true }
});

const PersonalProfile = mongoose.model("PersonalProfile", personalSchema);
module.exports = { PersonalProfile };
