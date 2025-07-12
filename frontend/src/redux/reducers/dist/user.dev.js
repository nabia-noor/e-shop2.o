"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userReducer = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  isAuthenticated: false
};
var userReducer = (0, _toolkit.createReducer)(initialState, function (builder) {
  builder.addCase("LoadUserRequest", function (state) {
    state.loading = true;
  }).addCase("LoadUserSuccess", function (state, action) {
    state.isAuthenticated = true;
    state.loading = false;
    state.user = action.payload;
  }).addCase("LoadUserFail", function (state, action) {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticated = false;
  }).addCase("clearErrors", function (state) {
    state.error = null;
  });
});
exports.userReducer = userReducer;