const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // CORRECTED: require() the library
const { User } = require("../models");
const config = require("../config/config");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// --- Member Registration ---
exports.registerUser = async (req, res) => {
  const { username, email, password, full_name } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res
        .status(400)
        .json({ message: "User with this email already exists" });

    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists)
      return res.status(400).json({ message: "Username is already taken" });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password_hash,
      full_name,
      role: "Member",
      is_paid_member: false,
    });

    if (user) {
      res.status(201).json({
        message: "Member registered successfully",
        userId: user.user_id,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// --- Owner Registration (For Development ONLY) ---
// WARNING: REMOVE THIS ENDPOINT BEFORE DEPLOYING TO PRODUCTION
exports.registerOwner = async (req, res) => {
  const { username, email, password, full_name } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const ownerCount = await User.count({ where: { role: "Owner" } });
    // Optional: Limit to only one owner for safety even in dev
    if (ownerCount > 0) {
      return res.status(400).json({
        message:
          "An owner account already exists. For security, only one owner can be registered via this endpoint.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const owner = await User.create({
      username,
      email,
      password_hash,
      full_name,
      role: "Owner",
      is_paid_member: true, // Owners are considered "paid" by default
    });

    res.status(201).json({
      message: "Owner registered successfully. You can now log in.",
      userId: owner.user_id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during owner registration",
      error: error.message,
    });
  }
};

// --- Universal Login ---
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.json({
        message: "Login successful",
        token: generateToken(user.user_id, user.role),
        user: {
          id: user.user_id,
          username: user.username,
          role: user.role,
          is_paid_member: user.is_paid_member,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};
