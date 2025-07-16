"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var instance = _axios["default"].create({
  baseURL: "http://localhost:8000/api/v1",
  // ✅ Backend ka base URL
  withCredentials: true // agar cookies/token use ho raha

});

var _default = instance;
exports["default"] = _default;