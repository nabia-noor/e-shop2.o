// backend/routes/product.js

const express = require("express");
const router = express.Router();

// Example data - aise hi demo ke liye
const products = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 150 },
];

// Route handle karega GET /api/v1/product/all
router.get("/all", (req, res) => {
  res.json({
    success: true,
    products: products,
  });
});

module.exports = router;
