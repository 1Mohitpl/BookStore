const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/userauth");
const Cart = require("../Models/Cart");
const Book = require("../Models/Book");

// ADD TO CART
router.post("/cart", authentication, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const userId = req.user._id || req.user.id;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    // Validate and set default quantity
    const itemQuantity = quantity && quantity > 0 ? parseInt(quantity) : 1;

    if (itemQuantity < 1 || itemQuantity > 99) {
      return res.status(400).json({ message: "Quantity must be between 1 and 99" });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find user's cart or create new one
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: []
      });
    }

    // Check if book already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.book.toString() === bookId
    );

    if (existingItemIndex > -1) {
      // Update quantity if book already in cart
      cart.items[existingItemIndex].quantity += itemQuantity;
    } else {
      // Add new item to cart
      cart.items.push({
        book: bookId,
        quantity: itemQuantity,
        price: book.price
      });
    }

    await cart.save();

    res.status(200).json({
      message: "Book added to cart successfully",
      cart: {
        itemCount: cart.items.length,
        totalPrice: cart.totalPrice
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET CART
router.get("/cart", authentication, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        cart: {
          items: [],
          itemCount: 0,
          totalPrice: 0
        }
      });
    }

    res.status(200).json({
      message: "Cart fetched successfully",
      cart: {
        items: cart.items,
        itemCount: cart.items.length,
        totalPrice: cart.totalPrice
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// REMOVE ITEM FROM CART
router.delete("/cart/:bookId", authentication, async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id || req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item index
    const itemIndex = cart.items.findIndex(
      item => item.book.toString() === bookId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item
    cart.items.splice(itemIndex, 1);

    // If cart is empty, delete the cart
    if (cart.items.length === 0) {
      await Cart.findOneAndDelete({ user: userId });
      return res.status(200).json({
        message: "Item removed from cart. Cart is now empty",
        cart: {
          items: [],
          itemCount: 0,
          totalPrice: 0
        }
      });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Item removed from cart successfully",
      cart: {
        itemCount: cart.items.length,
        totalPrice: cart.totalPrice
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// CLEAR ENTIRE CART
router.delete("/cart", authentication, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({
      message: "Cart cleared successfully",
      cart: {
        items: [],
        itemCount: 0,
        totalPrice: 0
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET CART BY USER ID (admin/authorized)
router.get("/cart/user/:userId", authentication, async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found for this user",
        cart: {
          items: [],
          itemCount: 0,
          totalPrice: 0
        }
      });
    }

    res.status(200).json({
      message: "User cart fetched successfully",
      cart: {
        items: cart.items,
        itemCount: cart.items.length,
        totalPrice: cart.totalPrice
      }
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;