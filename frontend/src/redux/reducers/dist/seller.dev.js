"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sellerReducer = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  isLoading: false,
  isSeller: false,
  seller: null,
  sellers: [],
  error: null
};
var sellerReducer = (0, _toolkit.createReducer)(initialState, function (builder) {
  builder // Single seller load actions
  .addCase("LoadSellerRequest", function (state) {
    state.isLoading = true;
  }).addCase("LoadSellerSuccess", function (state, action) {
    state.isLoading = false;
    state.isSeller = true;
    state.seller = action.payload;
    state.error = null;
  }).addCase("LoadSellerFail", function (state, action) {
    state.isLoading = false;
    state.isSeller = false;
    state.error = action.payload;
  }) // All sellers for admin
  .addCase("getAllSellersRequest", function (state) {
    state.isLoading = true;
  }).addCase("getAllSellersSuccess", function (state, action) {
    state.isLoading = false;
    state.sellers = action.payload;
    state.error = null;
  }).addCase("getAllSellerFailed", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
  }) // Clear errors
  .addCase("clearErrors", function (state) {
    state.error = null;
  });
});
exports.sellerReducer = sellerReducer;