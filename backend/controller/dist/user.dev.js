"use strict";

var express = require("express");

var path = require("path");

var _require = require("../multer"),
    upload = _require.upload;

var router = express.Router();

var User = require("../model/user");

router.post("/create-user", upload.single("file"), function _callee(req, res, next) {
  var _req$body, name, email, password, userEmail, filename, fileUrl, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;
          _context.next = 3;
          return regeneratorRuntime.awrap(user.findOne({
            email: email
          }));

        case 3:
          userEmail = _context.sent;

          if (!userEmail) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", next(new ErrorHandler("User already exists", 400)));

        case 6:
          filename = req.file.filename;
          fileUrl = path.join(filename);
          user = {
            name: name,
            email: email,
            password: password
          };

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
});