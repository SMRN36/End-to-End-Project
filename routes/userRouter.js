const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
//const User = require('../models/userModel');
const userAuthentication = require("../middlewares/auth");

router.use(express.static("public"));
router.get("/", userController.getLoginPage);
router.get("/isPremiumUser", userAuthentication, userController.isPremiumUser);
router.get("/getAllUsers", userController.getAllUsers);
router.get("/resetPasswordPage", userController.resetPasswordPage);
router.post("/sendMail", userController.sendMail);
router.post("/signup", userController.postUserSignUp);
router.post("/login",userController.postUserLogin);

module.exports = router;