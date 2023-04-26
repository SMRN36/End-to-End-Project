const path = require('path');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

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
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });
        res.status(201).json({user:result});
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
        const matchedPassword = await bcrypt.compare(password, existingUser.password);

        if(!matchedPassword){
            res.status(400).json({message:"Invalid Credentials"});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Something Went Wrong"});
    }
}