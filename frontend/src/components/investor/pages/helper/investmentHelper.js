import { API_BASE_URL } from "../../../../config";
export const confirmInvestmentRequest = async (loanId, amount) => {
  try {
    const response = await fetch(`${API_BASE_URL}auth/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        investor_id: "1", // Replace with actual investor ID
        loan_id: loanId,
        amount: amount,
      }),
    });

    const result = await response.json();
    return { success: response.ok, data: result };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to confirm investment",
    };
  }
};

export const fetchLoans = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}auth/oppr`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch loans");
    }
    return { success: true, data: result.data || [] };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
