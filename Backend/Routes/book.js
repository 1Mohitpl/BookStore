const { authentication } = require("../Middleware/userauth");
const express = require("express");
const Book = require("../Models/Book");
const User = require("../Models/User");

const router = express.Router();
const updatebookrouter = express.Router();

router.post("/addbook", authentication, async (req, res) => {
  try {
    const { id } = req.headers;

    // find user
    const user = await User.findById(id);

    // check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add books" });
    }

    // create book
    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });

    await book.save();

    res.status(200).json({ message: "Book added successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/updatebook", authentication, async (req, res) => {
  try {
    // first take book from headers
    const { bookid } = req.headers;

    // find the book by book id
    const foundbookId = await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });

    return res.status(200).json({
      message: "Book Updated Successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "an error occurred",
    });
  }
});

module.exports = router;
