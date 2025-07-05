"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllProducts = exports.deleteProduct = exports.getAllProductsShop = exports.createProduct = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _server = require("../../server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// create product
var createProduct = function createProduct(name, description, category, tags, originalPrice, discountPrice, stock, shopId, images) {
  return function _callee(dispatch) {
    var _ref, data;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            dispatch({
              type: "productCreateRequest"
            });
            _context.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].post("".concat(_server.server, "/product/create-product"), name, description, category, tags, originalPrice, discountPrice, stock, shopId, images));

          case 4:
            _ref = _context.sent;
            data = _ref.data;
            dispatch({
              type: "productCreateSuccess",
              payload: data.product
            });
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            dispatch({
              type: "productCreateFail",
              payload: _context.t0.response.data.message
            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
}; // get All Products of a shop


exports.createProduct = createProduct;

var getAllProductsShop = function getAllProductsShop(id) {
  return function _callee2(dispatch) {
    var _ref2, data;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            dispatch({
              type: "getAllProductsShopRequest"
            });
            _context2.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].get("".concat(_server.server, "/product/get-all-products-shop/").concat(id)));

          case 4:
            _ref2 = _context2.sent;
            data = _ref2.data;
            dispatch({
              type: "getAllProductsShopSuccess",
              payload: data.products
            });
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            dispatch({
              type: "getAllProductsShopFailed",
              payload: _context2.t0.response.data.message
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
}; // delete product of a shop


exports.getAllProductsShop = getAllProductsShop;

var deleteProduct = function deleteProduct(id) {
  return function _callee3(dispatch) {
    var _ref3, data;

    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            dispatch({
              type: "deleteProductRequest"
            });
            _context3.next = 4;
            return regeneratorRuntime.awrap(_axios["default"]["delete"]("".concat(_server.server, "/product/delete-shop-product/").concat(id), {
              withCredentials: true
            }));

          case 4:
            _ref3 = _context3.sent;
            data = _ref3.data;
            dispatch({
              type: "deleteProductSuccess",
              payload: data.message
            });
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            dispatch({
              type: "deleteProductFailed",
              payload: _context3.t0.response.data.message
            });

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
}; // get all products


exports.deleteProduct = deleteProduct;

var getAllProducts = function getAllProducts() {
  return function _callee4(dispatch) {
    var _ref4, data;

    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            dispatch({
              type: "getAllProductsRequest"
            });
            _context4.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].get("".concat(_server.server, "/product/get-all-products")));

          case 4:
            _ref4 = _context4.sent;
            data = _ref4.data;
            dispatch({
              type: "getAllProductsSuccess",
              payload: data.products
            });
            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](0);
            dispatch({
              type: "getAllProductsFailed",
              payload: _context4.t0.response.data.message
            });

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
};

exports.getAllProducts = getAllProducts;