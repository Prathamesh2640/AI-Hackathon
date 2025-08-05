const express = require("express");
const router = express.Router();
const { protect, isOwner } = require("../middleware/authMiddleware");
const {
  getDashboardSummary,
  getUserStats,
  getAllMembers,
  updatePaidStatus,
  addBook,
  addBookCopy,
  issueBook,
  returnBook,
  getOverdueBooks,
  collectFine,
  getFinancialOverview,
  getCollectionsOverview,
  getAssetStats,
  getAssetBreakdown,
  getBookWiseCopyReport,
} = require("../controllers/ownerController");

// Apply the protect and isOwner middleware to ALL routes in this file
router.use(protect, isOwner);

// --- Dashboard ---
router.route("/dashboard-summary").get(getDashboardSummary);

// --- User Management & Stats ---
router.route("/stats/users").get(getUserStats);
router.route("/members").get(getAllMembers);
router.route("/members/:memberId/paid-status").put(updatePaidStatus);

// --- Book & Inventory Management ---
router.route("/books").post(addBook);
router.route("/book-copies").post(addBookCopy);

// --- Borrowing & Returns ---
// Note: using copy identifier string in URL, not numeric ID
router.route("/borrow/issue/:copyId/:memberId").post(issueBook);
router.route("/borrow/return/:copyId").post(returnBook);
router.route("/borrowings/overdue").get(getOverdueBooks);

// --- Financials, Assets & Collections (Reports & Actions) ---
router.route("/reports/financial-overview").get(getFinancialOverview);
router.route("/reports/collections-overview").get(getCollectionsOverview);
router.route("/reports/asset-stats").get(getAssetStats);
router.route("/reports/asset-breakdown").get(getAssetBreakdown);
router.route("/reports/book-wise-copies").get(getBookWiseCopyReport);
router.route("/fines/collect/:borrowingId").post(collectFine);

module.exports = router;
