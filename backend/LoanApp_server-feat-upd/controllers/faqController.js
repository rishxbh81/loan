const { FAQ, generateFAQId } = require("../models/FAQ"); 

exports.addFAQ = async (req, res) => {
    try {
      if (req.user.role !== "user") { 
        return res.status(403).json({ message: "Unauthorized: Admins only" });
      }
  
      const { question, answer, category } = req.body;
      
     
      if (!question || !answer || !category) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const faq_id = await generateFAQId(); 
  
      const newFAQ = new FAQ({ faq_id, question, answer, category });
  
      await newFAQ.save();
  
      res.status(201).json({ message: "FAQ added successfully", faq: newFAQ });
    } catch (error) {
      console.error("Error adding FAQ:", error); 
      res.status(500).json({ message: "Error adding FAQ", error: error.message });
    }
  };
  
exports.getFAQs = async (req, res) => {
    try {
      const { category } = req.query;
      const query = category && category !== "All" ? { category: { $regex: new RegExp(category, "i") } } : {};
      const faqs = await FAQ.find(query);
  
      res.status(200).json({ faqs });
    } catch (error) {
      res.status(500).json({ message: "Error fetching FAQs", error });
    }
  };
  exports.updateFAQ = async (req, res) => {
    try {
      if (req.user.role !== "admin") { 
        return res.status(403).json({ message: "Unauthorized: Admins only" });
      }
  
      const { faq_id } = req.params; 
      const { question, answer, category } = req.body;
  
      const updatedFAQ = await FAQ.findOneAndUpdate(
        { faq_id },  
        { question, answer, category },
        { new: true }
      );
  
      if (!updatedFAQ) {
        return res.status(404).json({ message: "FAQ not found" });
      }
  
      res.status(200).json({ message: "FAQ updated successfully", faq: updatedFAQ });
    } catch (error) {
      res.status(500).json({ message: "Error updating FAQ", error: error.message });
    }
  };
  
  exports.deleteFAQ = async (req, res) => {
    try {
      if (req.user.role !== "user") {  
        return res.status(403).json({ message: "Unauthorized: Admins only" });
      }
  
      const { faq_id } = req.params; 
      const deletedFAQ = await FAQ.findOneAndDelete({ faq_id }); 
  
      if (!deletedFAQ) {
        return res.status(404).json({ message: "FAQ not found" });
      }
  
      res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting FAQ", error: error.message });
    }
  };
  