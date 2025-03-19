const express = require ("express");
const Router = express.Router();

// sign-up functionality 

Router.post ("/sigin-up", async (req, res) => {

    try {
     const {username, email, password, address} = req.body;

     // check if length of username is shoreter than3 4
     if(username.length <= 3) {
        res.status(400).json( {message :  "Username must be greater than three"});
     }
    } catch (Err) { 
        res.status(500).json(`message of an error : ${Err}`);
    }
})



module.exports = Router;