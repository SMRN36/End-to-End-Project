const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config();

const sequelize = require('./utils/database');
const userRouter = require('./routes/userRouter');
const expenseRouter = require('./routes/expenseRouter');
const purchaseMembershipRouter = require("./routes/purchaseMembershipRouter");
const leaderboardRouter = require("./routes/leaderboardRouter");

const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/ordersModel");


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/home", expenseRouter);
app.use("/expense", expenseRouter);
app.use("/purchase", purchaseMembershipRouter);
app.use("/premium", leaderboardRouter);


User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);



sequelize
.sync()
.then((result) => {
    app.listen(3000);
})
.catch((err) => console.log(err));