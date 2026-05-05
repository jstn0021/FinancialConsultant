const {DataTypes} = require('sequelize'); 
const sequelize = require('../connection');

const PaymentVouchers = sequelize.define('paymentVoucher', { 
   voucherID : { 
    type : DataTypes.INTEGER, 
    allowNull : false
   }
}, {}); 
module.exports = PaymentVouchers; 