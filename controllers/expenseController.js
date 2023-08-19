const path = require("path");
const mongoose = require("mongoose");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");


exports.getHomePage = async (req, res, next) => {
  try {
    res.sendFile(
      path.join(__dirname, "../", "public", "views", "home.html")
    );
  } catch (err) {
    console.log(err);
  }
};

exports.addExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const date = req.body.date;
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;

    const user = await User.findById(req.user.id);
    user.totalExpenses += Number(amount);
    await user.save({ session });

    const expense = new Expense({
      date: date,
      category: category,
      description: description,
      amount: amount,
      userId: req.user.id,
    });

    await expense.save({ session });
    await session.commitTransaction();
    res.status(200).redirect("/home");
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
  } finally {
    session.endSession();
  }
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
  } catch (err) {
    console.log(err);
  }
};

exports.getAllExpensesforPagination = async (req, res, next) => {
  try {
    const pageNo = req.params.page;
    const limit = 5;
    const offset = (pageNo - 1) * limit;
    const totalExpenses = await Expense.countDocuments({ userId: req.user.id });
    const totalPages = Math.ceil(totalExpenses / limit);
    const expenses = await Expense.find({ userId: req.user.id })
      .skip(offset)
      .limit(limit);
    res.json({ expenses: expenses, totalPages: totalPages });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  console.log("Request Parameter ID:", req.params.id);
  
  
  try {
    const id = new mongoose.Types.ObjectId(req.params.id.trim());
    console.log("Expense ID:", id);
    console.log("User ID:", req.user.id);
    const expense = await Expense.findOne({ _id: id, userId: req.user.id });
    const user = await User.findById(req.user.id);
    user.totalExpenses -= expense.amount;
    await user.save();
    await Expense.deleteOne({ _id: id, userId: req.user.id });
    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
};

exports.editExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;

    const expense = await Expense.findOne({ _id: id, userId: req.user.id });
    const user = await User.findById(req.user.id);

    user.totalExpenses = user.totalExpenses - expense.amount + Number(amount);
    await user.save();

    await Expense.updateOne(
      { _id: id, userId: req.user.id },
      {
        category: category,
        description: description,
        amount: amount,
      }
    );
    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
};













// const path = require("path");
// const Expense = require("../models/expenseModel");
// const User = require("../models/userModel");
// //const database = require("../util/database");

// exports.getHomePage = async (req, res, next) => {
//   try {
//     res.sendFile(path.join(__dirname, "../", "public", "views", "home.html"));
//   } catch (err) {
//     console.log(err);
//   }
// };

// exports.addExpense = async (req, res, next) => {
//   const date = req.body.date;
//   const category = req.body.category;
//   const description = req.body.description;
//   const amount = req.body.amount;
//   User.update(
//     {
//       totalExpenses: req.user.totalExpenses + amount,
//     },
//     { where: { id: req.user.id } }
//   );


//   try {
//     const result = await Expense.create({
//       date: date,
//       category: category,
//       description: description,
//       amount: amount,
//       userId: req.user.id,
//     });
//     res.status(200);
//     res.redirect("/home");
//   } catch (err) {
//     console.log(err);
//   }
// };

// exports.getAllExpenses = async (req, res, next) => {
//   try {
//     const expenses = await Expense.findAll({ where: { userId: req.user.id } });
//     res.json(expenses);
//   } catch (err) {
//     console.log(err);
//   }
// };

// exports.getAllExpensesPagination = async (req, res, next) => {
//   try {
//     const pageNo = req.params.page;
//     const limit = 5;
//     const offset = (pageNo - 1) * limit;
//     const totalExpenses = await Expense.count({
//       where: { userId: req.user.id },
//     });
//     const totalPages = Math.ceil(totalExpenses / limit);
//     const expenses = await Expense.findAll({
//       where: { userId: req.user.id },
//       offset: offset,
//       limit: limit,
//     });
//     res.json({ expenses: expenses, totalPages: totalPages });
//   } catch (err) {
//     console.log(err);
//   }
// };

// exports.deleteExpense = async (req, res, next) => {
//   const id = req.params.id;
//   console.log(id, req.user.id);
//     try {
//       const expense = await Expense.findByPk(id);
//       await User.update({
//         totalExpenses: req.user.totalExpenses - expense.amount,
//       },
//       { where: { id: req.user.id } }
//       );
//       await Expense.destroy({ where: { id: id, userId: req.user.id } });
//         res.redirect("/home");
//       } catch (err) {
//         console.log(err);
//     }
//   };

//   exports.editExpense = async (req, res, next) => {
//     try {
//       const id = req.params.id;
//       console.log(req.body);
//       const category = req.body.category;
//       const description = req.body.description;
//       const amount = req.body.amount;
  
//       const expense = await Expense.findByPk(id);
  
//       await User.update(
//         {
//           totalExpenses: req.user.totalExpenses - expense.amount + amount,
//         },
//         { where: { id: req.user.id } }
//       );
  
//       await Expense.update(
//         {
//           category: category,
//           description: description,
//           amount: amount,
//         },
//         { where: { id: id, userId: req.user.id } }
//       );
  
//       res.redirect("/home");
//     } catch (err) {
//       console.log(err);
//     }
//   };
  
