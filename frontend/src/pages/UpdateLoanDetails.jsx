import React, { useState, useContext } from "react";
import { LoanContext } from "../context/LoanContext";
import apiRequest from "../components/common/authApi";
import styles from "../Styles/LoanForm.module.css";
import { Loader } from "../components/common/Loader";
import { showToast } from "../utils/toastUtils";
import { Button } from "../components/common/Button";
import { CalendarIcon } from "../components/common/assets";
import Btn from "../components/common/Btn";
import { UpdateIcon } from "../components/common/assets";
import { API_BASE_URL } from "../config";

const UpdateLoanDetails = () => {
  const { loanData, updateLoanData } = useContext(LoanContext);
  const [amount, setAmount] = useState(loanData.amount || "");
  const [interestRate, setInterestRate] = useState(
    loanData.interest_rate || ""
  );
  const [startDate, setStartDate] = useState(loanData.start_date || "");
  const [frequency, setFrequency] = useState(loanData.repayment_schedule || "");
  const [timePeriod, setTimePeriod] = useState(loanData.duration || 1); // Add duration state
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const frequencyOptions = ["Weekly", "Monthly", "Quarterly", "Yearly"]; // Add frequency options

  const handleUpdate = async () => {
    if (!amount || !interestRate || !startDate || !frequency) {
      showToast("error", "All fields are required.");
      return;
    }

    if (!loanData.loan_id) {
      showToast("error", "Loan ID is missing. Cannot update loan details.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    try {
      const payload = {
        loan_id: loanData.loan_id,
        amount,
        interest_rate: interestRate,
        start_date: startDate,
        frequency,
      };

      await apiRequest(
        "POST",
        `${API_BASE_URL}auth/update-loan-details`,
        payload,
        accessToken,
        setIsLoading
      );

      showToast("success", "Loan details updated successfully.");
      updateLoanData({
        ...loanData,
        amount,
        interest_rate: interestRate,
        start_date: startDate,
        repayment_schedule: frequency,
      });
    } catch (err) {
      showToast("error", "Failed to update loan details. Try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.detailTitle}>Update Loan Details</h2>

      {error && <div className={styles.error}>{error}</div>}

      {isLoading ? (
        <div className={styles.center}>
          <Loader />
        </div>
      ) : (
        <>
          <div className={styles.inputField}>
            <label className={styles.llabel}>Amount</label>
            <div className={styles.inputWrapper}>
              <span className={styles.icon}>₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputField}>
              <label className={styles.llabel}>Start Date</label>
              <div className={styles.inputWrapper}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={styles.input}
                  min={new Date().toISOString().split("T")[0]}
                />
                <span className={styles.icon}>
                  <CalendarIcon />
                </span>
              </div>
            </div>
            <div className={styles.inputField}>
              <label className={styles.llabel}>
                Duration in{" "}
                {frequency === "weekly"
                  ? "Weeks"
                  : frequency === "monthly"
                  ? "Months"
                  : frequency === "quarterly"
                  ? "Quarters"
                  : "Years"}
              </label>
              <input
                type="number"
                value={timePeriod}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (value > 0) {
                    setTimePeriod(value);
                  }
                }}
                className={styles.input}
                min="1"
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputField}>
              <label className={styles.llabel}>Interest</label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  value={interestRate}
                  readOnly
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 1 && value <= 30) {
                      setInterestRate(value);
                    }
                  }}
                  className={styles.input}
                  min="1"
                  max="30"
                />
                <span className={styles.icon}>%</span>
              </div>
            </div>
            <div className={styles.inputField}>
              <label className={styles.llabel}>Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className={styles.input}
              >
                {frequencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.update}>
            <Btn
              label="Update Loan"
              onClick={handleUpdate}
              icon={<UpdateIcon />}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UpdateLoanDetails;
