import React, { useEffect, useState, useContext } from "react";
import { LoanContext } from "../context/LoanContext";
import apiRequest from "../components/common/authApi";
import styles from "../Styles/LoanForm.module.css";
import SubmitLoan from "./SubmitLoan";
import { Loader } from "../components/common/Loader";
import { API_BASE_URL } from "../config";

const LoanDetails = () => {
  const { loanData } = useContext(LoanContext);
  const [loanDetails, setLoanDetails] = useState(null);
  const [loan, setLoan] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!loanData.loan_id) {
        setError("Loan ID is missing. Cannot fetch loan details.");
        return;
      }

      try {
        const response = await apiRequest(
          "GET",
          `${API_BASE_URL}auth/ld/${loanData.loan_id}`,
          null,
          accessToken,
          setIsLoading
        );

        console.log("API Response:", response); // Debug the API response

        if (response && response.data && response.data.loan && response.data.loanDetails) {
          setLoanDetails(response.data.loanDetails);
          setLoan(response.data.loan);
        } else {
          setError("Loan details are missing in the response.");
        }
      } catch (err) {
        console.error("Error fetching loan details:", err); // Log the error
        setError(err.message || "Error fetching loan details.");
      }
    };

    fetchLoanDetails();
  }, [loanData.loan_id]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Confirmation Page</h2>

      {isLoading ? (
        <div className={styles.center}>
          <Loader />
        </div>
      ) : loanDetails && loan ? (
        <>
          <div className={styles.loanField}>
            <p className={styles.header}>Loan Information</p>
            <p className={styles.text}>
              <strong>Loan ID:</strong> {loan.loan_id}
            </p>
            <p className={styles.text}>
              <strong>Amount:</strong> {loan.amount}
            </p>
            <p className={styles.text}>
              <strong>Status:</strong> {loan.status}
            </p>
          </div>

          <div className={styles.repayDField}>
            <h4 className={styles.header}>Repayment Details</h4>
            <p className={styles.text}>
              <strong>Interest Rate:</strong> {loanDetails.interest_rate}
            </p>
            <p className={styles.text}>
              <strong>Total Repayment:</strong> {loanDetails.total_repayment}
            </p>
          </div>

          {loanDetails.repayment_schedule.length > 0 && (
            <div className={styles.repaySField}>
              <h4 className={styles.header}>Repayment Schedule</h4>
              <ul className="list-disc pl-6">
                <li className="mb-2 text-black">
                  <p className={styles.text}>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      loanDetails.repayment_schedule[0].date
                    ).toLocaleDateString()}
                    <br />
                  </p>
                  <p className={styles.text}>
                    <strong>Amount:</strong>{" "}
                    {loanDetails.repayment_schedule[0].amount}
                  </p>
                </li>
              </ul>
            </div>
          )}
          <div className={styles.submitBtn}>
            <SubmitLoan />
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <p className="text-gray-500 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
            Loan details not available,
          </p>
          <p className="text-gray-500 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
            Please apply again.
          </p>
        </div>
      )}
    </div>
  );
};

export default LoanDetails;
