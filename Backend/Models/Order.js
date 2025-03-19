const mongoose = require ("mongoose");


const Order = new mongoose.schema ({
    User : {
       type: mongoose.Types.ObjectId,
        ref: "user",
    },
   
    book : {
        type : mongoose.type.ObjectId,
        ref : "books", 

    },
     

})