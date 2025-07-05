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
  builder // Load user
  .addCase("LoadUserRequest", function (state) {
    state.loading = true;
  }).addCase("LoadUserSuccess", function (state, action) {
    state.isAuthenticated = true;
    state.loading = false;
    state.user = action.payload;
  }).addCase("LoadUserFail", function (state, action) {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticated = false;
  }) // Update user info
  .addCase("updateUserInfoRequest", function (state) {
    state.loading = true;
  }).addCase("updateUserInfoSuccess", function (state, action) {
    state.loading = false;
    state.user = action.payload;
  }).addCase("updateUserInfoFailed", function (state, action) {
    state.loading = false;
    state.error = action.payload;
  }) // Update address
  .addCase("updateUserAddressRequest", function (state) {
    state.addressloading = true;
  }).addCase("updateUserAddressSuccess", function (state, action) {
    state.addressloading = false;
    state.successMessage = action.payload.successMessage;
    state.user = action.payload.user;
  }).addCase("updateUserAddressFailed", function (state, action) {
    state.addressloading = false;
    state.error = action.payload;
  }) // Delete address
  .addCase("deleteUserAddressRequest", function (state) {
    state.addressloading = true;
  }).addCase("deleteUserAddressSuccess", function (state, action) {
    state.addressloading = false;
    state.successMessage = action.payload.successMessage;
    state.user = action.payload.user;
  }).addCase("deleteUserAddressFailed", function (state, action) {
    state.addressloading = false;
    state.error = action.payload;
  }) // Get all users (admin)
  .addCase("getAllUsersRequest", function (state) {
    state.usersLoading = true;
  }).addCase("getAllUsersSuccess", function (state, action) {
    state.usersLoading = false;
    state.users = action.payload;
  }).addCase("getAllUsersFailed", function (state, action) {
    state.usersLoading = false;
    state.error = action.payload;
  }) // Clear
  .addCase("clearErrors", function (state) {
    state.error = null;
  }).addCase("clearMessages", function (state) {
    state.successMessage = null;
  });
});
exports.userReducer = userReducer;