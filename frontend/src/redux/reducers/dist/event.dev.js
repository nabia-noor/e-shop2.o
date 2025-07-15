"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventReducer = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  isLoading: true
};
var eventReducer = (0, _toolkit.createReducer)(initialState, function (builder) {
  builder // ───────── Create Event ─────────
  .addCase("eventCreateRequest", function (state) {
    state.isLoading = true;
  }).addCase("eventCreateSuccess", function (state, action) {
    state.isLoading = false;
    state.event = action.payload;
    state.success = true;
  }).addCase("eventCreateFail", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  }) // ───────── Get All Events of Shop ─────────
  .addCase("getAlleventsShopRequest", function (state) {
    state.isLoading = true;
  }).addCase("getAlleventsShopSuccess", function (state, action) {
    state.isLoading = false;
    state.events = action.payload;
  }).addCase("getAlleventsShopFailed", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
  }) // ───────── Delete Event of Shop ─────────
  .addCase("deleteeventRequest", function (state) {
    state.isLoading = true;
  }).addCase("deleteeventSuccess", function (state, action) {
    state.isLoading = false;
    state.message = action.payload;
  }).addCase("deleteeventFailed", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
  }) // ───────── Get All Events (Admin) ─────────
  .addCase("getAlleventsRequest", function (state) {
    state.isLoading = true;
  }).addCase("getAlleventsSuccess", function (state, action) {
    state.isLoading = false;
    state.allEvents = action.payload;
  }).addCase("getAlleventsFailed", function (state, action) {
    state.isLoading = false;
    state.error = action.payload;
  }) // ───────── Clear Errors ─────────
  .addCase("clearErrors", function (state) {
    state.error = null;
  });
});
exports.eventReducer = eventReducer;