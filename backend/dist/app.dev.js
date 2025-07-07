"use strict";

var express = require("express");

var ErrorHandler = require("./utils/ErrorHandler");

var app = express();

var cookieParser = require("cookie-parser");

var bodyParser = require("body-parser");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
})); //config

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env"
  });
} //its for ErrorHandling


app.use(ErrorHandler);
module.exports = app;