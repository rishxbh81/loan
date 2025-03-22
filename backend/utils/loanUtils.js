const moment = require("moment");

const generateRepaymentSchedule = (start_date, frequency, amount, interest_rate, remaining_balance, duration) => {
  if (!start_date || !moment(start_date, "YYYY-MM-DD", true).isValid()) {
    throw new Error("Invalid start date");
  }
  if (!["Weekly", "Monthly", "Quarterly", "Yearly"].includes(frequency)) {
    throw new Error("Invalid frequency");
  }
  if (!duration || isNaN(duration) || duration <= 0) {
    throw new Error("Invalid duration");
  }

  const repayments = [];
  let totalInterestPaid = 0;
  let date = moment(start_date);
  let paymentCount = 0;
  let totalPeriods, paymentsPerYear;

  // ✅ Corrected: Define paymentsPerYear properly
  switch (frequency) {
    case "Weekly":
      paymentsPerYear = 52;
      break;
    case "Monthly":
      paymentsPerYear = 12;
      break;
    case "Quarterly":
      paymentsPerYear = 4;
      break;
    case "Yearly":
      paymentsPerYear = 1;
      break;
    default:
      throw new Error("Invalid frequency");
  }

  totalPeriods = duration; // ✅ Use duration directly

  // ✅ Now paymentsPerYear is defined correctly before usage
  const periodRate = interest_rate / (100 * paymentsPerYear);

  // ✅ EMI formula now works correctly
  const emi = Math.round(
    (amount * periodRate * Math.pow(1 + periodRate, totalPeriods)) /
    (Math.pow(1 + periodRate, totalPeriods) - 1)
  );

  if (isNaN(emi) || emi <= 0) {
    throw new Error("Invalid EMI Calculation: " + emi);
  }

  while (paymentCount < totalPeriods) {
    const interestPortion = remaining_balance * periodRate;
    const principalPortion = emi - interestPortion;
    totalInterestPaid += interestPortion;

    remaining_balance -= principalPortion;

    repayments.push({
      date: date.format("YYYY-MM-DD"),
      amount: emi,
      principal: Math.round(principalPortion),
      interest: Math.round(interestPortion),
      remaining_balance: Math.max(0, Math.round(remaining_balance)),
    });

    if (remaining_balance <= 0) break;
    
    // ✅ Move to the next payment date correctly
    switch (frequency) {
      case "Weekly":
        date.add(1, "weeks");
        break;
      case "Monthly":
        date.add(1, "months");
        break;
      case "Quarterly":
        date.add(3, "months");
        break;
      case "Yearly":
        date.add(1, "years");
        break;
    }

    paymentCount++;
  }

  return {
    repayments,
    totalRepaymentAmount: Math.round(emi * totalPeriods),
    totalInterestPaid: Math.round(totalInterestPaid),
  };
};

module.exports = { generateRepaymentSchedule };
