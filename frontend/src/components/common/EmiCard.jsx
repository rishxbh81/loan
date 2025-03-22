import React from "react";
import styles from "./style/dashboardcard.module.css"; // You can create this CSS file for styles

const EmiCard = ({ title, value, desc, onClick }) => {
  return (
    <div
      className={styles.card}
      title={desc}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.data}>
        <div className={styles.title}>
          <p className={styles.titleText}>{title}</p>
        </div>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
};

export default EmiCard;
