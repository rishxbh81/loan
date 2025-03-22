const { Document } = require("../models/Document");
const { InvestorDocument } = require("../models/InvestorDocuments");
const { Guarantee } = require("../models/Guarantees");

const uploadGenericDocument = async (req, res, model, userType) => {
  try {
    const { file } = req;
    const { type, name, parent_name, address, mobile_number, bank_account_number } = req.body;

    const user_id = typeof req.user?.user_id === "object" ? req.user.user_id.user_id : req.user?.user_id;
    const investor_id = req.user?.investor_id;

    if (!file) {
      return res.status(400).json({
        uniqueCode: "LA13",
        status: "error",
        message: "No file uploaded",
      });
    }

    if (!type || !name || !parent_name || !address || !mobile_number || !bank_account_number) {
      return res.status(400).json({
        uniqueCode: "LA13",
        status: "error",
        message: "All fields are required",
      });
    }

    if (userType === "user" && !user_id) {
      return res.status(401).json({
        uniqueCode: "LA13",
        status: "error",
        message: "Unauthorized: User ID required",
      });
    }

    if (userType === "investor" && !investor_id) {
      return res.status(401).json({
        uniqueCode: "LA13",
        status: "error",
        message: "Unauthorized: Investor ID required",
      });
    }

    let document;
    if (userType === "user") {
      document = await model.create({
        user_id,
        name,
        parent_name,
        address,
        mobile_number,
        bank_account_number,
        type,
        file_path: file.path,
        uploaded_at: new Date(),
      });
    } else if (userType === "investor") {
      document = await model.create({
        investor_id,
        name,
        parent_name,
        address,
        mobile_number,
        bank_account_number,
        type,
        file_path: file.path,
        uploaded_at: new Date(),
      });
    }

    res.status(200).json({
      uniqueCode: "LA13",
      status: "success",
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Error during document upload:", error);
    res.status(500).json({
      uniqueCode: "LA13",
      status: "error",
      message: "Internal server error",
    });
  }
};

const uploadDocument = (req, res) => uploadGenericDocument(req, res, Document, "user");
const uploadGuarantee = (req, res) => uploadGenericDocument(req, res, Guarantee, "user");
const uploadInvestorDocument = (req, res) => uploadGenericDocument(req, res, InvestorDocument, "investor");

module.exports = {
  uploadDocument,
  uploadGuarantee,
  uploadInvestorDocument,
};
