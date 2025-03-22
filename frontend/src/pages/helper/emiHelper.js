// Function to calculate EMI, Total Interest, and Total Payment
export const calculateEMI = (loanAmount, interestRate, tenure, tenureType) => {
  // Convert tenure to months if it's given in years
  const tenureInMonths = tenureType === "years" ? tenure * 12 : tenure;

  // Convert annual interest rate to monthly rate (in decimal form)
  const monthlyRate = interestRate / 12 / 100;

  // Handle case where interest rate might be zero (simple division case)
  const emi =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
        (Math.pow(1 + monthlyRate, tenureInMonths) - 1)
      : loanAmount / tenureInMonths;

  const totalPayment = emi * tenureInMonths; // Total payment over loan tenure
  const totalInterest = totalPayment - loanAmount; // Total interest payable

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
  };
};

// Function to generate Bar Chart data for principal and interest
export const generateBarData = (
  loanAmount,
  interestRate,
  tenure,
  tenureType
) => {
  const tenureInMonths = tenureType === "years" ? tenure * 12 : tenure;
  const monthlyRate = interestRate / 12 / 100;

  // Calculate EMI with the same logic as the above function
  const emi =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
        (Math.pow(1 + monthlyRate, tenureInMonths) - 1)
      : loanAmount / tenureInMonths;

  // Calculate yearly distribution of principal and interest
  const years = Math.ceil(tenureInMonths / 12);
  const principalPaidEachMonth = [];
  const interestPaidEachMonth = [];
  let remainingPrincipal = loanAmount;

  for (let i = 0; i < tenureInMonths; i++) {
    const interestForMonth = remainingPrincipal * monthlyRate;
    const principalForMonth = emi - interestForMonth;

    interestPaidEachMonth.push(interestForMonth);
    principalPaidEachMonth.push(principalForMonth);

    remainingPrincipal -= principalForMonth;
  }

  // Aggregate principal and interest paid per year for the bar chart
  const principalPerYear = Array(years).fill(0);
  const interestPerYear = Array(years).fill(0);

  for (let i = 0; i < tenureInMonths; i++) {
    const yearIndex = Math.floor(i / 12);
    principalPerYear[yearIndex] += principalPaidEachMonth[i];
    interestPerYear[yearIndex] += interestPaidEachMonth[i];
  }

  return {
    labels: Array.from({ length: years }, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: "Principal",
        data: principalPerYear.map((amount) => Math.round(amount)),
        backgroundColor: "#4CAF50",
      },
      {
        label: "Interest",
        data: interestPerYear.map((amount) => Math.round(amount)),
        backgroundColor: "#FF9800",
      },
    ],
  };
};
