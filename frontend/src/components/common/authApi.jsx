import axios from "axios";
import { showToast } from "../../utils/toastUtils";

const apiRequest = async (method, url, payload, accessToken, setLoading, options = {}) => {
  if (!accessToken) {
    showToast("error", "You're not logged in.");
    throw new Error("You're not logged in.");
  }

  setLoading && setLoading(true);

  try {
    const response = await axios({
      method,
      url,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

    // Check if the response is successful
    if (response.status < 200 || response.status >= 300) {
      showToast("error", "Request failed.");
      throw new Error(response.data?.message || "Request failed.");
    }

    return response;
  } catch (error) {
    console.error("API request error:", error);
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Something went wrong. Please try again.";
    showToast("error", errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading && setLoading(false);
  }
};

export default apiRequest;
