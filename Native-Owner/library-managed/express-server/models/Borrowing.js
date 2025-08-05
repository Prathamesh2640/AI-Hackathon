const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Borrowing = sequelize.define(
  "Borrowing",
  {
    borrowing_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    copy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    issue_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fine_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    fine_paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    overdue_days_at_return: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Borrowings",
    timestamps: false,
  }
);

module.exports = Borrowing;
