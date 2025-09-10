"use strict";

var express = require("express");

var router = express.Router();

var Product = require("../models/product"); // All products route


router.get("/all", function _callee(req, res) {
  var products;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Product.find({}));

        case 3:
          products = _context.sent;
          res.json({
            success: true,
            products: products
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            success: false,
            message: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Best-selling products route

router.get("/best-selling", function _callee2(req, res) {
  var products, bestSelling;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Product.find({}));

        case 3:
          products = _context2.sent;
          bestSelling = products.sort(function (a, b) {
            return (b.sold || 0) - (a.sold || 0);
          }).slice(0, 5);
          res.json({
            success: true,
            products: bestSelling
          });
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            success: false,
            message: _context2.t0.message
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
module.exports = router;