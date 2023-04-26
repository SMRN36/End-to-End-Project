const path = require('path');
const User = require('../models/userModel');

exports.getLoginPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
};

exports.postUserSignUp = async (req, res, next) => {
    const {name, email, password} = req.body;
    try{
        const existingUser = await User.findOne({email : email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const result = await User.create({
            name: name,
            email: email,
            password: password
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Something Went Wrong"});
    }
}

exports.postUserLogin = async (req, res, next) => {
    const {email, password} = req.body;
    try{
        const existingUser = await User.findOne({email : email});
        if(!existingUser){
            return res.status(404).json({message: "User not found"});
        }
        if(existingUser.password === password){
            res.status(200).json({message:"Login Successfull"});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Something Went Wrong"});
    }
}