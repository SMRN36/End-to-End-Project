const path = require("path");
const Expense = require("../models/expenseModel");
//const database = require("../util/database");

exports.getHomePage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "public", "views", "home.html"));
  } catch (err) {
    console.log(err);
  }
};

exports.addExpense = async (req, res, next) => {
  const date = req.body.date;
  const category = req.body.category;
  const description = req.body.description;
  const amount = req.body.amount;
  try {
    const result = await Expense.create({
      date: date,
      category: category,
      description: description,
      amount: amount,
      userId: req.user.id,
    });
    res.status(200);
    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    res.json(expenses);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Expense.destroy({ where: { id: id, userId: req.user.id } });
    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
};

exports.editExpense = async (req, res, next) => {
  const id = req.params.id;
  const category = req.body.category;
  const description = req.body.description;
  const amount = req.body.amount;
  try {
    const result = await Expense.update(
      {
        category: category,
        description: description,
        amount: amount,
      },
      { where: { id: id, userId: req.user.id } }
    );
    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
};
