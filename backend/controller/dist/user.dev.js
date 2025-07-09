"use strict";

var express = require("express");

var path = require("path");

var _require = require("../multer"),
    upload = _require.upload;

var router = express.Router();

var User = require("../model/user");

var ErrorHandler = require("../utils/ErrorHandler");

var fs = require("fs");

var jwt = require("jsonwebtoken");

var sendMail = require("../utils/sendMail");

var _require2 = require("console"),
    error = _require2.error;

router.post("/create-user", upload.single("file"), function _callee(req, res, next) {
  var _req$body, name, email, password, userEmail, _filename, filePath, filename, fileUrl, user, activationToken, activationUrl;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;
          console.log(name, email);
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          userEmail = _context.sent;

          if (!userEmail) {
            _context.next = 10;
            break;
          }

          _filename = req.file.filename;
          filePath = "uploads/".concat(_filename);
          fs.unlink(filePath, function (err) {
            if (err) {
              console.log(err);
              res.status(500).json({
                message: "Error deleting file"
              });
            } else {
              res.json({
                message: "file deleted successfully"
              });
            }
          });
          return _context.abrupt("return", next(new ErrorHandler("User already exists", 400)));

        case 10:
          filename = req.file.filename;
          fileUrl = path.join(filename);
          user = {
            name: name,
            email: email,
            password: password,
            avatar: fileUrl
          };
          console.log(user);
          activationToken = createActivationToken(user);
          activationUrl = "http://localhost:3000/activation/".concat(activationToken);
          _context.prev = 16;
          _context.next = 19;
          return regeneratorRuntime.awrap(sendMail({
            email: user.email,
            subject: "Activate your account",
            message: "Hello".concat(user.name, ", please click on the link to Activate your account: ").concat(activationUrl)
          }));

        case 19:
          res.status(201).json({
            success: true,
            message: "please check your email:- ".concat(user.email, " to Activate your account!")
          });
          _context.next = 25;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](16);
          return _context.abrupt("return", next(new ErrorHandler(_context.t0.message, 500)));

        case 25:
          _context.prev = 25;
          _context.next = 31;
          break;

        case 28:
          _context.prev = 28;
          _context.t1 = _context["catch"](25);
          return _context.abrupt("return", next(new ErrorHandler(_context.t1.message, 400)));

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[16, 22], [25, 28]]);
}); // create activation token

var createActivationToken = function createActivationToken(user) {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m"
  });
};

module.exports = router;