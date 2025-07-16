"use strict";

// backend/routes/product.js
var express = require("express");

var router = express.Router(); // Example data - aise hi demo ke liye

var products = [{
  id: 1,
  name: "Product 1",
  price: 100
}, {
  id: 2,
  name: "Product 2",
  price: 150
}]; // Route handle karega GET /api/v1/product/all

router.get("/all", function (req, res) {
  res.json({
    success: true,
    products: products
  });
});
module.exports = router;