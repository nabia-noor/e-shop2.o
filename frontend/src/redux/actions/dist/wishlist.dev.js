"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeFromWishlist = exports.addToWishlist = void 0;

// add to wishlist
var addToWishlist = function addToWishlist(data) {
  return function _callee(dispatch, getState) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dispatch({
              type: "addToWishlist",
              payload: data
            });
            localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
            return _context.abrupt("return", data);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  };
}; // remove from wishlist


exports.addToWishlist = addToWishlist;

var removeFromWishlist = function removeFromWishlist(data) {
  return function _callee2(dispatch, getState) {
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            dispatch({
              type: "removeFromWishlist",
              payload: data._id
            });
            localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
            return _context2.abrupt("return", data);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    });
  };
};

exports.removeFromWishlist = removeFromWishlist;