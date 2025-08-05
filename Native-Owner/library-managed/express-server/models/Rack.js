const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rack = sequelize.define(
  "Rack",
  {
    rack_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rack_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    location_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Racks",
    timestamps: false,
  }
);

module.exports = Rack;
