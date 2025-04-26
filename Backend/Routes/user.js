const express = require ("express");
const User = require("../Models/User")
const Router = express.Router();

const { SignUp,  LogIn } = require("../controller");


// sign-up functionality 

Router.post ("/sign-up", SignUp)

// sign-IN

Router.post("/sign-in", LogIn)

module.exports = Router;