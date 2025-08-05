const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getDashboardSummary,
  searchBooks,
  getBorrowingHistory,
  getOutstandingFines,
  requestBorrowBook,
  updateProfile,
  changePassword,
  getPaymentHistory,
  payFine,
} = require("../controllers/memberController");

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// Dashboard
router.route("/dashboard/summary/:memberId").get(getDashboardSummary);

// Book Interaction
router.route("/books/search").get(searchBooks);
router.route("/borrow/:copyId").post(requestBorrowBook);

// History & Fines
router.route("/borrowing-history/:memberId").get(getBorrowingHistory);
router.route("/fines/:memberId").get(getOutstandingFines);
router.route("/fines/:borrowingId/pay").post(payFine);
router.route("/payments").get(getPaymentHistory);

// Profile Management
router.route("/profile").put(updateProfile);
router.route("/profile/change-password").put(changePassword);

module.exports = router;
