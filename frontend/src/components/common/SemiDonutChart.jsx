import React from "react";
import styles from "./style/Donut.module.css";

const SemiDonutChart = ({ paid, total }) => {
  const percentPaid = total > 0 ? (paid / total) * 100 : 0;

  return (
    <div className={styles.donut}>
      <div
        className={`${styles["semi-donut-model-2"]} ${styles.margin}`}
        style={{ "--percentage": percentPaid, "--fill": "#01e056" }}
      ></div>

      <p className={styles.percentageText}>{percentPaid.toFixed(1)}% Paid</p>
    </div>
  );
};

export default SemiDonutChart;
