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
      default: <i class="fi fi-ss-user"></i>,
    },

    role: {
      type: string,
      default: "user",
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
