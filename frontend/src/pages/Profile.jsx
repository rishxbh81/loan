import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomTextInput } from "../components/common/CustomTextInput";
import { Button } from "../components/common/Button";
import { inputFieldConfig } from "../config/inputFieldConfig";
import { apiprof, mailotp, prupdate } from "../utils/Api";
import { Loader } from "../components/common/Loader";
import { CustomFileInput } from "../components/document/CustomFileInput";
import Dropdown from "../components/common/Dropdown";
import LogoutButton from "./LogoutButton";
import { API_BASE_URL } from "../config";

import {
  fetchProfile,
  sendOtp,
  updateProfile,
} from "../components/helper/profileService";
import styles from "../Styles/Profile.module.css";
import { showToast } from "../utils/toastUtils";
const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    address: "",
    email: "",
  });

  const [formData, setFormData] = useState({});

  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    address: "",
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const handleLogout = () => {
    clearTokens();
    setIsAuthenticated(false);
    navigate("/login");
    showToast("info", "Session expired , please login again!");
  };
  const formFields = inputFieldConfig(false, true, formData);
  const steps = [
    { title: "Personal Information", fields: formFields.slice(0, 8) },
    { title: "Employment & Income Details", fields: formFields.slice(8, 18) },
    {
      title: "Banking & Financial Information",
      fields: formFields.slice(18, 25),
    },
    {
      title: "KYC Details",
      fields: formFields.slice(25),
    },
  ];

  const handleDropdownChange = (fieldId, selectedOption) => {
    setUpdatedProfile({ ...updatedProfile, [fieldId]: selectedOption });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Form Data:", formData);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchProfile(
        accessToken,
        apiprof,
        navigate,
        setLoading,
        setProfile,
        setUpdatedProfile
      );
    } else {
      handleLogout();
    }
  }, [navigate]);

  const handleInputChange = (e, fieldId) => {
    if (e.target?.files) {
      setUpdatedProfile({ ...updatedProfile, [fieldId]: e.target.files[0] });
    } else {
      const { name, value } = e.target;
      setUpdatedProfile({ ...updatedProfile, [name]: value });
    }
  };

  const handleSendOtp = () => {
    const accessToken = localStorage.getItem("accessToken");
    sendOtp(
      updatedProfile.email,
      accessToken,
      mailotp,
      navigate,
      (otpSuccess) => {
        if (otpSuccess) {
          setOtpSent(true);
          setOtpMessage("OTP has been sent to your new email address.");
        } else {
          setOtpMessage("Failed to send OTP. Please try again.");
        }
      }
    );
  };

  const getInitials = (name) => {
    if (!name) return "U"; // Default if no name
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    const payload = {
      profile: updatedProfile,
    };

    if (updatedProfile.email !== profile.email) {
      payload.email = updatedProfile.email;
      payload.otp = otp;
    }

    try {
      const response = await fetch(`${API_BASE_URL}auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfile(updatedData);
        setIsEditing(false);
        setOtp("");
        setOtpSent(false);
        showToast("success", "Profile updated successfully!");
      } else {
        showToast("error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("error", "An error occurred. Please try again.");
    }
    updateProfile(
      payload,
      accessToken,
      prupdate,
      navigate,
      setProfile,
      setIsEditing,
      setOtp,
      setOtpSent
    );
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <Loader />
        </div>
      ) : !isEditing ? (
        <>
          <div className={styles.profileCard}>
            <div className={styles.logoutButton}>
              <LogoutButton />
            </div>
            <div className={styles.profileHeader}>
              <div className={styles.cardImage}>
                {" "}
                {getInitials(profile.name)}
              </div>
            </div>
            <h2 className={styles.profileName}>{profile.name || "N/A"}</h2>
            <p className={styles.profileemail}>{profile.email || "N/A"}</p>
            <p className={styles.profileLocation}>{profile.address || "N/A"}</p>

            <div className={styles.buttonContainer}>
              <Button
                text="Edit Profile"
                onClick={() => {
                  navigate('/profile/update');  // Navigate to profile update page
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleUpdateProfile} className={styles.updatedForm}>
          {steps.map((stepData, index) =>
            step === index + 1 ? (
              <div key={index} className={styles.stepContainer}>
                {/* Title at the top and centered */}
                <h3 className={styles.title}>{stepData.title}</h3>

                {/* Input fields in a 2x1 grid */}
                <div className={styles.fieldsContainer}>
                  {stepData.fields.map((field) =>
                    field.type === "file" ? (
                      <CustomFileInput
                        key={field.id}
                        label={field.label}
                        file={updatedProfile[field.id]}
                        onFileChange={(file) =>
                          handleInputChange(
                            { target: { files: [file] } },
                            field.id
                          )
                        }
                      />
                    ) : field.type === "select" ? (
                      <Dropdown
                        label={field.label}
                        key={field.id}
                        options={field.options}
                        selectedValue={updatedProfile[field.id]}
                        onChange={(selected) =>
                          handleDropdownChange(field.id, selected)
                        }
                      />
                    ) : (
                      <CustomTextInput
                        key={field.id}
                        config={{
                          ...field,
                          value: updatedProfile[field.id] || "",
                          disabled: otpSent && field.id === "email",
                        }}
                        onChange={handleInputChange}
                      />
                    )
                  )}
                </div>

                {/* Buttons */}
                <div className={styles.buttonContainer}>
                  {step > 1 ? (
                    <Button text="Previous" onClick={prevStep} />
                  ) : (
                    <Button
                      text="Cancel"
                      onClick={() => setIsEditing(false)}
                      className={styles.cancelButton}
                    />
                  )}
                  {step < steps.length ? (
                    <Button text="Next" onClick={nextStep} />
                  ) : (
                    <Button text="Submit" type="submit" />
                  )}
                </div>
              </div>
            ) : null
          )}
        </form>
      )}
    </div>
  );
};

export default Profile;
