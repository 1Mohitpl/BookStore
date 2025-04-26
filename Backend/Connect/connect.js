// lets connect the mongoose

const mongoose = require("mongoose");

const connectDB = async () => {
     
    await mongoose.connect (
        "mongodb://localhost:27017/BookStore"
);
};


module.exports = {connectDB};
