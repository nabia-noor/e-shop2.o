"use strict";

// backend/model/product.js
var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  category: String,
  stock: Number,
  images: [String],
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
module.exports = mongoose.model('Product', productSchema);