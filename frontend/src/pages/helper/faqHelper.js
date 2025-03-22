import { API_BASE_URL } from "../../config";
import { showToast } from "../../utils/toastUtils";
import apiRequest from "../../components/common/authApi";

export const fetchFAQs = async (setLoading) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      showToast("error", "Please log in.");
      throw new Error("Access token is missing.");
    }

    const response = await apiRequest(
      "GET",
      `${API_BASE_URL}auth/faq/list`,
      null,
      accessToken,
      setLoading
    );

    if (response.data && Array.isArray(response.data.faqs)) {
      return response.data.faqs;
    }
    throw new Error("Invalid API response format.");
  } catch (err) {
    console.error("API Error:", err.message || err);
    showToast("error", "Failed to fetch FAQs.");
    throw err;
  }
};
