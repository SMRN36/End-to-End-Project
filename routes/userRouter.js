const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/userModel');

router.use(express.static("public"));
router.get("/", userController.getLoginPage);
router.post("/signup", userController.postUserSignUp);
router.post("/login",userController.postUserLogin);

module.exports = router;