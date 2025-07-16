"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadUser = void 0;

var _axios = _interopRequireDefault(require("../../axios"));

var _server = require("../../server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//load user
var loadUser = function loadUser() {
  return function _callee(dispatch) {
    var _ref, data;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            dispatch({
              type: "LoadUserRequest"
            });
            _context.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].get("".concat(_server.server, "/user/getuser"), {
              withCredentials: true
            }));

          case 4:
            _ref = _context.sent;
            data = _ref.data;
            dispatch({
              type: "LoadUserSuccess",
              payload: data.user
            });
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            dispatch({
              type: "LoadUserFail",
              payload: _context.t0.response.data.message
            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
};

exports.loadUser = loadUser;