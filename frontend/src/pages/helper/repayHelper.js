import { API_BASE_URL } from "../../config";
import { showToast } from "../../utils/toastUtils";
export const fetchLoans = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      showToast("error", "Please log in.");
      throw new Error("Access token is missing. Please log in.");
    }

    const response = await fetch(`${API_BASE_URL}auth/repayment-schedule`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      if (Array.isArray(data)) {
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } else {
      showToast("error", data.message || "Failed to fetch loans");
      return [];
    }
  } catch (err) {
    showToast("error", "Failed to fetch loans. Please try again.");
    return [];
  }
};

export const fetchRepaymentSchedule = async (loanId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}auth/repayment-schedule`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      const loanSchedule = data.data.find((loan) => loan.loan_id === loanId);
      if (loanSchedule) {
        return loanSchedule.repayment_schedule;
      }
      showToast("error", "No repayment schedule found for this loan");
      return [];
    } else {
      showToast("error", data.message || "Failed to fetch repayment schedule");
      return [];
    }
  } catch (err) {
    console.error("Error fetching repayment schedule:", err);
    showToast("error", "Failed to fetch repayment schedule");
    return [];
  }
};
