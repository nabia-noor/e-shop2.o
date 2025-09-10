const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// All products route
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Best-selling products route
router.get("/best-selling", async (req, res) => {
  try {
    const products = await Product.find({});
    const bestSelling = products
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5);
    res.json({
      success: true,
      products: bestSelling,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
