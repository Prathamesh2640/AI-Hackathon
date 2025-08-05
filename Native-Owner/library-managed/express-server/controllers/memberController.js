const bcrypt = require("bcryptjs");
// CORRECTED: Added 'Rack' to the import list from the models
const {
  User,
  Book,
  BookCopy,
  Borrowing,
  Payment,
  Rack,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

// --- Dashboard ---
exports.getDashboardSummary = async (req, res) => {
  const { memberId } = req.params;
  if (req.user.user_id != memberId) {
    return res
      .status(403)
      .json({ message: "Forbidden: You can only access your own data." });
  }
  try {
    const [currentlyBorrowedCount, totalBooksRead, outstandingFines, nextDue] =
      await Promise.all([
        Borrowing.count({ where: { member_id: memberId, return_date: null } }),
        Borrowing.count({
          where: { member_id: memberId, return_date: { [Op.ne]: null } },
        }),
        Borrowing.sum("fine_amount", {
          where: {
            member_id: memberId,
            fine_paid: false,
            fine_amount: { [Op.gt]: 0 },
          },
        }),
        Borrowing.min("due_date", {
          where: { member_id: memberId, return_date: null },
        }),
      ]);
    res.json({
      currentlyBorrowedCount,
      totalBooksRead,
      outstandingFines: outstandingFines || 0,
      nextDueDate: nextDue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard summary",
      error: error.message,
    });
  }
};

// --- Book Interaction ---
exports.searchBooks = async (req, res) => {
  const { query } = req.query;
  let whereClause = {};

  if (query) {
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${query}%` } },
      { author: { [Op.like]: `%${query}%` } },
    ];
  }

  try {
    const books = await Book.findAll({
      where: whereClause,
      include: [
        {
          model: BookCopy,
          as: "copies",
          // This include was causing the error because 'Rack' was not defined
          include: [
            {
              model: Rack, // This will now work correctly
              as: "rack",
            },
          ],
        },
      ],
      order: [["title", "ASC"]],
    });
    res.json(books);
  } catch (error) {
    console.error("Error in searchBooks:", error); // Added for better server-side debugging
    res
      .status(500)
      .json({ message: "Error searching books", error: error.message });
  }
};

exports.requestBorrowBook = async (req, res) => {
  const { copyId } = req.params;
  const memberId = req.user.user_id;
  const t = await sequelize.transaction();

  try {
    const copy = await BookCopy.findByPk(copyId, { transaction: t });
    if (!copy || copy.status !== "Available") {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "This book copy is not available for borrowing." });
    }

    const member = req.user;
    if (!member.is_paid_member) {
      await t.rollback();
      return res.status(403).json({
        message:
          "Membership is inactive. Please contact the librarian to make a payment.",
      });
    }

    const issue_date = new Date();
    const due_date = new Date();
    due_date.setDate(issue_date.getDate() + 7);

    const borrowing = await Borrowing.create(
      {
        copy_id: copyId,
        member_id: memberId,
        issue_date,
        due_date,
      },
      { transaction: t }
    );

    copy.status = "Issued";
    copy.last_known_borrower_id = memberId;
    await copy.save({ transaction: t });

    await t.commit();
    res.status(201).json({
      message:
        "Book issued successfully! Please collect it from the librarian.",
      borrowing,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      message: "Error processing borrow request",
      error: error.message,
    });
  }
};

// --- History & Fines ---
exports.getBorrowingHistory = async (req, res) => {
  const { memberId } = req.params;
  if (req.user.user_id != memberId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  try {
    const history = await Borrowing.findAll({
      where: { member_id: memberId },
      order: [["issue_date", "DESC"]],
      include: [
        {
          model: BookCopy,
          as: "bookCopy",
          include: [
            {
              model: Book,
              as: "book",
              attributes: ["title", "author"],
            },
          ],
        },
      ],
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching borrowing history",
      error: error.message,
    });
  }
};

exports.getOutstandingFines = async (req, res) => {
  const { memberId } = req.params;
  if (req.user.user_id != memberId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  try {
    const fines = await Borrowing.findAll({
      where: {
        member_id: memberId,
        fine_paid: false,
        fine_amount: { [Op.gt]: 0 },
      },
      include: [
        {
          model: BookCopy,
          as: "bookCopy",
          include: [{ model: Book, as: "book", attributes: ["title"] }],
        },
      ],
    });
    res.json(fines);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching outstanding fines",
      error: error.message,
    });
  }
};

exports.payFine = async (req, res) => {
  const { borrowingId } = req.params;
  const memberId = req.user.user_id;
  const t = await sequelize.transaction();

  try {
    const borrowing = await Borrowing.findByPk(borrowingId, { transaction: t });
    if (!borrowing) {
      await t.rollback();
      return res.status(404).json({ message: "Fine record not found." });
    }
    if (borrowing.member_id !== memberId) {
      await t.rollback();
      return res
        .status(403)
        .json({ message: "You are not authorized to pay this fine." });
    }
    if (borrowing.fine_paid) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "This fine has already been paid." });
    }

    borrowing.fine_paid = true;
    await borrowing.save({ transaction: t });

    await Payment.create(
      {
        member_id: memberId,
        type: "Fine",
        amount: borrowing.fine_amount,
        description: `Fine payment for borrowing #${borrowingId}`,
        related_borrowing_id: borrowingId,
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ message: "Fine paid successfully." });
  } catch (error) {
    await t.rollback();
    res
      .status(500)
      .json({ message: "Error processing fine payment", error: error.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  const memberId = req.user.user_id;
  try {
    const payments = await Payment.findAll({
      where: { member_id: memberId },
      order: [["payment_date", "DESC"]],
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching payment history",
      error: error.message,
    });
  }
};

// --- Profile Management ---
exports.updateProfile = async (req, res) => {
  const memberId = req.user.user_id;
  const { full_name, email } = req.body;

  try {
    const user = await User.findByPk(memberId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (email && email !== user.email) {
      const emailExists = await User.findOne({
        where: { email, user_id: { [Op.ne]: memberId } },
      });
      if (emailExists)
        return res
          .status(400)
          .json({ message: "Email is already in use by another account." });
    }

    user.full_name = full_name || user.full_name;
    user.email = email || user.email;
    await user.save();

    const { password_hash, ...userResponse } = user.get();
    res.json({ message: "Profile updated successfully.", user: userResponse });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const memberId = req.user.user_id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Please provide both current and new passwords." });
  }

  try {
    const user = await User.findByPk(memberId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password." });

    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};
