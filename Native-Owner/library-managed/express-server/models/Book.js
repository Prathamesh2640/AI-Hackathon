const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Book = sequelize.define(
  "Book",
  {
    book_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publication_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    average_value: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    added_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Books",
    timestamps: false,
  }
);

module.exports = Book;
