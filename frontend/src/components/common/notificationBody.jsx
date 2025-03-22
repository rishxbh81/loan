import styles from "./style/Notification.module.css"; // Import the CSS module

const NotificationBody = ({ title, message, time }) => {
  return (
    <div className={styles.notificationBody}>
      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <div className={styles.notificationName}>{title}</div>
          <div className={styles.starCheckbox}>
            {/* Optional: Checkbox or any other content */}
          </div>
        </div>
        <p className={styles.notificationLine}>{message}</p>
        <p className={styles.notificationLineTime}>{time}</p>
      </div>
    </div>
  );
};

export default NotificationBody;
