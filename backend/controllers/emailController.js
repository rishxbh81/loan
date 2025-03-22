const sendEmail = require("../services/emailService");

exports.sendEmailHandler = async (req, res) => {
  const { email, subject, content } = req.body;
  try {
    await sendEmail(email, subject, content);
    res.status(200).json({ 
      uniqueCode: "LA17", 
      message: "Email sent successfully", 
      data: "" 
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ 
      uniqueCode: "LA17", 
      message: "Failed to send email", 
      error: error.message,
      data: "" 
    });
  }
};
