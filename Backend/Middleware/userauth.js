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
      return res.status(403).json(err);
    } else {
      req.user = user;
      next();
    }
  });
};

module.exports = { authentication };