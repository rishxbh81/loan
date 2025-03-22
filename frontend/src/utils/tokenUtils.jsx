
export const saveTokens = (accessToken, refreshToken, loanData = null) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  if (loanData) {
    localStorage.setItem("loanData", JSON.stringify(loanData));
  } else {
    localStorage.removeItem("loanData"); 
  }
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("loanData");
};

