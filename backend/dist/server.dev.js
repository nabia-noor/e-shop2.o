"use strict";

var _require = require("mongoose"),
    connect = _require.connect;

var app = require("./app");

var connectDatabase = require("./db/database"); // handling uncaught Exception


process.on("uncaughtException", function (err) {
  console.log("Error:$(err.message)");
  console.log("shutting down the server for handling uncaught exception");
}); //config

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env"
  });
} //connect db


connectDatabase(); // create server

var server = app.listen(process.env.PORT, function () {
  console.log("Server is running on http://localhost:".concat(process.env.PORT));
}); // unhandled promise rejection

process.on("unhandledRejection", function (err) {
  console.log("shutting down the server for ".concat(err.message));
  console.log("shutting down the server for unhandled promise rejection");
  server.close(function () {
    process.exit(1);
  });
});