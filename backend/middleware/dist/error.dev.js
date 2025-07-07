"use strict";

var ErrorHandler = require("../utils/ErrorHandler");

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error"; //wrong mongodb id error

  if (err.name === "CastError") {
    var message = "Resources not found with this id.. Invalid ".concat(err.path);
    err = new ErrorHandler(message, 400);
  } // Duplicate key error


  if (err.code === 1100) {
    var _message = "Duplicate key ".concat(Object.keys(err.keyValue), " Entered");

    err = new ErrorHandler(_message, 400);
  } // wrong jwt error


  if (err.name === "JsonWebTokenError") {
    var _message2 = "Your url is invalid please try again letter";
    err = new ErrorHandler(_message2, 400);
  } // jwt expired


  if (err.name === "TokenExpiredError") {
    var _message3 = "Your Url is expired please try again letter!";
    err = new ErrorHandler(_message3, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};