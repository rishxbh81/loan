import React, { useState, useEffect } from "react";
import style from "./style/Header.module.css";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "./assets";
import Notification from "./Notification";
import { useAuthContext } from "../../context/AuthContext";
import LogoutButton from "../../pages/LogoutButton";
import "./style/RippleEffect.css"; // Add this import

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext(); // Get isAuthenticated from context
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsChecked(true);
      document.body.classList.add("dark-mode");
    } else {
      setIsChecked(false);
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const goToHome = () => {
    navigate("/home"); // Redirects to the home page
  };
  const goToProfile = () => {
    navigate("/profile"); // Redirects to the profile page
  };

  // Handle checkbox change to toggle theme
  const handleCheckboxChange = () => {
    // Create fade overlay
    const overlay = document.createElement("div");
    overlay.className = `fade-overlay ${isChecked ? 'light' : ''}`;
    document.body.appendChild(overlay);
    // Add transition class
    document.body.classList.add("theme-transition");
    // Start fade in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
    // Toggle theme
    setTimeout(() => {
      setIsChecked(!isChecked);
      if (!isChecked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
      
      // Start fade out
      overlay.style.opacity = '0';
      
      // Cleanup
      setTimeout(() => {
        overlay.remove();
        document.body.classList.remove("theme-transition");
      }, 500);
    }, 250);
  };
  return (
    <header className={style.header}>
      <div className={style.textLoan} onClick={goToHome}>
        Loan
      </div>

      <div className={style.rightSection}>
        <div className={style.checkboxWrapper}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className={style.actionBtn}>
          {/* Conditionally render UserIcon and Notification based on authentication */}
          {isAuthenticated && (
            <>
              <div className={style.Icon} onClick={goToProfile}>
                <UserIcon />
              </div>
              <div className={style.Icon}>
                <Notification />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
