const sequelize = require('sequelize');
const db = require('../utils/database');

const Expenses = db.define("expenses", {
    id:{
        type:sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    date:{
        type:sequelize.STRING,
        allowNull:true,
    },
    category:{
        type:sequelize.STRING,
        allowNull:true,
    },
    description:{
        type:sequelize.STRING,
        allowNull:true,
    },
    amount:{
        type:sequelize.INTEGER,
        allowNull:true,
    },
});

module.exports = Expenses;