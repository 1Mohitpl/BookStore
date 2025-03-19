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


    status : {
        type : String,
        default : "order placed",
        enum : ["order placed", "out for delivery", "Deliverd", "Cancel"]
    },
     

},
{timestemps : true}

);

module.exports = mongoose.model("order", Order); 