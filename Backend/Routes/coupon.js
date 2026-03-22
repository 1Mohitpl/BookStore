const express = require("express");
const router = express.Router();
const { authentication, requireAdmin } = require("../Middleware/userauth");
const Coupon = require("../Models/Coupon");


// Create coupon (admin only)
router.post("/coupons", authentication, requireAdmin, async (req, res) => {
  try {
    const { code, discountType, discountValue, minCartValue, expiresAt } = req.body;
    if (!code || !discountType || !discountValue || !expiresAt) {
      return res.status(400).json({ message: "Missing coupon fields" });
    }

    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      minCartValue: minCartValue || 0,
      expiresAt: new Date(expiresAt)
    });

    await coupon.save();

    res.status(201).json({ message: "Coupon created", coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// List coupons (admin)
router.get("/coupons", authentication, requireAdmin, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ updatedAt: -1 });
    res.status(200).json({ message: "Coupons fetched", coupons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Apply coupon (user)
router.post("/coupons/apply", authentication, async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code || cartTotal == null) {
      return res.status(400).json({ message: "code and cartTotal are required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    if (coupon.expiresAt < new Date()) return res.status(400).json({ message: "Coupon expired" });
    if (cartTotal < coupon.minCartValue) {
      return res.status(400).json({ message: `Minimum cart value is ${coupon.minCartValue}` });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    if (discount > cartTotal) discount = cartTotal;

    res.status(200).json({
      message: "Coupon applied",
      code: coupon.code,
      discount: Number(discount.toFixed(2)),
      newTotal: Number((cartTotal - discount).toFixed(2))
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;