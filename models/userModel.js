const sequelize =  require('sequelize');
const db = require('../utils/database');

const User = db.define("users", {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: sequelize.STRING,
    email: sequelize.STRING,
    password: sequelize.STRING,
    isPremiumUser: sequelize.BOOLEAN,
    totalExpenses: {
        type: sequelize.INTEGER,
        defaultValue: 0,
      },
});

module.exports = User;