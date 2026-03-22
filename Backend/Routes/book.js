const express = require("express");
const router = express.Router();

const Book = require("../Models/Book");
const User = require("../Models/User");
const { authentication, requireAdmin, getCurrentUserId } = require("../Middleware/userauth");


// add books

router.post("/books", authentication, requireAdmin, async (req, res) => {
  try {
    const { url, title, author, price, desc, language, category } = req.body;

    if (!url || !title || !author || !price || !desc || !language || !category) {
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
      language,
      category
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


// update book
router.put("/books/:id", authentication, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { url, title, author, price, desc, language, category } = req.body;

    const book = await Book.findByIdAndUpdate(
      id,
      { url, title, author, price, desc, language, category },
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

// delete book
router.delete("/books/:id", authentication, requireAdmin, async (req, res) => {
  try {
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
router.get("/books/recent", async (req, res) => {
  try {

    const books = await Book.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(4);

    res.status(200).json({
      message: "Recent books fetched successfully",
      data: books
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

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

    // filtering
    const { category, minPrice, maxPrice, q, language } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (language) filter.language = language;

    const priceFilter = {};
    if (minPrice != null && !Number.isNaN(parseFloat(minPrice))) {
      priceFilter.$gte = parseFloat(minPrice);
    }
    if (maxPrice != null && !Number.isNaN(parseFloat(maxPrice))) {
      priceFilter.$lte = parseFloat(maxPrice);
    }
    if (Object.keys(priceFilter).length) {
      filter.price = priceFilter;
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
        { desc: { $regex: q, $options: "i" } }
      ];
    }

    let books = await Book.find(filter)
      .sort({ [sortField]: order })
      .skip(skip)
      .limit(limit)
      .lean();

    // if popularity sorting requested, sort by favorites count in-memory as fallback
    if (sortField === "popularity") {
      books = books.sort((a, b) => (b.favorites?.length || 0) - (a.favorites?.length || 0));
    }

    const total = await Book.countDocuments(filter);

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

// GET FLASH SALE BOOKS
router.get("/books/flash-sale", async (req, res) => {
  try {
    const now = new Date();
    const books = await Book.find({
      salePrice: { $exists: true, $ne: null },
      saleStart: { $lte: now },
      saleEnd: { $gte: now }
    });

    res.status(200).json({
      message: "Flash sale books fetched successfully",
      count: books.length,
      data: books
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET USER RECOMMENDATIONS
router.get("/books/recommendations", authentication, async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const user = await User.findById(userId).populate("favourites");
    if (!user) return res.status(404).json({ message: "User not found" });

    const categories = new Set();
    user.favourites.forEach((b) => categories.add(b.category));

    if (Array.isArray(user.recentlyViewed) && user.recentlyViewed.length) {
      const recentlyViewedBooks = await Book.find({ _id: { $in: user.recentlyViewed } }).select("category").lean();
      recentlyViewedBooks.forEach((b) => categories.add(b.category));
    }

    const excludedBookIds = user.favourites.map((b) => b._id);

    const recBooks = await Book.find({
      category: { $in: Array.from(categories) },
      _id: { $nin: excludedBookIds }
    })
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(10);

    res.status(200).json({
      message: "Personalized recommendations",
      data: recBooks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL CATEGORIES
router.get("/books/categories", async (req, res) => {
  try {
    const categories = await Book.distinct("category");
    res.status(200).json({
      message: "Categories fetched successfully",
      categories
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// GET SINGLE BOOK

router.get("/books/:id", authentication, async (req, res) => {

  try {

    const book = await Book.findById(req.params.id)
      .populate("reviews.user", "name email");

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    // Track recently viewed books for user (atomic, avoids full-document hit)
    const userId = getCurrentUserId(req);
    if (userId) {
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { recentlyViewed: book._id },
          $push: { recentlyViewed: { $each: [book._id], $position: 0, $slice: 10 } }
        },
        { new: true }
      );
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

    const userId = getCurrentUserId(req);
    const alreadyReviewed = book.reviews.find(
      r => r.user.toString() === userId
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this book"
      });
    }

    const review = {
      user: userId,
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


// ADD TO WISHLIST
router.post("/books/:id/wishlist", authentication, async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const bookExists = await Book.exists({ _id: id });
    if (!bookExists) return res.status(404).json({ message: "Book not found" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: id } },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: updatedUser.wishlist.map(String).includes(String(id)) ? "Added to wishlist" : "Already in wishlist"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// REMOVE FROM WISHLIST
router.delete("/books/:id/wishlist", authentication, async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: id } },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET USER WISHLIST
router.get("/user/wishlist", authentication, async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Wishlist fetched", data: user.wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD TO FAVORITES
router.post("/books/favorite", authentication, async (req, res) => {
  try {
    const bookId = req.body._id || req.body.id || req.body.bookId;
    const userId = getCurrentUserId(req);

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required. Send it as _id, id, or bookId" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookExists = await Book.exists({ _id: bookId });
    if (!bookExists) return res.status(404).json({ message: "Book not found" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favourites: bookId } },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    const inFavorites = updatedUser.favourites.map(String).includes(String(bookId));
    return res.status(200).json({ message: inFavorites ? "Book added to favorites" : "Book already in favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

    
     



// REMOVE FROM FAVORITES
router.delete("/books/:id/favorite", authentication, async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favourites: req.params.id } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Book removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// GET USER'S FAVORITE BOOKS
router.get("/user/favorites", authentication, async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).populate("favourites"); // populate means refers to whole data from books
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Favorites fetched successfully",
      count: user.favourites.length,
      data: user.favourites
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;