const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    faq_id: { type: String, unique: true, required: true }, 
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { 
      type: String, 
      required: true, 
      enum: ["Loan Application", "Payments", "Account", "General"] 
    },
  },
  { timestamps: true }
);


const FAQ = mongoose.model("FAQ", faqSchema);


const generateFAQId = async () => {
  const generateId = () => {
    const number = Math.floor(10000 + Math.random() * 90000); 
    return "FQ" + number; 
  };

  let unique = false;
  let faqId;

  while (!unique) {
    faqId = generateId();
    const existingFAQ = await FAQ.findOne({ faq_id: faqId });
    if (!existingFAQ) unique = true;
  }

  return faqId;
};

module.exports = { FAQ, generateFAQId };
