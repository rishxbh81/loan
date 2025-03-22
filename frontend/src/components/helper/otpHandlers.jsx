import { generateOtp, validateOtp } from "../../services/authService";
import { saveTokens } from "../../utils/tokenUtils";

export const handleGenerateOtp = async (
  formData,
  apiBaseUrl,
  isLogin,
  setOtpGenerated,
  setMessage,
  showToast
) => {
  try {
    if (!formData.email && !formData.mobile_number) {
      setMessage("Please enter either email or mobile number.");
      showToast("error", "Please enter either email or mobile number.");
      return;
    }

    const response = await generateOtp(
      { email: formData.email, mobile_number: formData.mobile_number },
      formData.password,
      apiBaseUrl,
      isLogin
    );

    const successMessage = response.message || "OTP sent successfully";
    setMessage(successMessage);
    showToast("success", successMessage);
    setOtpGenerated(true);
  } catch (error) {
    handleApiError(error, setMessage, showToast);
  }
};

export const handleValidateOtp = async (
  formData,
  apiBaseUrl,
  setIsAuthenticated,
  setUser,
  navigate,
  onSuccessRedirect,
  setMessage,
  showToast
) => {
  try {
    console.log("Validating OTP with data:", formData);
    console.log(apiBaseUrl);
    if (!formData.email && !formData.mobile_number) {
      setMessage("Please enter either email or mobile number.");
      showToast("error", "Please enter either email or mobile number.");
      return;
    }

    const response = await validateOtp(
      formData.email,
      formData.password,
      formData.otp.target.value, // ✅ Extract the OTP value
      apiBaseUrl
    );

    console.log("OTP Validation Response:", response);

    if (response?.status === "success") {
      showToast("success", "OTP validated successfully");

      const { accessToken, refreshToken, uniqueCode, role } = response;

      if (accessToken && uniqueCode && role) {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify({ uniqueCode, role }));

        setIsAuthenticated(true);
        setUser({ uniqueCode, role });

        console.log("User set in context:", { uniqueCode, role });

        navigate(onSuccessRedirect || "/dashboard");
      } else {
        console.error("Access token, uniqueCode, or role missing in response");
      }
    } else {
      const errorMessage = response?.message || "OTP verification failed";
      showToast("error", errorMessage);
      setMessage(errorMessage);
    }
  } catch (error) {
    handleApiError(error, setMessage, showToast);
  }
};


const handleApiError = (error, setMessage, showToast) => {
  const errorMessage = error?.response?.data?.message || "Something went wrong";
  console.error("API Error:", error?.response?.data || error);
  setMessage(errorMessage);
  showToast("error", errorMessage);
};
