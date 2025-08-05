const {
  User,
  Book,
  BookCopy,
  Borrowing,
  Payment,
  Category,
  Rack,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

// --- Dashboard ---
exports.getDashboardSummary = async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const [
      totalMembers,
      activeMembers,
      totalBooks,
      issuedCopies,
      monthlyRevenue,
      outstandingDues,
      recentActivities,
    ] = await Promise.all([
      User.count({ where: { role: "Member" } }),
      Borrowing.count({
        distinct: true,
        col: "member_id",
        where: { issue_date: { [Op.gte]: oneMonthAgo } },
      }),
      Book.count(),
      BookCopy.count({ where: { status: "Issued" } }),
      Payment.sum("amount", {
        where: { payment_date: { [Op.gte]: oneMonthAgo } },
      }),
      Borrowing.sum("fine_amount", { where: { fine_paid: false } }),
      Borrowing.findAll({
        limit: 5,
        order: [["issue_date", "DESC"]],
        include: [
          { model: User, as: "member", attributes: ["username"] },
          {
            model: BookCopy,
            as: "bookCopy",
            include: [{ model: Book, as: "book", attributes: ["title"] }],
          },
        ],
      }),
    ]);

    res.json({
      kpis: {
        totalMembers: totalMembers || 0,
        activeMembers: activeMembers || 0,
        totalBooks: totalBooks || 0,
        booksIssued: issuedCopies || 0,
        monthlyRevenue: monthlyRevenue || 0,
        outstandingFines: outstandingDues || 0,
      },
      recentActivities,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({
      message: "Error fetching dashboard summary",
      error: error.message,
    });
  }
};

// --- User Management & Stats ---
exports.getUserStats = async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const [totalMembers, activeMembers, newMembersThisMonth, unpaidMembers] =
      await Promise.all([
        User.count({ where: { role: "Member" } }),
        Borrowing.count({
          distinct: true,
          col: "member_id",
          where: { issue_date: { [Op.gte]: oneMonthAgo } },
        }),
        User.count({
          where: {
            role: "Member",
            registration_date: { [Op.gte]: oneMonthAgo },
          },
        }),
        User.count({ where: { role: "Member", is_paid_member: false } }),
      ]);

    res.json({
      totalMembers,
      activeMembers,
      newMembersThisMonth,
      inactiveMembers: unpaidMembers, // Mapped to match frontend expectation
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user stats", error: error.message });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const members = await User.findAll({
      where: { role: "Member" },
      attributes: [
        "user_id",
        "full_name",
        "username",
        "email",
        "is_paid_member",
        "registration_date",
        "last_payment_date",
      ],
      order: [["full_name", "ASC"]],
    });
    res.json(members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching members", error: error.message });
  }
};

exports.updatePaidStatus = async (req, res) => {
  const { memberId } = req.params;
  const { is_paid_member } = req.body;

  try {
    const member = await User.findByPk(memberId);
    if (!member || member.role !== "Member") {
      return res.status(404).json({ message: "Member not found" });
    }

    member.is_paid_member = is_paid_member;
    if (is_paid_member) {
      member.last_payment_date = new Date();
      await Payment.create({
        member_id: memberId,
        type: "Membership Fee",
        amount: 500.0,
        description: "Monthly Membership Fee Payment by Owner",
      });
    }
    await member.save();
    res.json({ message: "Member status updated successfully", member });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating member status", error: error.message });
  }
};

// --- Book & Inventory Management ---
exports.addBook = async (req, res) => {
  const { title, author, publication_year, isbn, category_id, average_value } =
    req.body;
  try {
    const newBook = await Book.create({
      title,
      author,
      publication_year,
      isbn,
      category_id,
      average_value,
    });
    res.status(201).json(newBook);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding book", error: error.message });
  }
};

exports.addBookCopy = async (req, res) => {
  const { book_id, copy_identifier, rack_id } = req.body;
  try {
    const existingCopy = await BookCopy.findOne({ where: { copy_identifier } });
    if (existingCopy) {
      return res
        .status(400)
        .json({ message: "A copy with this identifier already exists." });
    }
    const newCopy = await BookCopy.create({
      book_id,
      copy_identifier,
      rack_id,
      status: "Available",
    });
    res.status(201).json(newCopy);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding book copy", error: error.message });
  }
};

