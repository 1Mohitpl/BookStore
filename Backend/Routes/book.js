const express = require("express");
const router = express.Router();

const Book = require("../Models/Book");
const User = require("../Models/User");
const { authentication } = require("../Middleware/userauth");


router.post("/books", authentication, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can add books"
      });
    }

    const { url, title, author, price, desc, language } = req.body;

    if (!url || !title || !author || !price || !desc || !language) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const book = new Book({
      url,
      title,
      author,
      price,
      desc,
      language
    });

    await book.save();

    res.status(201).json({
      message: "Book added successfully",
      data: book
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/books/:id", authentication, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update books"
      });
    }

    const { id } = req.params;

    const { url, title, author, price, desc, language } = req.body;

    const book = await Book.findByIdAndUpdate(
      id,
      { url, title, author, price, desc, language },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json({
      message: "Book updated successfully",
      data: book
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});


router.delete("/books/:id", authentication, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete books"
      });
    }

    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json({
      message: "Book deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});


// Get ALL the books
router.get("/books", async (req, res) => {

  try {

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);

    const skip = (page - 1) * limit;

    const sortField = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const books = await Book.find()
      .sort({ [sortField]: order })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments();

    res.json({
      data: books,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
      
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }

});


// GET SINGLE BOOK

router.get("/books/:id", async (req, res) => {

  try {

    const book = await Book.findById(req.params.id)
      .populate("reviews.user", "name email");

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json(book);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});

// SEARCH BOOK

router.get("/books/search/:keyword", async (req, res) => {

  try {

    const keyword = req.params.keyword;

    const books = await Book.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { author: { $regex: keyword, $options: "i" } }
      ]
    });

    res.json(books);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});

// ADD REVIEW

router.post("/books/:id/review", authentication, async (req, res) => {

  try {

    const { rating, comment } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    const alreadyReviewed = book.reviews.find(
      r => r.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this book"
      });
    }

    const review = {
      user: req.user.id,
      rating,
      comment
    };

    book.reviews.push(review);

    // calculate average rating
    const totalRating = book.reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    book.averageRating = totalRating / book.reviews.length;

    await book.save();

    res.json({
      message: "Review added"
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});

// TOP RATED BOOKS

router.get("/books/top/rated", async (req, res) => {

  try {

    const books = await Book.find()
      .sort({ averageRating: -1 })
      .limit(5);

    res.json(books);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});

module.exports = router;