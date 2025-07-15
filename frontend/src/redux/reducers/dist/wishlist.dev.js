"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wishlistReducer = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  wishlist: localStorage.getItem("wishlistItems") ? JSON.parse(localStorage.getItem("wishlistItems")) : []
};
var wishlistReducer = (0, _toolkit.createReducer)(initialState, function (builder) {
  builder.addCase("addToWishlist", function (state, action) {
    var item = action.payload;
    var isItemExist = state.wishlist.find(function (i) {
      return i._id === item._id;
    });

    if (isItemExist) {
      // Update existing item
      state.wishlist = state.wishlist.map(function (i) {
        return i._id === isItemExist._id ? item : i;
      });
    } else {
      // Add new item
      state.wishlist.push(item);
    }
  }).addCase("removeFromWishlist", function (state, action) {
    state.wishlist = state.wishlist.filter(function (i) {
      return i._id !== action.payload;
    });
  });
});
exports.wishlistReducer = wishlistReducer;