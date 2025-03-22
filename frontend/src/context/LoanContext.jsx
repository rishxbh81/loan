import React, { createContext, useState, useEffect } from "react";

export const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
 
  const storedLoanData = localStorage.getItem('loanData');
  const initialLoanData = storedLoanData ? JSON.parse(storedLoanData) : {
    amount: 0,
    repayment_schedule: '',
    interest_rate: 0,
    loan_id: null,
  };

  const [loanData, setLoanData] = useState(initialLoanData);

  const updateLoanData = (newData) => {
    const updatedData = { ...loanData, ...newData };
    setLoanData(updatedData);


    localStorage.setItem('loanData', JSON.stringify(updatedData));
    console.log("Updated LoanData:", updatedData); 
  };

  return (
    <LoanContext.Provider value={{ loanData, updateLoanData }}>
      {children}
    </LoanContext.Provider>
  );
};
