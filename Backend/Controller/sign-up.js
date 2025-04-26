const express = require ("express");
const User = require("../Models/User");
const Router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


async function SignUp(req, res) {
    try {
        const {username, email, password, address} = req.body;
   
        // check if length of username is shoreter than 4
        if(username.length <= 3) {
           return  res
           .status(400)
           .json( {message :  "Username must be greater than three"});
        }
   
        // Check if User is already exist or not
        
       const existUsername = await User.findOne({username : username});
        if(existUsername) {
           return  res
           .status(400)
           .json( {message :  "Username already exist please entern valid username"});
        }
        
       // check email is already exist
       const existingEmail = await User.findOne({email : email});
       if(existingEmail){
           return res
           .status(400)
           .json({message : "email is already exist please entern valid email"});
       }
       // check if password lenght
        
       if(password.length <= 6) {
           return  res
           .status(400)
           .json( {message :  "password should be six character"});
        }
       
        const hashPassword =  await bcrypt.hash(password, 10);
       // create a new user
       const newuser = new User ({
           username: username,
           email : email,
           password : hashPassword,
           address : address,
       });
       await newuser.save();
       return res
       .status(200)
       .json({message : "sign in succuessfully"});
   
   
   
   
       } catch (Err) { 
           res.status(500).json(`message of an error : ${Err}`);
       }
}


module.exports = {SignUp};