const jwt = require("jsonwebtoken");

const generateToken = (
  user_id = null,
  investor_id = null,
  role = null,
  expiresIn = "1001h"
) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    const payload = {};

    if (user_id) {
      payload.user_id = user_id;
    }

    if (investor_id) {
      payload.investor_id = investor_id;
    }

    if (role) {
      payload.role = role;
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  } catch (err) {
    console.error("Error generating token:", err);
    throw new Error("Error generating token");
  }
};

const generateRefreshToken = (id) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  } catch (err) {
    console.error("Error generating refresh token:", err);
    throw new Error("Error generating refresh token");
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  });
};

const verifyRefreshToken = (token) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("Error verifying refresh token:", err);
    throw new Error("Invalid or expired refresh token");
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
