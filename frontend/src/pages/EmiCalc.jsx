import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";
import styles from "./style/emi.module.css";
import { Button } from "../components/common/Button";
import { calculateEMI, generateBarData } from "./helper/emiHelper";
import { InfoCircleOutlined } from "@ant-design/icons";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const COLORS = ["#4CAF50", "#FF9800"];

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(8);
  const [loanTenure, setLoanTenure] = useState(20);
  const [tenureType, setTenureType] = useState("years");
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const handleCalculateEMI = () => {
    const result = calculateEMI(
      loanAmount,
      interestRate,
      loanTenure,
      tenureType
    );
    setEmi(result.emi);
    setTotalInterest(result.totalInterest);
    setTotalPayment(result.totalPayment);
  };

  const pieData = [
    { name: "Principal Amt.", value: parseFloat(loanAmount) },
    { name: "Total Int.", value: parseFloat(totalInterest) },
  ];

  const barData = generateBarData(
    loanAmount,
    interestRate,
    loanTenure,
    tenureType
  );

  const generateInfoContent = () => {
    const monthlyRate = interestRate / 12 / 100;
    const tenureInMonths =
      tenureType === "years" ? loanTenure * 12 : loanTenure;
    const power = Math.pow(1 + monthlyRate, tenureInMonths);

    return `
      EMI Formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n – 1]
      Where:
      P = Loan amount = ₹${loanAmount}
      r = Monthly interest rate = ${interestRate}% / 12 = ${monthlyRate.toFixed(
      6
    )}
      n = Loan tenure in months = ${tenureInMonths} months

      Monthly EMI = ₹${emi}
      Total Interest = ₹${totalInterest}
      Total Payment = ₹${totalPayment}
    `;
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.calculator}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>EMI Calculator</h2>
            <div className={styles.infoIcon} title={generateInfoContent()}>
              <InfoCircleOutlined />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Loan Amount (₹)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Loan Tenure</label>
            <div className={styles.inputGroupTenure}>
              <input
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />

              <button
                className={`px-4 py-2 rounded-lg ${
                  tenureType === "years"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setTenureType("years")}
              >
                Years
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  tenureType === "months"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setTenureType("months")}
              >
                Months
              </button>
            </div>
          </div>
          <Button onClick={handleCalculateEMI} text="Calculate EMI" />
          <div className={styles.resultContainer}>
            <p>
              <strong>Loan EMI</strong>
              <span>₹{emi}</span>
            </p>
            <p>
              <strong>Total Interest Payable</strong>
              <span>₹{totalInterest}</span>
            </p>
            <p>
              <strong>Total Payment (Principal + Interest)</strong>
              <span>₹{totalPayment}</span>
            </p>
          </div>
        </div>
        <div className={styles.chartsContainer}>
          <div className={`${styles.chartBox} ${styles.hideOnSmallScreen}`}>
            <h3 className={styles.title}>EMI Payment Schedule</h3>
            <Bar data={barData} />
          </div>
          <div className={styles.chartBox}>
            <h3 className={styles.title}>Break-up of Total Payment</h3>
            <PieChart width={250} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <RechartsTooltip />
              <RechartsLegend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                className={styles.hideLegendOnSmallScreen}
              />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
