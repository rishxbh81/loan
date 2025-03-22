import React from "react";
import styles from "./style/dashboardcard.module.css"; // Ensure you have the CSS file

const CustomDashboardCard = ({
  title,
  valueTitle,
  valueTitle2,
  value,
  desc,
  value2,
}) => {
  return (
    <div className={styles.cardCustom} title={desc}>
      <div className={styles.title}>
        <p className={styles.titleTextCustom}>{title}</p>
      </div>
      <div className={styles.dataCustom}>
        <div className={styles.line}>
          <p className={styles.valueCustom}>{value}</p>
          <p className={styles.valueTitle}>{valueTitle}</p>
        </div>
        <div className={styles.line}>
          <p className={styles.valueCustom}>{value2}</p>
          <p className={styles.valueTitle}>{valueTitle2}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomDashboardCard;
