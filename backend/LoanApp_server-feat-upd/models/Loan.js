const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, ref: "User" },
    loan_id: { type: String, unique: true, required: true },
    amount: { type: Number, required: true },
    total_repayment: { type: Number, required: true },
    remaining_balance: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Draft", "Pending", "Under Review", "Approved", "Rejected", "Paid", "Expired"],
      default: "Draft",
    },
    frequency: {
      type: String,
      enum: ["Weekly", "Monthly", "Quarterly", "Yearly"],
      required: true,
    },
    duration: { type: Number, required: true }, // Total number of payments
    interest_rate: { type: Number, required: true }, // Original interest rate
    updated_interest_rate: { type: Number, default: null }, // New interest rate if extended
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    paid_installments: { type: Number, default: 0 }, // Number of EMIs paid
    is_extended: { type: Boolean, default: false }, // If the loan was extended
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Loan = mongoose.model("Loan", loanSchema);
module.exports = Loan;
