// src/AppContent.js
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { publicRoutes } from "./PublicRoute";
import { privateRoutes } from "./PrivateRoute";
import NotFound from "../../pages/NotFound";

const AppContent = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
      />

      {publicRoutes}

      {privateRoutes}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppContent;
