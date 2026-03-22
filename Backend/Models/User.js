const mongoose = require("mongoose");
const validator = require("validator");

const userModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate(value){
         if(!validator.isEmail(value)){
            throw new Error("invalid email id")
         } 
      }
    },

    password: {
      type: String,
      required: true,
      unique: true,
    },

    address: {
      type: String,
      required: true,
    },

    avater: {
      type: String,
      default : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
      
    },

    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },

    favourites: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Book",
      },
    ],

    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "books",
      },
    ],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
      }
    ],
    recentlyViewed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
      }
    ],
    loyaltyPoints: {
      type: Number,
      default: 0
    },
    Orderbook: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order"
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("user", userModel);
module.exports = User;

