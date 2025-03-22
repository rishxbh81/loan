import { API_BASE_URL } from "../../config";
import { showToast } from "../../utils/toastUtils";
import apiRequest from "../../components/common/authApi";

export const fetchTickets = async (setLoading) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      showToast("error", "Please log in.");
      return [];
    }

    const response = await apiRequest(
      "GET",
      `${API_BASE_URL}auth/tickets`,
      null,
      accessToken,
      setLoading
    );

    if (
      response.data.status === "success" &&
      Array.isArray(response.data.tickets)
    ) {
      return response.data.tickets;
    }
    return [];
  } catch (err) {
    console.error("API Error:", err);
    showToast("error", "Failed to fetch tickets. Please try again later.");
    return [];
  }
};

export const createTicket = async (formData, setLoading) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      showToast("error", "Please log in.");
      return null;
    }

    const requestData = {
      query_type: formData.query_type,
      description: formData.description,
    };

    const response = await apiRequest(
      "POST",
      `${API_BASE_URL}auth/create-ticket`,
      requestData,
      accessToken,
      setLoading
    );

    if (response.data) {
      showToast("success", "Ticket created successfully");
      return response.data;
    }
    return null;
  } catch (err) {
    console.error("API Error:", err);
    showToast("error", "Failed to create ticket. Please try again later.");
    return null;
  }
};
