const Interestrate = require("../models/InterestRate");

// ✅ Add or Update Interest Rate (Admin Only)
exports.setInterestRate = async (req, res) => {
  try {
    // Verify admin role from decoded token
    if (req.user.role !== "user") {
      return res.status(403).json({
        uniqueCode: "AUTH03",
        status: "error",
        message: "Forbidden: Admin access required",
      });
    }

    const { frequency, interest_rate } = req.body;

    if (!frequency || !interest_rate) {
      return res.status(400).json({
        uniqueCode: "AD01",
        status: "error",
        message: "Both frequency and interest rate are required",
      });
    }

    const interestConfig = await Interestrate.findOneAndUpdate(
      { frequency },
      { interest_rate },
      { new: true, upsert: true }
    );

    res.status(200).json({
      uniqueCode: "AD01",
      status: "success",
      message: "Interest rate updated successfully",
      data: interestConfig,
    });
  } catch (error) {
    console.error("❌ Error updating interest rate:", error);
    res.status(500).json({
      uniqueCode: "AD01",
      status: "error",
      message: "Internal server error",
    });
  }
};

// ✅ Get All Interest Rates (No Admin Check Needed)
exports.getInterestRates = async (req, res) => {
  try {
    const interestRates = await Interestrate.find();
    res.status(200).json({
      uniqueCode: "AD02",
      status: "success",
      data: interestRates,
    });
  } catch (error) {
    console.error("❌ Error fetching interest rates:", error);
    res.status(500).json({
      uniqueCode: "AD02",
      status: "error",
      message: "Internal server error",
    });
  }
};

// ✅ Get Interest Rate by Frequency (No Admin Check Needed)
exports.getInterestRateByFrequency = async (req, res) => {
  try {
    const { frequency } = req.params;
    const interestRate = await Interestrate.findOne({ frequency });

    if (!interestRate) {
      return res.status(404).json({
        uniqueCode: "AD03",
        status: "error",
        message: `No interest rate found for frequency: ${frequency}`,
      });
    }

    res.status(200).json({
      uniqueCode: "AD03",
      status: "success",
      data: interestRate,
    });
  } catch (error) {
    console.error("❌ Error fetching interest rate:", error);
    res.status(500).json({
      uniqueCode: "AD03",
      status: "error",
      message: "Internal server error",
    });
  }
};

// ✅ Update Interest Rate (Admin Only)
exports.updateInterestRate = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        uniqueCode: "AUTH03",
        status: "error",
        message: "Forbidden: Admin access required",
      });
    }

    const { frequency } = req.params;
    const { interest_rate } = req.body;

    if (!interest_rate) {
      return res.status(400).json({
        uniqueCode: "AD05",
        status: "error",
        message: "Interest rate is required for update",
      });
    }

    const updatedInterestRate = await Interestrate.findOneAndUpdate(
      { frequency },
      { interest_rate },
      { new: true }
    );

    if (!updatedInterestRate) {
      return res.status(404).json({
        uniqueCode: "AD05",
        status: "error",
        message: `No interest rate found for frequency: ${frequency}`,
      });
    }

    res.status(200).json({
      uniqueCode: "AD05",
      status: "success",
      message: "Interest rate updated successfully",
      data: updatedInterestRate,
    });
  } catch (error) {
    console.error("❌ Error updating interest rate:", error);
    res.status(500).json({
      uniqueCode: "AD05",
      status: "error",
      message: "Internal server error",
    });
  }
};

// ✅ Delete Interest Rate by Frequency (Admin Only)
exports.deleteInterestRate = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        uniqueCode: "AUTH03",
        status: "error",
        message: "Forbidden: Admin access required",
      });
    }

    const { frequency } = req.params;
    const deletedInterest = await Interestrate.findOneAndDelete({ frequency });

    if (!deletedInterest) {
      return res.status(404).json({
        uniqueCode: "AD04",
        status: "error",
        message: `No interest rate found for frequency: ${frequency}`,
      });
    }

    res.status(200).json({
      uniqueCode: "AD04",
      status: "success",
      message: "Interest rate deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting interest rate:", error);
    res.status(500).json({
      uniqueCode: "AD04",
      status: "error",
      message: "Internal server error",
    });
  }
};
