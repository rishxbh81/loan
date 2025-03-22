import { API_BASE_URL } from "../../config";
import { showToast } from "../../utils/toastUtils";

export const fetchDashboardData = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      showToast("error", "No access token found. Please log in.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}auth/loancount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (response.ok) {
      return data;
    } else {
      showToast("error", data.message || "Failed to fetch dashboard data.");
      return null;
    }
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    showToast("error", "Failed to fetch dashboard data.");
    return null;
  }
};
