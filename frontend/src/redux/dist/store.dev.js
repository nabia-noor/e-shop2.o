"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _user = require("./reducers/user");

var _seller = require("./reducers/seller");

var _product = require("./reducers/product");

var _event = require("./reducers/event");

var _cart = require("./reducers/cart");

var _wishlist = require("./reducers/wishlist");

var _order = require("./reducers/order");

// src/redux/store.js
// singular: 'product'
var Store = (0, _toolkit.configureStore)({
  reducer: {
    user: _user.userReducer,
    seller: _seller.sellerReducer,
    product: _product.productReducer,
    events: _event.eventReducer,
    cart: _cart.cartReducer,
    wishlist: _wishlist.wishlistReducer,
    order: _order.orderReducer
  }
});
var _default = Store;
exports["default"] = _default;