// --- Borrowing & Returns ---
exports.issueBook = async (req, res) => {
  const { copyId, memberId } = req.params;
  const t = await sequelize.transaction();
  try {
    const copy = await BookCopy.findOne({
      where: { copy_identifier: copyId },
      transaction: t,
    });
    if (!copy || copy.status !== "Available") {
      await t.rollback();
      return res.status(400).json({
        message:
          "Book copy identifier not found or is not available for issue.",
      });
    }

    const member = await User.findByPk(memberId, { transaction: t });
    if (!member || !member.is_paid_member) {
      await t.rollback();
      return res
        .status(403)
        .json({ message: "Member must be a paid member to borrow books." });
    }

    const issue_date = new Date();
    const due_date = new Date();
    due_date.setDate(issue_date.getDate() + 7);

    const borrowing = await Borrowing.create(
      { copy_id: copy.copy_id, member_id: memberId, issue_date, due_date },
      { transaction: t }
    );
    copy.status = "Issued";
    copy.last_known_borrower_id = memberId;
    await copy.save({ transaction: t });
    await t.commit();
    res.status(201).json({ message: "Book issued successfully", borrowing });
  } catch (error) {
    await t.rollback();
    res
      .status(500)
      .json({ message: "Error issuing book", error: error.message });
  }
};

exports.returnBook = async (req, res) => {
  const { copyId } = req.params; // Here copyId is the identifier string, e.g., "CC-001"
  const t = await sequelize.transaction();
  try {
    const copy = await BookCopy.findOne({
      where: { copy_identifier: copyId },
      transaction: t,
    });
    if (!copy || copy.status !== "Issued") {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "This book copy is not currently issued." });
    }

    const borrowing = await Borrowing.findOne({
      where: { copy_id: copy.copy_id, return_date: null },
      order: [["issue_date", "DESC"]],
      transaction: t,
    });
    if (!borrowing) {
      copy.status = "Available";
      await copy.save({ transaction: t });
      await t.commit();
      return res.status(404).json({
        message:
          "No active borrowing record found for this copy. Status reset to Available.",
      });
    }

    const return_date = new Date();
    borrowing.return_date = return_date;
    let fine_amount = 0,
      overdue_days = 0;
    if (return_date > borrowing.due_date) {
      overdue_days = Math.ceil(
        Math.abs(return_date - borrowing.due_date) / (1000 * 60 * 60 * 24)
      );
      fine_amount = overdue_days * 5.0;
    }
    borrowing.fine_amount = fine_amount;
    borrowing.overdue_days_at_return = overdue_days;
    await borrowing.save({ transaction: t });
    copy.status = "Available";
    await copy.save({ transaction: t });
    await t.commit();
    res.json({
      message: "Book returned successfully",
      fine_amount,
      overdue_days,
      borrowing,
    });
  } catch (error) {
    await t.rollback();
    res
      .status(500)
      .json({ message: "Error returning book", error: error.message });
  }
};

exports.getOverdueBooks = async (req, res) => {
  try {
    const overdue = await Borrowing.findAll({
      where: { return_date: null, due_date: { [Op.lt]: new Date() } },
      include: [
        { model: User, as: "member", attributes: ["full_name", "email"] },
        {
          model: BookCopy,
          as: "bookCopy",
          include: [
            { model: Book, as: "book", attributes: ["title", "author"] },
          ],
        },
      ],
    });
    res.json(overdue);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching overdue books", error: error.message });
  }
};

// --- Financials, Assets & Collections ---
exports.collectFine = async (req, res) => {
  const { borrowingId } = req.params;
  try {
    const borrowing = await Borrowing.findByPk(borrowingId);
    if (!borrowing)
      return res.status(404).json({ message: "Borrowing record not found" });
    if (borrowing.fine_paid)
      return res
        .status(400)
        .json({ message: "This fine has already been paid." });
    if (borrowing.fine_amount <= 0)
      return res
        .status(400)
        .json({ message: "There is no fine to collect for this borrowing." });

    borrowing.fine_paid = true;
    await borrowing.save();
    await Payment.create({
      member_id: borrowing.member_id,
      type: "Fine",
      amount: borrowing.fine_amount,
      description: `Fine for borrowing #${borrowingId}`,
      related_borrowing_id: borrowingId,
    });
    res.json({ message: "Fine collected successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error collecting fine", error: error.message });
  }
};

