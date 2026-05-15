const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const BudgetItem = sequelize.define(
  "BudgetItem",
  {
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    json_detailed: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "BudgetItems",
    timestamps: true,
  },
);

module.exports = BudgetItem;
