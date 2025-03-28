const mongoose = require("mongoose");

const user = new mongoose.Schema(
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
      enum: ["user", "admin"],
    },

    favourites: [
      {
        type: mongoose.Types.ObjectId,
        ref: "books",
      },
    ],

    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "books",
      },
    ],

    Orderbook: [
      {
        type: mongoose.Types.ObjectId,
        ref: "orderbooks",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", user);
