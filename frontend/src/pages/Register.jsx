import React, { useState, useEffect } from "react";
import useOtpHandler from "../hooks/useOtpHandler";
import { TextInput } from "../components/common/TextInput";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import style from "./style/LoginForm.module.css";
import { Loader } from "../components/common/Loader";
import { showToast } from "../utils/toastUtils";
import OtpInput from "./OtpInput";
import { API_BASE_URL } from "../config";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isInvestor, setIsInvestor] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({}); // Ensure formData state exists

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const apiBaseUrl = isInvestor
    ? `${API_BASE_URL}investor/register`
    : `${API_BASE_URL}register`;

  const onSuccessRedirect = "/home";
  const { otpGenerated, handleChange, message, inputFields, buttonFields } =
    useOtpHandler({
      apiBaseUrl,
      onSuccessRedirect,
      isLogin: false,
      setFormData, // Pass setFormData to update state
    });

  // Handle OTP Generation
  const validateInputs = (inputFields) => {
    const emailField = inputFields.find((field) => field.id === "email");
    const phoneField = inputFields.find(
      (field) => field.id === "mobile_number"
    );
    const nameField = inputFields.find((field) => field.id === "name");

    // Check if fields exist and have values

    if (!emailField?.value?.trim()) {
      showToast("error", "Email is required");
      return false;
    }

    if (!phoneField?.value?.trim()) {
      showToast("error", "Phone number is required");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value.trim())) {
      showToast("error", "Please enter a valid email address");
      return false;
    }

    // Phone number validation (assuming 10 digits)
    if (!/^\d{10}$/.test(phoneField.value.trim())) {
      showToast("error", "Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };
  const handleGenerateOtp = (e) => {
    if (validateInputs(inputFields)) {
      buttonFields.find((button) => button.id === "generateOtp")?.onClick(e);
      setCurrentStep(2);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={style.container}>
      {loading ? (
        <div className={style.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <div className={style.form}>
          <h1 className={style.h1}>
            {isInvestor ? "Investor Register" : "Register"}
          </h1>
          <div className={style.flexColumn}>
            <form className="space-y-4">
              {currentStep === 1 &&
                inputFields
                  .filter(
                    (field) =>
                      !field.hidden &&
                      ["name", "email", "mobile_number", "password"].includes(
                        field.id
                      )
                  )
                  .map((field) => (
                    <TextInput
                      key={field.id}
                      config={field}
                      value={formData[field.id] || ""} // Ensure it's pulling from useOtpHandler
                      onChange={handleChange}
                    />
                  ))}

              {/* Step 2: OTP Input */}
              {currentStep === 2 && (
                <>
                  <p className={style.p}>
                    Code has been sent to{" "}
                    <span style={{ color: "#007bff" }}>
                      {inputFields.find((field) => field.id === "email")?.value}
                    </span>
                  </p>
                  <OtpInput
                    length={4}
                    onChange={(otp) =>
                      handleChange({ target: { name: "otp", value: otp } })
                    }
                  />

                  <div className={style.p}>
                    Didn't receive code?{" "}
                    <span
                      className={style.span}
                      onClick={(e) => {
                        const spanElement = e.currentTarget;
                        const generateOtpButton = buttonFields.find(
                          (button) => button.id === "generateOtp"
                        );

                        // Disable the span and show countdown
                        spanElement.style.pointerEvents = "none";
                        spanElement.style.color = "#808080"; // Gray color
                        let countdown = 30;

                        const interval = setInterval(() => {
                          spanElement.textContent = `Request Again (${countdown}s)`;
                          countdown--;

                          if (countdown < 0) {
                            clearInterval(interval);
                            spanElement.textContent = "Request Again";
                            spanElement.style.pointerEvents = "auto";
                            spanElement.style.color = ""; // Reset to default color
                          }
                        }, 1000);

                        if (generateOtpButton) {
                          generateOtpButton.onClick(e);
                        }
                      }}
                    >
                      Request Again
                    </span>
                  </div>
                </>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                {currentStep === 1 &&
                  buttonFields
                    .filter((button) => button.id === "generateOtp")
                    .map((button) => (
                      <Button
                        key={button.id}
                        type={button.type}
                        text={button.text}
                        onClick={handleGenerateOtp}
                      />
                    ))}

                {currentStep === 2 &&
                  buttonFields
                    .filter((button) => button.id === "verifyOtp")
                    .map((button) => (
                      <Button
                        key={button.id}
                        type={button.type}
                        text={button.text}
                        onClick={button.onClick}
                      />
                    ))}
              </div>
            </form>

            {currentStep === 1 && (
              <>
                <div
                  onClick={() => setIsInvestor(!isInvestor)}
                  className={style.p}
                >
                  {isInvestor
                    ? "Switch to User Register"
                    : "Register as Investor"}
                </div>
                <p className={style.p}>
                  Already have an account?{" "}
                  <span onClick={goToLogin} className={style.span}>
                    Sign In
                  </span>
                </p>
              </>
            )}

            {message && <p className={style.error}>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
