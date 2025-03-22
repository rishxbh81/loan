import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiprof, mailotp, prupdate } from "../utils/Api";
import { Loader } from "../components/common/Loader";
import {
  fetchProfile,
  sendOtp,
  updateProfile,
} from "../components/helper/profileService";
import styles from "../Styles/Profile.module.css";
import { showToast } from "../utils/toastUtils";
import { LocationIcon, BankIcon } from "../components/common/assets";

const ProfileCard = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    address: "",
    email: "",
  });

  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    address: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

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
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
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
          showToast("info", "OTP has been sent to your new email address.");
        } else {
          setOtpMessage("Failed to send OTP. Please try again.");
          showToast("error", "Failed to send OTP. Please try again.");
        }
      }
    );
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    const payload = {
      profile: updatedProfile,
    };

    if (updatedProfile.email !== profile.email) {
      payload.email = updatedProfile.email;
      payload.otp = otp;
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
    <div className={styles.cardContainer}>
      {loading ? (
        <div className={styles.loading}>
          <Loader />
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.profileHeader}>
            <div className={styles.cardImage}> {getInitials(profile.name)}</div>
          </div>
          <h2 className={styles.profileName}>{profile.name || "N/A"}</h2>
          <p className={styles.profileemail}>{profile.email || "N/A"}</p>
          <div className={styles.bankDetails}>
            <p className={styles.profileBank}>
              <BankIcon />
              {profile.bankAcc || "N/A"}
            </p>
            <p className={styles.profilePincode}>
              {" "}
              <LocationIcon />
              {profile.pinCode || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
