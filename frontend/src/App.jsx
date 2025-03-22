import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import { AuthProvider } from "./context/AuthContext";
import { LoanProvider } from "./context/LoanContext";
import AppContent from "./components/Routes/AppContent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Header } from "./components/common/Header";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoanProvider>
          <Header />
          <AppContent />
          <ToastContainer />
        </LoanProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
