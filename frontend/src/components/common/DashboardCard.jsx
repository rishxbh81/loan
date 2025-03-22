import React from "react";
import styles from "./style/dashboardcard.module.css"; // You can create this CSS file for styles

const DashboardCard = ({ title, value, desc }) => {
  return (
    <div className={styles.card} title={desc}>
      <div className={styles.data}>
        <p className={styles.value}>{value}</p>

        <div className={styles.title}>
          <p className={styles.titleText}>{title}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
