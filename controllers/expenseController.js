const path = require("path");
const Expense = require("../models/expenseModel");
//const database = require("../util/database");

exports.getHomePage = async (req, res, next) => {
  try {
    //const { __dirname } = req;
    res.sendFile(path.join(__dirname, "../", "public", "views", "home.html"));
  } catch (err) {
    console.log(err);
  }
};

exports.addExpense = async (req, res, next) => {
  const { date, category, description, amount } = req.body;

  try {
    const result = await Expense.create({ date, category, description, amount });
    res.status(200);
    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const expense = await Expense.findByPk(id);
    await expense.destroy();
    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
};

exports.editExpense = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  const { category, description, amount } = req.body;
  console.log("values : ", id, category, description, amount);

  try {
    const expense = await Expense.findByPk(id);
    expense.category = category;
    expense.description = description;
    expense.amount = amount;
    await expense.save();
    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
};
