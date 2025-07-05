"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeFromCart = exports.addTocart = void 0;

// add to cart
var addTocart = function addTocart(data) {
  return function _callee(dispatch, getState) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dispatch({
              type: "addToCart",
              payload: data
            });
            localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
            return _context.abrupt("return", data);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  };
}; // remove from cart


exports.addTocart = addTocart;

var removeFromCart = function removeFromCart(data) {
  return function _callee2(dispatch, getState) {
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            dispatch({
              type: "removeFromCart",
              payload: data._id
            });
            localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
            return _context2.abrupt("return", data);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    });
  };
};

exports.removeFromCart = removeFromCart;