"use strict";

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
  // e.g., ["https://..."]
  sold: {
    type: Number,
    "default": 0
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
module.exports = mongoose.model('Product', productSchema);