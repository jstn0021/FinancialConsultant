const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const BudgetValue = sequelize.define('BudgetValue', {
  approved_unit: DataTypes.STRING,
  approved_rate: DataTypes.FLOAT,
  approved_qty: DataTypes.FLOAT,
  approved_amount: DataTypes.FLOAT,

  revision_qty: DataTypes.FLOAT,
  revision_rate: DataTypes.FLOAT,
  revision_cost: DataTypes.FLOAT,

  prev_qty: DataTypes.FLOAT,
  prev_amount: DataTypes.FLOAT,

  month_qty: DataTypes.FLOAT,
  month_amount: DataTypes.FLOAT,

  cumulative_qty: DataTypes.FLOAT,
  cumulative_amount: DataTypes.FLOAT,

  remaining_qty: DataTypes.FLOAT,
  remaining_amount: DataTypes.FLOAT,
}, {
  tableName: 'BudgetValues',
  timestamps: true,
});

module.exports = BudgetValue;