import { useEffect, useState } from "react";
import { Card } from "../jsx/card";
import { CardContent } from "../jsx/cardContent";
import { Button } from "../../common/Button";
import { useNavigate } from "react-router-dom";
import styles from "./style/PortfolioDashboard.module.css";
import { fetchPortfolioData } from "./helper/portfolioHelper";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PortfolioDashboard = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  useEffect(() => {
    const fetchPortfolio = async () => {
      const { success, data, error } = await fetchPortfolioData();
      if (success) {
        setPortfolio(data);
      } else {
        console.warn("Error fetching portfolio:", error);
        if (error.message === "No token found") {
          navigate("/login");
        }
        setPortfolio(null);
      }
    };

    fetchPortfolio();
  }, []);

  const goToInvestment = () => {
    navigate("/make-investment");
  };

  const pieData = portfolio
    ? [
        { name: "Active Loans", value: portfolio.active_loans * 10000 },
        {
          name: "Remaining Funds",
          value: portfolio.total_funds - portfolio.active_loans * 10000,
        },
      ]
    : [];

  const COLORS = ["#0088FE", "#00C49F"];

  const lineData = [
    { month: "Jan", roi: 10 },
    { month: "Feb", roi: 12 },
    { month: "Mar", roi: 11 },
    { month: "Apr", roi: 13 },
    { month: "May", roi: 14 },
    { month: "Jun", roi: 15 },
  ];
  // const pieData = [
  //   { name: "Active Loans", value: 4000 },
  //   { name: "Remaining Funds", value: 3000 },
  // ];

  return (
    <>
      <h2 className={styles.title}>Portfolio</h2>
      <div className={styles.dashboardContainer}>
        <Card>
          <CardContent>
            <p className={styles.cardValue}>₹{portfolio?.total_funds || 0}</p>
            <h3 className={styles.cardTitle}>Total Funds</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className={styles.cardValue}>{portfolio?.active_loans || 0}</p>
            <h3 className={styles.cardTitle}>Active Loans</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className={styles.cardValue}>{portfolio?.roi || 0}%</p>
            <h3 className={styles.cardTitle}>Return Of Investment</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className={styles.cardValue}>
              ₹{portfolio?.monthly_earnings || 0}
            </p>
            <h3 className={styles.cardTitle}>Monthly Earnings</h3>
          </CardContent>
        </Card>

        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>Fund Allocation</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50} // Donut effect
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(1)}%)`
                  } // Adds label with percentage
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyChartState}>
              <h3 className="text-black text-center">Please start investing</h3>
            </div>
          )}
        </div>

        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>ROI Trends</h3>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
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
          ) : (
            <div className={styles.emptyChartState}>
              <h3 className="text-black">No data available</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PortfolioDashboard;
