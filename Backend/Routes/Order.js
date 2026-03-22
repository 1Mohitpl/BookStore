const express = require("express");
const router = express.Router();
const { authentication, requireAdmin, getCurrentUserId } = require("../Middleware/userauth");
const mongoose = require("mongoose");
const Order = require("../Models/Order");
const Cart = require("../Models/Cart");
const Coupon = require("../Models/Coupon");
const User = require("../Models/User");
const Book = require("../Models/Book");

const VALID_STATUSES = ["Order Placed", "Out for Delivery", "Delivered", "Cancelled"];

const buildOrderDto = (order) => ({
  orderId: order._id,
  itemCount: order.items.length,
  totalPrice: order.totalPrice,
  discountApplied: order.discountApplied,
  couponCode: order.couponCode,
  status: order.status,
  createdAt: order.createdAt
});

const resolveCoupon = async (couponCode, cartTotal) => {
  if (!couponCode) return { couponCode: null, discount: 0 };

  const normalizedCoupon = couponCode.toUpperCase().trim();
  const couponDoc = await Coupon.findOne({ code: normalizedCoupon, isActive: true });
  if (!couponDoc) throw { status: 404, message: "Coupon not found" };
  if (couponDoc.expiresAt < new Date()) throw { status: 400, message: "Coupon has expired" };
  if (cartTotal < couponDoc.minCartValue) throw { status: 400, message: `Minimum cart value for coupon is ${couponDoc.minCartValue}` };

  let discount = couponDoc.discountType === "percentage"
    ? (cartTotal * couponDoc.discountValue) / 100
    : couponDoc.discountValue;

  if (discount > cartTotal) discount = cartTotal;
  return { couponCode: couponDoc.code, discount: Number(discount.toFixed(2)) };
};

// CREATE ORDER FROM CART
router.post("/order", authentication, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = getCurrentUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { address, coupon } = req.body;
    if (!address) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Address is required" });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.book").session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Cart is empty" });
    }

    const { couponCode, discount } = await resolveCoupon(coupon, cart.totalPrice);
    const payableTotal = Number((cart.totalPrice - discount).toFixed(2));

    const order = new Order({
      user: userId,
      items: cart.items,
      totalPrice: payableTotal,
      address,
      status: "Order Placed",
      couponCode,
      discountApplied: discount
    });

    await order.save({ session });
    await Cart.findOneAndDelete({ user: userId }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Order created successfully",
      order: buildOrderDto(order)
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Order creation failed:", error);
    if (error && error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL ORDERS FOR LOGGED-IN USER
router.get("/orders", authentication, async (req, res) => {
  try {
    const userId = getCurrentUserId(req);

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
      orders: orders.map(buildOrderDto)
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
    const userId = getCurrentUserId(req);

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
      order: buildOrderDto(order)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE ORDER STATUS (Admin only)
router.put("/order/:orderId/status", authentication, requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!VALID_STATUSES.includes(status)) {
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
    const userId = getCurrentUserId(req);

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
      order: buildOrderDto(order)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL ORDERS (Admin only)
router.get("/admin/orders", authentication, requireAdmin, async (req, res) => {
  try {

    const orders = await Order.find({})
      .populate("items.book")
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders fetched successfully",
      totalOrders: orders.length,
      orders: orders.map(buildOrderDto)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;