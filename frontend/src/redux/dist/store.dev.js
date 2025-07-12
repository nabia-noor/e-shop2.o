"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _user = require("./reducers/user");

var Store = (0, _toolkit.configureStore)({
  reducer: {
    user: _user.userReducer
  }
});
var _default = Store;
exports["default"] = _default;