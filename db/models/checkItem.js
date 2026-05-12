const { DataTypes } = require("sequelize");
const sequelize = require('../connection'); 

const CheckItem = sequelize.define('checkItem ',{ 
     id:{ 
        type: DataTypes.INTEGER, 
        primaryKey: true , 
        autoIncrement: true, 
     }, 
     check_id: { 
        type: DataTypes.INTEGER , 
        allowNull: false
     }, 

    title: { 
        type: DataTypes.STRING , 
        allowNull: false, 
    }, 

    description: { 
        type : DataTypes.TEXT  , 
        allowNull: true
    }, 
    amount : { 
        type : DataTypes.FLOAT , 
        defaultValue:0 
    } , 

       
}, {}); module.exports = CheckItem;  