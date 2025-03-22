const UserFeedback = require("../models/UserFeedback");
const InvestorFeedback = require("../models/Feedback");

const submitGenericFeedback = async (req, res, model, userType) => {
  try {
    const user_id = req.user?.user_id;
    const investor_id = req.user?.investor_id;

    if (userType === "user" && !user_id) {
      return res.status(401).json({ status: "error", message: "Unauthorized: User ID required" });
    }
    if (userType === "investor" && !investor_id) {
      return res.status(401).json({ status: "error", message: "Unauthorized: Investor ID required" });
    }

    const { rating, comments } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ status: "error", message: "Invalid rating. Must be between 1 and 5." });
    }

    let feedback;
    if (userType === "user") {
      feedback = new model({ user_id, rating, comments });
    } else if (userType === "investor") {
      feedback = new model({ investor_id, rating, comments });
    }

    await feedback.save();

    return res.status(200).json({
      status: "success",
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// ✅ API for User Feedback
const submitUserFeedback = (req, res) => submitGenericFeedback(req, res, UserFeedback, "user");

// ✅ API for Investor Feedback
const submitInvestorFeedback = (req, res) => submitGenericFeedback(req, res, InvestorFeedback, "investor");

module.exports = {
  submitUserFeedback,
  submitInvestorFeedback,
};
