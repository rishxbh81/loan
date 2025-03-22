import React, { useState } from "react";

import styles from "../Styles/Loan.module.css";
import PageSlider from "./PageSlider";
import LoanForm from "./LoanForm";
import SubmitLoan from "./SubmitLoan";
import { useNavigate } from "react-router-dom";
import UpdateLoanDetails from "./UpdateLoanDetails";
import useUpload from "../hooks/useUpload";
import LoanDetails from "./LoanDetails";
import ProfileCard from "./ProfileCard";
import LoanList from "./LoanList";
import { Button } from "../components/common/Button";
import { showToast } from "../utils/toastUtils";
import {
  UserIcon,
  RupeesIcon,
  DocumentIcon,
  EyeIcon,
} from "../components/common/assets";
const Loan = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    { label: "Contact Details", icon: <UserIcon /> },
    { label: "Loan Requirements", icon: <RupeesIcon /> },
    { label: "Document Upload", icon: <DocumentIcon /> },
    { label: "Review", icon: <EyeIcon /> },
  ];

  const handleNext = () => {
    if (currentSubStep === 1) {
      if (currentStep === 3) {
        navigate("/dashboard");
        showToast("info", "Loan application sent for verfications");
      } else if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setCurrentSubStep(0);
      }
    } else {
      setCurrentSubStep(1);
    }
  };

  const handleBack = () => {
    if (currentSubStep === 0) {
      if (currentStep === 0) {
        navigate(-1);
      } else if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
        setCurrentSubStep(1);
      }
    } else {
      setCurrentSubStep(0);
    }
  };

  const renderForms = () => {
    if (currentStep === 0) {
      return (
        <div>{currentSubStep === 0 ? <ProfileCard /> : <PageSlider />}</div>
      );
    } else if (currentStep === 1) {
      return <div>{currentSubStep === 0 ? <LoanForm /> : <LoanDetails />}</div>;
    } else if (currentStep === 2) {
      return (
        <div>
          {currentSubStep === 0 ? <UpdateLoanDetails /> : <LoanDetails />}
        </div>
      );
    } else if (currentStep === 3) {
      return <div>{currentSubStep === 0 ? <LoanList /> : <LoanDetails />}</div>;
    }
  };

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.stepperWrapper}>
        <div className={styles.stepper}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div
                className={`${styles.stepIcon} ${
                  index <= currentStep
                    ? styles.stepIconActive
                    : styles.stepIconInactive
                }`}
              >
                {step.icon}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`${styles.stepLine} ${
                    index < currentStep
                      ? styles.stepLineActive
                      : styles.stepLineInactive
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formWrapper}>
        {renderForms()}
        <div className={styles.buttonContainer}>
          <Button onClick={handleBack} type="button" text="Back" />
          <Button
            onClick={handleNext}
            type="button"
            text={currentSubStep === 1 ? "Next" : "Continue"}
          />
        </div>
      </div>
    </div>
  );
};

export default Loan;
