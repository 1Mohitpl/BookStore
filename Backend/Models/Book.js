// Models/Book.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const Book = new mongoose.Schema(
  {
    url:      { type: String, required: true },
    title:    { type: String, required: true },
    author:   { type: String, required: true },
    price:    { type: Number, required: true },
    desc:     { type: String, required: true },
    language: { type: String, required: true },
    averageRating: { type: Number, default: 0 },  // ← new
    reviews:  [reviewSchema],                      // ← new
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", Book);