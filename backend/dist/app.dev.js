"use strict";

var express = require("express");

var ErrorHandler = require("./middleware/error");

var app = express();

var cookieParser = require("cookie-parser");

var bodyParser = require("body-parser");

var cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/", express["static"]("uploads"));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: "50mb"
})); //config

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env"
  });
} // imports routes


var user = require("./controller/user");

app.use("/api/v2/user", user); //its for ErrorHandling

app.use(ErrorHandler);
module.exports = app;