const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const db = require("./models"); // This will run index.js in models

// Import routes
const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerRoutes"); // Now implemented
const memberRoutes = require("./routes/memberRoutes"); // Now implemented

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes); // Use owner routes
app.use("/api/member", memberRoutes); // Use member routes

// Simple base route for testing
app.get("/", (req, res) => {
  res.send("Library Management System API is running...");
});

const PORT = process.env.PORT || 5000;

// Test DB Connection and Sync Models
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully.");
    // Sync all models
    // Using { force: false } will not drop tables if they already exist
    return db.sequelize.sync({ force: false });
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("Error connecting to the database: " + err));
