const cron = require("node-cron");
const { sendRepaymentReminder } = require("../services/UserNotification");


const startCronJobs = () => {
  cron.schedule("59 18 * * *", async () => {
    console.log("Running scheduled job: Checking for upcoming repayments...");
    await sendRepaymentReminder();
  });

  console.log("Cron jobs initialized...");
};

module.exports = { startCronJobs };
