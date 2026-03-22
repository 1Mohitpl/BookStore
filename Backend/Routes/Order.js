const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/userauth");
const Order = require("../Models/Order");
const Cart = require("../Models/Cart");
const User = require("../Models/User");
const Book = require("../Models/Book");

// CREATE ORDER FROM CART
router.post("/order", authentication, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Create order
    const order = new Order({
      user: userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      address: address,
      status: "Order Placed"
    });

    await order.save();

    // Clear cart after order
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({
      message: "Order created successfully",
      order: {
        orderId: order._id,
        itemCount: order.items.length,
        totalPrice: order.totalPrice,
        status: order.status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL ORDERS FOR LOGGED-IN USER
router.get("/orders", authentication, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("items.book")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        message: "No orders found",
        orders: []
      });
    }

    res.status(200).json({
      message: "Orders fetched successfully",
      orderCount: orders.length,
      orders: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE ORDER
router.get("/order/:orderId", authentication, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id || req.user.id;

    const order = await Order.findById(orderId)
      .populate("items.book")
      .populate("user", "username email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order belongs to user (or user is admin)
    if (order.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE ORDER STATUS (Admin only)
router.put("/order/:orderId/status", authentication, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user._id || req.user.id;

    // Check if user is admin
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update order status" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ["Order Placed", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    ).populate("items.book");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// CANCEL ORDER
router.put("/order/:orderId/cancel", authentication, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id || req.user.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns the order
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Only allow cancellation if status is "Order Placed"
    if (order.status !== "Order Placed") {
      return res.status(400).json({ message: "Order cannot be cancelled at this status" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL ORDERS (Admin only)
router.get("/admin/orders", authentication, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view all orders" });
    }

    const orders = await Order.find({})
      .populate("items.book")
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders fetched successfully",
      totalOrders: orders.length,
      orders: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;