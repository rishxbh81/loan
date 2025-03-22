import axios from 'axios';

export const generateOtp = async (userData, password, apiBaseUrl, isLogin) => {
  console.log("Received Data in generateOtp:", userData); // Debugging

  if (!userData.email && !userData.mobile_number) {
      throw new Error("Please enter either email or mobile number.");
  }

  const response = await fetch(`${apiBaseUrl}/generate-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userData, password })
  });

  return await response.json();
};

export const validateOtp = async (email,password, otp, apiBaseUrl) => {
  console.log("validateOtp called with:", { apiBaseUrl, email, otp });

  const response = await axios.post(`${apiBaseUrl}/validate-otp`, {
    email,
    password, 
    otp
  });

  return response.data;
};
