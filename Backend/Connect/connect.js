require("dotenv").config();  // Load .env file
const mongoose = require("mongoose");

const Connection = async () =>{
    try{
         await mongoose.connect(`${process.env.URI}`);
         console.log("connected to database");
         

    } catch (err) {
        console.log(err);
        
    }
}

Connection();