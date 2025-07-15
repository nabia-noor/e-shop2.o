"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.productReducer = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  isLoading: true,
  allProducts: []
};
var productReducer = (0, _toolkit.createReducer)(initialState, function (builder) {
  builder // Create Product
  .addCase("productCreateRequest", function (state) {
    state.isLoading = true;
  }).addCase("productCreateSuccess", function (state, action) {
    state.isLoading = false;
    state.product = action.payload;
    state.success = true;
  }).addCase("productCreateFail", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  }) // Get All Products of Shop
  .addCase("getAllProductsShopRequest", function (state) {
    state.isLoading = true;
  }).addCase("getAllProductsShopSuccess", function (state, action) {
    state.isLoading = false;
    state.products = action.payload;
  }).addCase("getAllProductsShopFailed", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
  }) // Delete Product of Shop
  .addCase("deleteProductRequest", function (state) {
    state.isLoading = true;
  }).addCase("deleteProductSuccess", function (state, action) {
    state.isLoading = false;
    state.message = action.payload;
  }).addCase("deleteProductFailed", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
  }) // Get All Products (Admin)
  .addCase("getAllProductsRequest", function (state) {
    state.isLoading = true;
  }).addCase("getAllProductsSuccess", function (state, action) {
    state.isLoading = false;
    state.allProducts = action.payload;
  }).addCase("getAllProductsFailed", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
  }) // Clear Errors
  .addCase("clearErrors", function (state) {
    state.error = null;
  });
});
exports.productReducer = productReducer;