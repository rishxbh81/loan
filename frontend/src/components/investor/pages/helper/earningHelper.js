import axios from "axios";
import { API_BASE_URL } from "../../../../config";
export const processEarningsData = (earnings) => {
  // Line Chart Data
  const chartData = earnings.map((e) => ({
    month: e.due_date.substring(0, 7),
    amount: parseFloat(e.amount),
  }));

  // Calculate Paid vs Pending
  const totalPaid = earnings
    .filter((e) => e.status === "Paid")
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const totalPending = earnings
    .filter((e) => e.status === "Pending")
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const donutChartData = [
    { name: "Paid", value: totalPaid },
    { name: "Pending", value: totalPending },
  ];

  return {
    chartData,
    donutChartData,
    totalPaid,
    totalPending,
  };
};
