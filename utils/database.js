const sequelize = require("sequelize");

const db = new sequelize(process.env.DB_SCHEMA, process.env.DB_USER, process.env.DB_PASSWORD,{
    dialect: "mysql",
    host: process.env.DB_HOST,
});

module.exports = db;

