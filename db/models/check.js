const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Check = sequelize.define("check", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  checkId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  checkAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  claimable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ChiefAccountSignature: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ChiefAdminSignature: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
module.exports = Check;