exports.getFinancialOverview = async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const [monthlyRevenue, totalAssets] = await Promise.all([
      Payment.sum("amount", {
        where: { payment_date: { [Op.gte]: oneMonthAgo } },
      }),
      Book.sum("average_value"),
    ]);
    const monthlyExpenses = 5750.0; // Placeholder as per HTML, can be made dynamic later
    res.json({
      monthlyRevenue: monthlyRevenue || 0,
      monthlyExpenses,
      netProfit: (monthlyRevenue || 0) - monthlyExpenses,
      profitMargin: monthlyRevenue
        ? (((monthlyRevenue - monthlyExpenses) / monthlyRevenue) * 100).toFixed(
            1
          )
        : 0,
      totalAssets: totalAssets || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching financial overview",
      error: error.message,
    });
  }
};

exports.getCollectionsOverview = async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const [totalCollections, membershipFees, fineCollections, outstandingDues] =
      await Promise.all([
        Payment.sum("amount", {
          where: { payment_date: { [Op.gte]: oneMonthAgo } },
        }),
        Payment.sum("amount", {
          where: {
            type: "Membership Fee",
            payment_date: { [Op.gte]: oneMonthAgo },
          },
        }),
        Payment.sum("amount", {
          where: { type: "Fine", payment_date: { [Op.gte]: oneMonthAgo } },
        }),
        Borrowing.sum("fine_amount", { where: { fine_paid: false } }),
      ]);
    res.json({
      totalCollections: totalCollections || 0,
      membershipFees: membershipFees || 0,
      fineCollections: fineCollections || 0,
      outstandingDues: outstandingDues || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching collections overview",
      error: error.message,
    });
  }
};

exports.getAssetStats = async (req, res) => {
  try {
    const [totalAssetValue, totalBooks, totalCopies, issuedCopies] =
      await Promise.all([
        Book.sum("average_value"),
        Book.count(),
        BookCopy.count(),
        BookCopy.count({ where: { status: "Issued" } }),
      ]);
    const utilizationRate =
      totalCopies > 0 ? ((issuedCopies / totalCopies) * 100).toFixed(1) : 0;
    res.json({
      totalAssetValue: totalAssetValue || 0,
      totalBooks,
      totalCopies,
      utilizationRate: `${utilizationRate}%`,
      issuedCopies, // Added for dashboard use
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching asset stats", error: error.message });
  }
};

exports.getAssetBreakdown = async (req, res) => {
  try {
    const breakdown = await Category.findAll({
      attributes: [
        "category_name",
        [sequelize.fn("COUNT", sequelize.col("books.book_id")), "book_count"],
        [
          sequelize.fn("SUM", sequelize.col("books.average_value")),
          "total_value",
        ],
      ],
      include: [{ model: Book, as: "books", attributes: [] }],
      group: ["Category.category_id", "Category.category_name"],
      raw: true,
    });
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching asset breakdown",
      error: error.message,
    });
  }
};

exports.getBookWiseCopyReport = async (req, res) => {
  try {
    const report = await Book.findAll({
      attributes: [
        "book_id",
        "title",
        "author",
        "average_value",
        [
          sequelize.fn("COUNT", sequelize.col("copies.copy_id")),
          "total_copies",
        ],
        [
          sequelize.literal(
            `SUM(CASE WHEN copies.status = 'Available' THEN 1 ELSE 0 END)`
          ),
          "available_copies",
        ],
        [
          sequelize.literal(
            `SUM(CASE WHEN copies.status = 'Issued' THEN 1 ELSE 0 END)`
          ),
          "issued_copies",
        ],
      ],
      include: [{ model: BookCopy, as: "copies", attributes: [] }],
      group: [
        "Book.book_id",
        "Book.title",
        "Book.author",
        "Book.average_value",
      ],
      order: [["title", "ASC"]],
    });
    res.json(report);
  } catch (error) {
    console.error("Error in getBookWiseCopyReport:", error);
    res.status(500).json({
      message: "Error fetching book-wise copy report",
      error: error.message,
    });
  }
};
