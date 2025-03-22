import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import styles from "./style/ReportPage.module.css";

const ReportsAnalytics = () => {
  const [filters, setFilters] = useState({ dateRange: "", riskLevel: "" });
  const [filteredData, setFilteredData] = useState(null);

  const riskData = [
    { name: "Low Risk", value: 40, level: "Low" },
    { name: "Medium Risk", value: 35, level: "Medium" },
    { name: "High Risk", value: 25, level: "High" },
  ];
  const colors = ["#28a745", "#ffc107", "#dc3545"];

  const roiData = [
    { month: "Jan", roi: 10 },
    { month: "Feb", roi: 12 },
    { month: "Mar", roi: 11 },
    { month: "Apr", roi: 13 },
    { month: "May", roi: 14 },
    { month: "Jun", roi: 15 },
  ];

  const loanData = [
    { type: "Personal", count: 50 },
    { type: "Business", count: 30 },
    { type: "Mortgage", count: 20 },
  ];

  const handleGenerateReport = () => {
    let filteredRiskData = riskData;
    if (filters.riskLevel) {
      filteredRiskData = riskData.filter((d) => d.level === filters.riskLevel);
    }
    setFilteredData(filteredRiskData);
    generatePDF(filteredRiskData);
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const fileName = `Report_${timestamp}.pdf`;

    doc.text("Reports & Analytics", 14, 10);

    const tableData = data.map((item) => [item.name, item.value]);
    doc.autoTable({ head: [["Risk Level", "Value"]], body: tableData });

    doc.text("Loan Distribution", 14, doc.autoTable.previous.finalY + 10);
    const loanTableData = loanData.map((item) => [item.type, item.count]);
    doc.autoTable({
      head: [["Loan Type", "Count"]],
      body: loanTableData,
      startY: doc.autoTable.previous.finalY + 15,
    });

    doc.text("ROI Trends", 14, doc.autoTable.previous.finalY + 10);
    const roiTableData = roiData.map((item) => [item.month, item.roi]);
    doc.autoTable({
      head: [["Month", "ROI"]],
      body: roiTableData,
      startY: doc.autoTable.previous.finalY + 15,
    });

    doc.save(fileName);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reports & Analytics</h2>

      <div className={styles.filters}>
        <input
          type="date"
          value={filters.dateRange}
          className={styles.filterInput}
          onChange={(e) =>
            setFilters({ ...filters, dateRange: e.target.value })
          }
        />
        <select
          value={filters.riskLevel}
          className={styles.filterInput}
          onChange={(e) =>
            setFilters({ ...filters, riskLevel: e.target.value })
          }
        >
          <option value="">Select Risk Level</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button className={styles.generateBtn} onClick={handleGenerateReport}>
          Generate Report
        </button>
      </div>

      {/* Charts */}
      <div className={styles.chartsContainer}>
        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>Loan Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={loanData}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>Risk Allocation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={filteredData || riskData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={75}
                label
              >
                {(filteredData || riskData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>ROI Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={roiData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="roi"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
