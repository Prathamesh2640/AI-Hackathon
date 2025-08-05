const sequelize = require("../config/database");
const User = require("./User");
const Category = require("./Category");
const Rack = require("./Rack");
const Book = require("./Book");
const BookCopy = require("./BookCopy");
const Borrowing = require("./Borrowing");
const Payment = require("./Payment");

// 1. User Associations
User.hasMany(Borrowing, { foreignKey: "member_id", as: "borrowings" });
User.hasMany(Payment, { foreignKey: "member_id", as: "payments" });

// 2. Category Associations
Category.hasMany(Book, { foreignKey: "category_id", as: "books" });

// 3. Rack Associations
Rack.hasMany(BookCopy, { foreignKey: "rack_id", as: "copies" });

// 4. Book Associations
Book.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Book.hasMany(BookCopy, { foreignKey: "book_id", as: "copies" });

// 5. BookCopy Associations
BookCopy.belongsTo(Book, { foreignKey: "book_id", as: "book" });
BookCopy.belongsTo(Rack, { foreignKey: "rack_id", as: "rack" });
BookCopy.hasMany(Borrowing, { foreignKey: "copy_id", as: "borrowings" });

// 6. Borrowing Associations
Borrowing.belongsTo(User, { foreignKey: "member_id", as: "member" });
Borrowing.belongsTo(BookCopy, { foreignKey: "copy_id", as: "bookCopy" });
Borrowing.hasOne(Payment, {
  foreignKey: "related_borrowing_id",
  as: "finePayment",
});

// 7. Payment Associations
Payment.belongsTo(User, { foreignKey: "member_id", as: "member" });
Payment.belongsTo(Borrowing, {
  foreignKey: "related_borrowing_id",
  as: "relatedBorrowing",
});

// Export all models and the sequelize instance
const db = {
  sequelize,
  User,
  Category,
  Rack,
  Book,
  BookCopy,
  Borrowing,
  Payment,
};

module.exports = db;
