"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllSellers = void 0;

var _axios = _interopRequireDefault(require("../../axios"));

var _server = require("../../server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// get all sellers --- admin
var getAllSellers = function getAllSellers() {
  return function _callee(dispatch) {
    var _ref, data;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            dispatch({
              type: "getAllSellersRequest"
            });
            _context.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].get("".concat(_server.server, "/shop/admin-all-sellers"), {
              withCredentials: true
            }));

          case 4:
            _ref = _context.sent;
            data = _ref.data;
            dispatch({
              type: "getAllSellersSuccess",
              payload: data.sellers
            });
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            dispatch({
              type: "getAllSellerFailed" //   payload: error.response.data.message,

            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
};

exports.getAllSellers = getAllSellers;