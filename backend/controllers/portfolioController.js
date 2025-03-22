const {Portfolio} = require("../models/Portfolio");

exports.savePortfolio = async (req, res) => {
  try {
    const investor_id = req.user?.investor_id;

    if (!investor_id) {
      return res.status(401).json({
        uniqueCode: "PT23",
        message: "Unauthorized: No investor_id found in token",
        data: "",
      });
    }
    const { total_funds, active_loans, roi, monthly_earnings } = req.body;
    if (!total_funds || !active_loans || !roi || !monthly_earnings) {
      return res.status(400).json({
        uniqueCode: "PT23",
        message: "All fields are required",
        data: "",
      });
    }
    const portfolio = await Portfolio.findOne({ investor_id });
    if (!portfolio) {
      return res.status(404).json({
        uniqueCode: "PT23",
        message: "Portfolio not found. Please contact support.",
        data: "",
      });
    }
    portfolio.total_funds = total_funds;
    portfolio.active_loans = active_loans;
    portfolio.roi = roi;
    portfolio.monthly_earnings = monthly_earnings;
    await portfolio.save();
    res.status(200).json({
      uniqueCode: "PT23",
      message: "Portfolio data updated successfully",
      data: { portfolio_id: portfolio.portfolio_id },
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    res.status(500).json({
      uniqueCode: "PT23",
      message: "Internal Server Error",
      data: "",
    });
  }
};


exports.getPortfolio = async (req, res) => {
  try {
    const investor_id = req.user?.investor_id;

    if (!investor_id) {
      return res.status(401).json({
        uniqueCode: "PT24",
        message: "Unauthorized: No investor_id found in token",
        data: "",
      });
    }
    const portfolio = await Portfolio.findOne({ investor_id });
    if (!portfolio) {
      return res.status(404).json({
        uniqueCode: "PT24",
        message: "Portfolio not found. Please contact support.",
        data: "",
      });
    }
    res.status(200).json({
      uniqueCode: "PT24",
      message: "Portfolio data fetched successfully",
      data: {
        portfolio_id: portfolio.portfolio_id,
        total_funds: portfolio.total_funds,
        active_loans: portfolio.active_loans,
        roi: portfolio.roi,
        monthly_earnings: portfolio.monthly_earnings,
      },
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({
      uniqueCode: "PT24",
      message: "Internal Server Error",
      data: "",
    });
  }
};
