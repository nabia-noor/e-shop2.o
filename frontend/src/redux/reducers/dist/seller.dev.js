"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sellerReducer = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  isLoading: true
};
var sellerReducer = (0, _toolkit.createReducer)(initialState, function (builder) {
  builder // Load seller
  .addCase("LoadSellerRequest", function (state) {
    state.isLoading = true;
  }).addCase("LoadSellerSuccess", function (state, action) {
    state.isSeller = true;
    state.isLoading = false;
    state.seller = action.payload;
  }).addCase("LoadSellerFail", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
    state.isSeller = false;
  }) // Get all sellers (admin)
  .addCase("getAllSellersRequest", function (state) {
    state.isLoading = true;
  }).addCase("getAllSellersSuccess", function (state, action) {
    state.isLoading = false;
    state.sellers = action.payload;
  }).addCase("getAllSellerFailed", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
  }) // Clear errors
  .addCase("clearErrors", function (state) {
    state.error = null;
  });
});
exports.sellerReducer = sellerReducer;