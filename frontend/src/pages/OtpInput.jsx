import React, { useRef, useState } from "react";

const OtpInput = ({ length = 4, value = "", onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Combine the OTP and call the onChange
    const combinedOtp = newOtp.join("");
    onChange({ target: { value: combinedOtp, id: "otp" } });

    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={{
            width: "40px",
            height: "40px",
            textAlign: "center",
            fontSize: "1.2rem",
            border: "1px solid #000",
            borderRadius: "8px",
            backgroundColor: "#f5f5f5",
          }}
        />
      ))}
    </div>
  );
};

export default OtpInput;
