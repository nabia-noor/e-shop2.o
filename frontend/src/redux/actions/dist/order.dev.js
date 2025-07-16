"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllOrdersOfAdmin = exports.getAllOrdersOfShop = exports.getAllOrdersOfUser = void 0;

var _axios = _interopRequireDefault(require("../../axios"));

var _server = require("../../server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// get all orders of user
var getAllOrdersOfUser = function getAllOrdersOfUser(userId) {
  return function _callee(dispatch) {
    var _ref, data;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            dispatch({
              type: "getAllOrdersUserRequest"
            });
            _context.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].get("".concat(_server.server, "/order/get-all-orders/").concat(userId)));

          case 4:
            _ref = _context.sent;
            data = _ref.data;
            dispatch({
              type: "getAllOrdersUserSuccess",
              payload: data.orders
            });
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            dispatch({
              type: "getAllOrdersUserFailed",
              payload: _context.t0.response.data.message
            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
}; // get all orders of seller


exports.getAllOrdersOfUser = getAllOrdersOfUser;

var getAllOrdersOfShop = function getAllOrdersOfShop(shopId) {
  return function _callee2(dispatch) {
    var _ref2, data;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            dispatch({
              type: "getAllOrdersShopRequest"
            });
            _context2.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].get("".concat(_server.server, "/order/get-seller-all-orders/").concat(shopId)));

          case 4:
            _ref2 = _context2.sent;
            data = _ref2.data;
            dispatch({
              type: "getAllOrdersShopSuccess",
              payload: data.orders
            });
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            dispatch({
              type: "getAllOrdersShopFailed",
              payload: _context2.t0.response.data.message
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
}; // get all orders of Admin


exports.getAllOrdersOfShop = getAllOrdersOfShop;

var getAllOrdersOfAdmin = function getAllOrdersOfAdmin() {
  return function _callee3(dispatch) {
    var _ref3, data;

    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            dispatch({
              type: "adminAllOrdersRequest"
            });
            _context3.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].get("".concat(_server.server, "/order/admin-all-orders"), {
              withCredentials: true
            }));

          case 4:
            _ref3 = _context3.sent;
            data = _ref3.data;
            dispatch({
              type: "adminAllOrdersSuccess",
              payload: data.orders
            });
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            dispatch({
              type: "adminAllOrdersFailed",
              payload: _context3.t0.response.data.message
            });

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
};

exports.getAllOrdersOfAdmin = getAllOrdersOfAdmin;