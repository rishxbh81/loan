const mongoose = require("mongoose");

const employmentSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    required: true, 
    ref: "User" 
  },
  employment_type: { 
    type: String, 
    enum: ["Salaried", "Self-employed"], 
    required: true 
  },
  company_name: { type: String, required: function() { return this.employment_type === "Salaried"; } },
  company_type: { 
    type: String, 
    enum: ["Private", "Government", "MNC", "Startup"], 
    required: function() { return this.employment_type === "Salaried"; } 
  },
  current_job_designation: { type: String, required: function() { return this.employment_type === "Salaried"; } },
  official_email: { type: String, required: function() { return this.employment_type === "Salaried"; } },
  business_details: { type: String, required: function() { return this.employment_type === "Self-employed"; } },
  annual_turnover: { type: Number, required: function() { return this.employment_type === "Self-employed"; } },
  existing_emi_commitments: { type: String, default: "None" },
  other_income_sources: { type: String, default: "None" }
});

const EmploymentProfile = mongoose.model("EmploymentProfile", employmentSchema);
module.exports = { EmploymentProfile };
