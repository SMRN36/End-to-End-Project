const sequelize = require("sequelize");
const db = require("../utils/database");

const ResetPassword = db.define("ResetPassword", {
  id: {
    type: sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    //autoIncrement: true,
  },
  isActive: sequelize.BOOLEAN,
});

module.exports = ResetPassword;