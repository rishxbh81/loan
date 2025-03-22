const { Investor } = require("../models/Investor");
const Notification = require("../models/Notification");
const sendEmail = require("./emailService");
const NotificationPreference = require("../models/NotificationPreference");

exports.sendLoanOpportunityNotification = async (loan_id) => {
  try {
  
    const preferences = await NotificationPreference.find({ enable_notifications: true }).select("investor_id");
    if (!preferences.length) return;

    const investorIds = preferences.map(pref => pref.investor_id);

  
    const investors = await Investor.find({ investor_id: { $in: investorIds } }).select("investor_id email");
    if (!investors.length) return;

    const notifications = investors.map(({ investor_id }) => ({
      investor_id,
      loan_id,
      message: `New loan opportunity available! Loan ID: ${loan_id}`,
    }));

    const investorEmails = investors.map(({ email }) => email);

    await Notification.insertMany(notifications);

    
    await Promise.all(
      investorEmails.map(email =>
        sendEmail(email, "New Loan Opportunity",
          `<p>A new loan opportunity (Loan ID: ${loan_id}) is now available for investment. Check your dashboard for details.</p>`
        )
      )
    );

    console.log("Investors notified about loan opportunity:", loan_id);
  } catch (error) {
    console.error("Error sending loan opportunity notification:", error);
  }
};
