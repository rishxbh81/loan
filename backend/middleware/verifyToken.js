const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No token provided.");
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      console.log("❌ Token missing from Authorization header.");
      return res.status(401).json({ message: "Access denied. Token missing." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("❌ Token verification failed:", err.name);
        return res.status(401).json({ 
          message: err.name === "TokenExpiredError" ? "Session expired. Please log in again." : "Invalid token."
        });
      }
 
      if ((!decoded.user_id && !decoded.investor_id) || !decoded.role) {
        console.log("❌ Invalid token payload:", decoded);
        return res.status(401).json({ message: "Invalid token payload." });
      }
    
      req.user = decoded; 
      next();
    });
    
  } catch (error) {
    console.error("❌ Token verification error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = verifyToken;
