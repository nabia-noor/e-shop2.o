"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logoutUser = exports.registerUser = exports.loginUser = exports.loadUser = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Load user
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
            return regeneratorRuntime.awrap(_axios["default"].get("http://localhost:8000/api/v2/user/getuser", {
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
}; // User login


exports.loadUser = loadUser;

var loginUser = function loginUser(email, password) {
  return function _callee2(dispatch) {
    var _ref2, data;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            dispatch({
              type: "LoginRequest"
            });
            _context2.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].post("http://localhost:8000/api/v2/user/login-user", {
              email: email,
              password: password
            }, {
              headers: {
                "Content-Type": "application/json"
              },
              withCredentials: true
            }));

          case 4:
            _ref2 = _context2.sent;
            data = _ref2.data;
            dispatch({
              type: "LoginSuccess",
              payload: data.user
            });
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            dispatch({
              type: "LoginFail",
              payload: _context2.t0.response.data.message
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
}; // User register


exports.loginUser = loginUser;

var registerUser = function registerUser(user) {
  return function _callee3(dispatch) {
    var _ref3, data;

    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            dispatch({
              type: "RegisterUserRequest"
            });
            _context3.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].post("http://localhost:8000/api/v2/user/create-user", user, {
              headers: {
                "Content-Type": "application/json"
              },
              withCredentials: true
            }));

          case 4:
            _ref3 = _context3.sent;
            data = _ref3.data;
            dispatch({
              type: "RegisterUserSuccess",
              payload: data.message
            });
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            dispatch({
              type: "RegisterUserFail",
              payload: _context3.t0.response.data.message
            });

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
}; // User logout


exports.registerUser = registerUser;

var logoutUser = function logoutUser() {
  return function _callee4(dispatch) {
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return regeneratorRuntime.awrap(_axios["default"].get("http://localhost:8000/api/v2/user/logout", {
              withCredentials: true
            }));

          case 3:
            dispatch({
              type: "LogoutSuccess"
            });
            _context4.next = 9;
            break;

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](0);
            dispatch({
              type: "LogoutFail",
              payload: _context4.t0.response.data.message
            });

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 6]]);
  };
};

exports.logoutUser = logoutUser;