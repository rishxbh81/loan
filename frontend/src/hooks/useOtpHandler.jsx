import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { saveTokens } from "../utils/tokenUtils";
import {
  handleGenerateOtp,
  handleValidateOtp,
} from "../components/helper/otpHandlers";
import { showToast } from "../utils/toastUtils";
import { inputFieldConfig } from "../config/inputFieldConfig";
import { buttonConfig } from "../config/buttonConfig";
import { EyeCloseIcon, EyeIcon } from "../components/common/assets";

const useOtpHandler = ({ apiBaseUrl, onSuccessRedirect, isLogin }) => {
  const { setIsAuthenticated, setUser } = useAuthContext();


  const [formData, setFormData] = useState({
    mobile_number: "",  // Changed from mobileNumber to mobile_number
    email: "",
    password: "",
    otp: ""
});
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target || e;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // ✅ This ensures password gets the correct value
    }));
  };
  
  
  
  
  const handleGenerateOtpWrapper = async (e) => {
    e.preventDefault();
    console.log("Form Data Before Sending OTP:", formData);
  
    if (!formData.password) {
      setMessage("Password is required.");
      return;
    }
  
    try {
      await handleGenerateOtp(
        formData,
        apiBaseUrl,
        isLogin,
        setOtpGenerated,
        setMessage,
        showToast
      );
      setOtpGenerated(true);
    } catch (error) {
      console.error("OTP Generation Failed:", error);
    }
  };
  

  const handleValidateOtpWrapper = (e) => {
    e.preventDefault();
    console.log("Validating OTP with data:", formData);
    console.log(apiBaseUrl); // Check what's being passed
    handleValidateOtp(
      formData,
      apiBaseUrl,
      setIsAuthenticated,
      setUser,
      navigate,
      onSuccessRedirect,
      setMessage,
      showToast
    );
  };
  
  
  

  return {
    formData,
    otpGenerated,
    message,
    handleChange,
    inputFields: inputFieldConfig(isLogin).map((field) => ({
      ...field,
      value: formData[field.id],
      disabled: (field.id === "email" || field.id === "mobile_number") ? otpGenerated : field.disabled,
      hidden: field.id === "otp" ? !otpGenerated : field.hidden,
    })),
    
    buttonFields: buttonConfig(isLogin).map((button) => ({
      ...button,
      onClick:
        button.id === "generateOtp"
          ? handleGenerateOtpWrapper
          : button.id === "verifyOtp"
          ? handleValidateOtpWrapper
          : button.onClick,
      hidden: button.id === "verifyOtp" ? !otpGenerated : button.hidden,
    })),
  };
};

export default useOtpHandler;
