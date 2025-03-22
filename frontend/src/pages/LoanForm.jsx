import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoanContext } from "../context/LoanContext";
import apiRequest from "../components/common/authApi";
import styles from "../Styles/LoanForm.module.css";
import { showToast } from "../utils/toastUtils";
import { Loader } from "../components/common/Loader";
import { CalendarIcon, Drafticon, Infoicon } from "../components/common/assets";
import Btn from "../components/common/Btn";
import { API_BASE_URL } from "../config";

const LoanForm = () => {
  const navigate = useNavigate();
  const { updateLoanData } = useContext(LoanContext);
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [interestRateAfterDue, setInterestRateAfterDue] = useState("");
  const [error, setError] = useState("");
  const [timePeriod, setTimePeriod] = useState(1);
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState("weekly");
  const [loanType, setLoanType] = useState("personal"); // New state for loan type
  const frequencyOptions = ["weekly", "monthly", "quarterly", "yearly"];
  const loanTypeOptions = ["personal", "mortgage", "business"]; // Loan type options
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);

  const handleSaveDraft = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      showToast("error", "Access token not found. Please log in.");
      navigate("/login");
      return;
    }

    // Validate all required fields
    if (!amount || !startDate || !endDate || !interestRate || !loanType) {
        showToast("error", "Please fill all the required fields.");
        return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast("error", "Please enter a valid loan amount.");
      return;
    }

    const parsedInterestRate = parseFloat(interestRate);
    if (isNaN(parsedInterestRate) || parsedInterestRate <= 0) {
      showToast("error", "Please enter a valid interest rate.");
      return;
    }

    try {
      const response = await apiRequest(
        "POST",
        `${API_BASE_URL}auth/save-draft`,
        {
          amount: parsedAmount,
          start_date: startDate,
          end_date: endDate,
          frequency: frequency.charAt(0).toUpperCase() + frequency.slice(1),
          duration: timePeriod,
        },
        accessToken,
        setLoading
      );

      console.log("API Response:", response); // Debug the API response

      if (response && response.data && response.data.loan_id) {
        updateLoanData({
          loan_id: response.data.loan_id,
          amount: parsedAmount,
          repayment_schedule: frequency,
          interest_rate: parsedInterestRate,
        });
        showToast("success", "Loan draft saved successfully!");
      } else {
        showToast(
          "error",
          "Failed to save draft. Loan ID is missing in the response."
        );
      }
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const calculateEndDate = (start, period, freq) => {
    const startDateObj = new Date(start);
    switch (freq) {
      case "weekly":
        startDateObj.setDate(startDateObj.getDate() + period * 7);
        break;
      case "monthly":
        startDateObj.setMonth(startDateObj.getMonth() + period);
        break;
      case "quarterly":
        startDateObj.setMonth(startDateObj.getMonth() + period * 3);
        break;
      case "yearly":
        startDateObj.setFullYear(startDateObj.getFullYear() + period);
        break;
      default:
        break;
    }
    return startDateObj.toISOString().split("T")[0];
  };
  useEffect(() => {
    const fetchInterestRates = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("No access token found");
          return;
        }

        // Fetch all interest rates
        const allRatesResponse = await apiRequest(
          "GET",
          `${API_BASE_URL}auth/interest-rates`,
          null,
          accessToken
        );

        // Find the rate for the current frequency
        const selectedRate = allRatesResponse.data.data.find(
          (rate) => rate.frequency.toLowerCase() === frequency.toLowerCase()
        );

        if (selectedRate) {
          setInterestRate(selectedRate.interest_rate);
          setInterestRateAfterDue(selectedRate.interest_rate + 2);
        }

        console.log("All Interest Rates:", allRatesResponse.data);
      } catch (error) {
        console.error("Error fetching interest rates:", error);
      }
    };

    fetchInterestRates();
  }, [frequency]);
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Loan Form</h2>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
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
          <div className={styles.inputField}>
            <label className={styles.llabel}>Loan Type</label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className={styles.input}
            >
              {loanTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputField}>
              <label className={styles.llabel}>Frequency</label>
              <select
                value={frequency}
                onChange={(e) => {
                  const newFrequency = e.target.value;
                  setFrequency(newFrequency);
                  if (startDate) {
                    setEndDate(
                      calculateEndDate(startDate, timePeriod, newFrequency)
                    );
                  }
                }}
                className={styles.input}
              >
                {frequencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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
                    if (startDate) {
                      setEndDate(calculateEndDate(startDate, value, frequency));
                    }
                  }
                }}
                className={styles.input}
                min="1"
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputFieldD}>
              <label className={styles.llabel}>Start Date</label>
              <div className={styles.inputWrapper}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setEndDate(
                      calculateEndDate(e.target.value, timePeriod, frequency)
                    );
                  }}
                  className={styles.input}
                  min={new Date().toISOString().split("T")[0]}
                />
                <span className={styles.icon}>
                  <CalendarIcon />
                </span>
              </div>
            </div>
            <div className={styles.inputFieldD}>
              <label className={styles.llabel}>End Date</label>
              <div className={styles.inputWrapper}>
                <input
                  type="date"
                  value={endDate}
                  readOnly
                  className={styles.input}
                />
                <span className={styles.icon}>
                  <CalendarIcon />
                </span>
              </div>
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
                      setInterestRateAfterDue(value + 5);
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
              <label className={styles.llabel}>
                Interest after due
                <div className={styles.infoIconWrapper}>
                  <span className={styles.infoIcon}>
                    <Infoicon />
                  </span>
                  <div className={styles.tooltipText}>
                    Interest will change to {interestRateAfterDue}% if money
                    isn't paid till end date
                  </div>
                </div>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  value={interestRateAfterDue}
                  readOnly
                  className={styles.input}
                />
                <span className={styles.icon}>%</span>
              </div>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <Btn
              label="Save Draft"
              onClick={handleSaveDraft}
              icon={<Drafticon />}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LoanForm;
