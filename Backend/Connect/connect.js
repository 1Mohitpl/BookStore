const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.data_base_url, {});
    console.log("MongoDB Connected Successfully");
    
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log(process.env.data_base_url); // if this prints undefined, your .env isn't loading
    process.exit(1);
  }
};

module.exports = { connectDB };
