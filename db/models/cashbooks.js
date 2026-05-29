const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const CashBooks = sequelize.define(
  "cashbook",
  {
    cashbook_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "9665R7268",
    },
    currency: {
      type: DataTypes.ENUM,
      values: ["US", "PH"],
    },
    category: {
      type: DataTypes.ENUM,
      values: ["Bank", "Cash"],
    },
    A_C_No: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    balance_brought_forward_from_previous_month: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    balance_carried_forward_to_next_month: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: 0,
      defaultValue: 0,
    },
  },
  {},
);
module.exports = CashBooks;
