const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const userRouter = require('./routes/userRouter');
const expenseRouter = require('./routes/expenseRouter');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/home", expenseRouter);
app.use("/expense", expenseRouter);

sequelize
.sync()
.then((result) => {
    app.listen(3000);
})
.catch((err) => console.log(err));