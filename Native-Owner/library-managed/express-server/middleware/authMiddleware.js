const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { User } = require("../models");

/**
 * Middleware to protect routes by verifying JWT.
 * It decodes the token, finds the user in the database,
 * and attaches the user object to the request (`req.user`).
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);

      // Get user from the token's ID and attach to request object
      // Exclude the password hash for security
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password_hash"] },
      });

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

/**
 * Middleware to authorize routes for 'Owner' role only.
 * This should be used *after* the `protect` middleware.
 */
const isOwner = (req, res, next) => {
  if (req.user && req.user.role === "Owner") {
    next();
  } else {
    // 403 Forbidden is more appropriate than 401 Unauthorized here
    res.status(403).json({ message: "Forbidden: requires Owner role" });
  }
};

module.exports = { protect, isOwner };
