const mongoose = require("mongoose");

//mongoDB connections
async function connectionMongoDB(url){
    return mongoose.connect(url);
    
    
    
}

module.exports ={
    connectionMongoDB
};