"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orderReducer = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  isLoading: true
};
var orderReducer = (0, _toolkit.createReducer)(initialState, function (builder) {
  builder // Get all orders of user
  .addCase("getAllOrdersUserRequest", function (state) {
    state.isLoading = true;
  }).addCase("getAllOrdersUserSuccess", function (state, action) {
    state.isLoading = false;
    state.orders = action.payload;
  }).addCase("getAllOrdersUserFailed", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
  }) // Get all orders of shop
  .addCase("getAllOrdersShopRequest", function (state) {
    state.isLoading = true;
  }).addCase("getAllOrdersShopSuccess", function (state, action) {
    state.isLoading = false;
    state.orders = action.payload;
  }).addCase("getAllOrdersShopFailed", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
  }) // Get all orders for admin
  .addCase("adminAllOrdersRequest", function (state) {
    state.adminOrderLoading = true;
  }).addCase("adminAllOrdersSuccess", function (state, action) {
    state.adminOrderLoading = false;
    state.adminOrders = action.payload;
  }).addCase("adminAllOrdersFailed", function (state, action) {
    state.adminOrderLoading = false;
    state.error = action.payload;
  }) // Clear errors
  .addCase("clearErrors", function (state) {
    state.error = null;
  });
});
exports.orderReducer = orderReducer;