"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cartReducer = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  cart: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : []
};
var cartReducer = (0, _toolkit.createReducer)(initialState, function (builder) {
  builder.addCase("addToCart", function (state, action) {
    var item = action.payload;
    var isItemExist = state.cart.find(function (i) {
      return i._id === item._id;
    });

    if (isItemExist) {
      // Update existing item
      state.cart = state.cart.map(function (i) {
        return i._id === isItemExist._id ? item : i;
      });
    } else {
      // Add new item
      state.cart.push(item);
    }
  }).addCase("removeFromCart", function (state, action) {
    // Remove item by filtering
    state.cart = state.cart.filter(function (i) {
      return i._id !== action.payload;
    });
  });
});
exports.cartReducer = cartReducer;