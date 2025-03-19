const mongoose = require ("mongoose");


const Book = new mongoose.schema ({
      
    url : {
      type : String,
       required : true,
    },

    title : {
       type: String,
       required : true,
    },

    author : {
        type: String,
        required : true,
    },

    price : {
        type: Number,
        required : true,
    }, 

    Description : {
        type: String,
        required : true,
    }, 
    Language : {
        type: String,
        required : true,
    }, 

     

},
{timestemps : true}

);

module.exports = mongoose.model("books", Book); 