const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  jwt.verify(token, process.env.private_key, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = async (req, res, next) => {
  const userId = req.user && (req.user._id || req.user.id);
  if (!userId) {
    return res.status(401).json({ message: "Invalid user in token" });
  }

  const User = require("../Models/User");
  const user = await User.findById(userId).select("role");
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

const getCurrentUserId = (req) => {
  return req.user && (req.user._id || req.user.id);
};

module.exports = { authentication, requireAdmin, getCurrentUserId };