const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BookCopy = sequelize.define(
  "BookCopy",
  {
    copy_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    copy_identifier: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rack_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Available", "Issued", "Damaged", "Retired"),
      allowNull: false,
      defaultValue: "Available",
    },
    last_known_borrower_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "BookCopies",
    timestamps: false,
  }
);

module.exports = BookCopy;
