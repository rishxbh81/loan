import { API_BASE_URL } from "../config";
import { showToast } from "../utils/toastUtils";

export const handleProfileUpdate = async (
  updatedProfile,
  profile,
  otp,
  accessToken,
  callbacks
) => {
  const { setProfile, setIsEditing, setOtp, setOtpSent } = callbacks;
  const payload = {
    full_name: updatedProfile.full_name,
    father_or_mother_name: updatedProfile.father_or_mother_name,
    marital_status: updatedProfile.marital_status,
    current_address: updatedProfile.current_address,
    permanent_address: updatedProfile.permanent_address,
    mobile_number: updatedProfile.mobile_number,
    email_id: updatedProfile.email_id,
    educational_qualification: updatedProfile.educational_qualification,
    employment_type: updatedProfile.employment_type,
    company_name: updatedProfile.company_name,
    company_type: updatedProfile.company_type,
    current_job_designation: updatedProfile.current_job_designation,
    official_email: updatedProfile.official_email,
    business_details: updatedProfile.business_details,
    annual_turnover: updatedProfile.annual_turnover,
    existing_emi_commitments: updatedProfile.existing_emi_commitments,
    other_income_sources: updatedProfile.other_income_sources,
    annual_income: updatedProfile.annualIncome,
    bank_name: updatedProfile.bank_name,
    branch: updatedProfile.branch,
    account_type: updatedProfile.account_type,
    account_number: updatedProfile.account_number,
    salary_credit_mode: updatedProfile.salary_credit_mode,
    credit_score: updatedProfile.credit_score,
  };

  // If email is being updated, include OTP
  if (updatedProfile.email_id !== profile.email_id) {
    payload.email = updatedProfile.email_id;
    payload.otp = otp;
  }

  console.log("Sending payload:", payload);

  try {
    const response = await fetch(`${API_BASE_URL}auth/update-profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    // Log response details
    console.log("Response details:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      type: response.type,
      url: response.url,
    });

    const updatedData = await response.json();
    console.log("Response data:", updatedData);

    if (response.ok) {
      setProfile(updatedData);
      setIsEditing(false);
      setOtp("");
      setOtpSent(false);
      showToast("success", "Profile updated successfully!");
    } else {
      console.error("Error response:", updatedData);
      showToast(
        "error",
        updatedData.message || "Failed to update profile. Please try again."
      );
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    showToast("error", "An error occurred. Please try again.");
  }
};
