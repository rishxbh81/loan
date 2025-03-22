import React, { useEffect, useState } from "react";
import apiRequest from "../components/common/authApi";
import styles from "../Styles/LoanList.module.css";
import { Loader } from "../components/common/Loader";
import { showToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../config";

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          showToast("error", " Please log in.");
          throw new Error("Access token is missing. Please log in.");
        }

        const response = await apiRequest(
          "GET",
          `${API_BASE_URL}auth/getAllLoansForUser`,
          null,
          accessToken,
          setLoading
        );
        
        console.log("API Response:", response);

        // Access the nested data array
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setLoans(response.data.data);
        } else {
          setLoans([]); // In case the response data is not an array
        }
      } catch (err) {
        setError(
          err.message || "Failed to fetch loans. Please try again later."
        );
        showToast("error", "Failed to fetch loans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Loan List</h1>

      {loans.length > 0 ? (
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th className="py-2 px-4 text-center">Loan ID</th>
                <th className="py-2 px-4 text-center">Status</th>
                <th className="py-2 px-4 text-center">Total Repayment</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.loan_id} className={styles.row}>
                  <td className="py-2 px-4 text-center">{loan.loan_id}</td>
                  <td className="py-2 px-4 text-center">{loan.status}</td>
                  <td className="py-2 px-4 text-center">
                    {Number(loan.total_repayment).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <p className={styles.noLoansText}>
            No loans found. Please apply for a loan.
          </p>
        </div>
      )}
    </div>
  );
};

export default LoanList;
