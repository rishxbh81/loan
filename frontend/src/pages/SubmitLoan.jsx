import React, { useState, useContext, useEffect } from "react";
import { LoanContext } from "../context/LoanContext";
import apiRequest from "../components/common/authApi";
import { useNavigate } from "react-router-dom";
import { CheckIcon } from "../components/common/assets";
import Btn from "../components/common/Btn";
import { showToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../config";

const SubmitLoan = () => {
  const { loanData, updateLoanData } = useContext(LoanContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current Loan Data:", loanData);
  }, [loanData]);

  useEffect(() => {
    const savedLoanData = localStorage.getItem("loanData");
    if (savedLoanData && !loanData.loan_id) {
      updateLoanData(JSON.parse(savedLoanData));
    }
  }, [loanData, updateLoanData]);

  const handleSubmit = async () => {
    console.log("Loan Data Before Submission:", loanData);

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      showToast("error", "You are not authorized. Please log in.");
      console.log("No access token found. Redirecting to login.");
      navigate("/login");
      return;
    }

    if (!loanData.loan_id) {
      setError("Loan ID is required. Please save the loan draft first.");
      showToast(
        "error",
        "Loan ID is missing. Please save the loan draft first."
      );
      console.log("Loan ID is missing:", loanData);
      return;
    }

    try {
      const response = await apiRequest(
        "POST",
        `${API_BASE_URL}auth/submit`,
        { loan_id: loanData.loan_id },
        accessToken
      );
      console.log("Submit Loan Response:", response);

      localStorage.setItem("loanData", JSON.stringify(loanData));

      showToast("success", "Loan submitted successfully!");
    } catch (err) {
      console.error("Error Submitting Loan:", err);
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <Btn label="Submit Loan" onClick={handleSubmit} icon={<CheckIcon />} />
    </div>
  );
};

export default SubmitLoan;
