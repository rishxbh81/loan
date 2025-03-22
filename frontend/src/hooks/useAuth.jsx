import { useEffect, useState } from "react";
import axiosInstance from "../utils/apiClient";
import { getRefreshToken, saveTokens, clearTokens } from "../utils/tokenUtils";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasLoan, setHasLoan] = useState(false);

  useEffect(() => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      axiosInstance
        .post("/api/auth/refresh-token", { refreshToken })
        .then((response) => {
          const { accessToken, refreshToken: newRefreshToken, loanData } = response.data;

          saveTokens(accessToken, newRefreshToken, loanData);

          setIsAuthenticated(true);

          if (loanData && loanData.length > 0) { 
            setHasLoan(true);
          } else {
            setHasLoan(false);
          }
        })
        .catch(() => {
          clearTokens();
          setIsAuthenticated(false);
          setHasLoan(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      clearTokens();
      setIsAuthenticated(false);
      setHasLoan(false);
      setLoading(false);
    }
  }, []);

  return { isAuthenticated, loading, hasLoan };
};

export default useAuth;
