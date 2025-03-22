import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style/Home.module.css";
import { useAuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const [userRole, setUserRole] = useState("");
  const [showSupportOptions, setShowSupportOptions] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  const mainOptions = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Apply for Loan", path: "/loan" },
    { name: "Repayments", path: "/repay" },
    { name: "Calculate EMI", path: "/emi" },
    { name: "Support", path: "" },
  ];

  const supportOptions = [
    { name: "Support Center", path: "/support" },
    { name: "FAQ", path: "/faq" },
    { name: "Feedback", path: "/feedback" },
  ];

  const investorMainOptions = [
    { name: "Portfolio", path: "/portfolio" },
    { name: "Investment Opportunity", path: "/make-investment" },
    { name: "Earnings & Repayments", path: "/earnings-repayment" },
    { name: "View Report", path: "/report" },
    { name: "Support", path: "" },
  ];

  const options = userRole === "investor" ? investorMainOptions : mainOptions;

  return (
    <div className={styles.container}>
      <div className={styles.right}>
        <div className={styles.optionsContainer}>
          {!showSupportOptions ? (
            options.map((option, index) => (
              <div
                key={index}
                className={styles.optionButton}
                onClick={() => {
                  if (option.name === "Support") {
                    setShowSupportOptions(true);
                  } else {
                    navigate(option.path);
                  }
                }}
              >
                {option.name}
              </div>
            ))
          ) : (
            <>
              {supportOptions.map((option, index) => (
                <div
                  key={index}
                  className={styles.optionButton}
                  onClick={() => {
                    navigate(option.path);
                    setShowSupportOptions(false);
                  }}
                >
                  {option.name}
                </div>
              ))}
              <div
                className={`${styles.optionButton} ${styles.backButton}`}
                onClick={() => setShowSupportOptions(false)}
              >
                Back
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
