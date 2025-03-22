const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const privateapi = require("./routes/private");
const publicapi = require("./routes/public");
const {startCronJobs} = require("./middleware/cronJobs");
const verifyToken = require("./middleware/verifyToken");

dotenv.config();
const { corsOptions } = require("./middleware/cors");

const app = express();
connectDB();

app.use(cors(corsOptions));
app.use(express.json());

startCronJobs();
app.use("/api", publicapi);
app.use("/api/auth", verifyToken, privateapi);


app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
