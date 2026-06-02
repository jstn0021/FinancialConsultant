const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const PH_Cash_Bank = sequelize.define(
  "ph_cash_bank",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    slipNo: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    A_C_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    job_No: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reference_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payee_payer_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payee_payer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    receipt: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    payment: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    others: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    glCount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    CRM: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    SIno: {
      type: DataTypes.STRING,
    },
    AR_ORNo: {
      type: DataTypes.STRING,
    },
    Claimable: {
      type: DataTypes.ENUM,
      values: ["Non-Claimable", "Claimable"],
      defaultValue: "Non-Claimable",
    },
    code_invoice_DOTR: {
      type: DataTypes.STRING,
      defaultValue: "N/A",
    },
    reimbursable_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {},
);
module.exports = PH_Cash_Bank;
