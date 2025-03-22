import React, { useState, useEffect } from "react";
import NotificationBody from "./notificationBody";
import styles from "./style/Notification.module.css";
import { NotificationIcon } from "../common/assets";
import { useNavigate } from "react-router-dom";
import { CloseIcon, NotiSettingicon } from "../common/assets";
import { API_BASE_URL } from "../../config";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInvestor, setIsInvestor] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setIsInvestor(userRole === "investor");

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}auth/repayment-notification`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.repayments && Array.isArray(data.repayments)) {
        // Convert repayment data to notifications format
        const formattedNotifications = data.repayments.map((repayment) => ({
          title: repayment.status,
          message: `<strong>Loan ID: ${repayment.loan_id}</strong> - Payment of <span style="color: #0066cc">₹${repayment.amount}</span> due on ${repayment.due_date}`,
          time: repayment.due_date,
          type: repayment.status === "Overdue" ? "error" : "warning",
        }));

        setNotifications(formattedNotifications);
      } else if (response.ok && data.message) {
        // Handle case when no repayments are found
        setNotifications([
          {
            title: "No Pending Payments",
            message: data.message,
            time: new Date().toLocaleDateString(),
            type: "info",
          },
        ]);
      } else {
        console.error("Failed to fetch notifications:", data.message);
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };
  const toggleNotification = () => {
    setIsOpen(!isOpen);
  };

  const goToSettings = () => {
    navigate("/notification");
  };

  return (
    <div className={styles.notification}>
      <div onClick={toggleNotification} className={styles.notificationIcon}>
        <NotificationIcon />
      </div>
      {isOpen && (
        <div
          className={`${styles.messagesSection} ${
            isOpen ? styles.messagesSectionShow : ""
          }`}
        >
          <button className={styles.messagesClose} onClick={toggleNotification}>
            <CloseIcon />
          </button>
          <div className={styles.projectsSectionHeader}>Notification</div>
          <div className={styles.messages}>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <NotificationBody
                  key={index}
                  title={<strong>{notification.title}</strong>}
                  message={
                    <div
                      dangerouslySetInnerHTML={{ __html: notification.message }}
                    />
                  }
                  time={notification.time}
                />
              ))
            ) : (
              <div className={styles.noNotifications}>No notifications</div>
            )}
          </div>

          <div className={styles.notificationSettings} onClick={goToSettings}>
            Notification Settings <NotiSettingicon />
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
