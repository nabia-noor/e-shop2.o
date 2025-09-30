"use strict";

var express = require("express");

var path = require("path");

var _require = require("../multer"),
    upload = _require.upload;

var router = express.Router();

var User = require("../models/user");

var ErrorHandler = require("../utils/ErrorHandler");

var catchAsyncErrors = require("../middleware/catchAsyncErrors");

var fs = require("fs");

var jwt = require("jsonwebtoken");

var sendMail = require("../utils/sendMail");

var _require2 = require("console"),
    error = _require2.error;

var sendToken = require("../utils/jwtToken");

var _require3 = require("../middleware/auth"),
    isAuthenticated = _require3.isAuthenticated;

router.post("/create-user", upload.single("file"), function _callee(req, res, next) {
  var _req$body, name, email, password, userEmail, _filename, filePath, filename, fileUrl, user, activationToken, activationUrl;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("req.body------------------------->>>", req.body);
          console.log("req.file >>>", req.file);
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;
          console.log(name, email);
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          userEmail = _context.sent;

          if (!userEmail) {
            _context.next = 12;
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
            }
          });
          return _context.abrupt("return", next(new ErrorHandler("User already exists", 400)));

        case 12:
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
          _context.prev = 18;
          _context.next = 21;
          return regeneratorRuntime.awrap(sendMail({
            email: user.email,
            subject: "Activate your account",
            message: "Hello".concat(user.name, ", please click on the link to Activate your account: ").concat(activationUrl)
          }));

        case 21:
          res.status(201).json({
            success: true,
            message: "please check your email:- ".concat(user.email, " to Activate your account!")
          });
          _context.next = 27;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](18);
          return _context.abrupt("return", next(new ErrorHandler(_context.t0.message, 500)));

        case 27:
          _context.prev = 27;
          _context.next = 33;
          break;

        case 30:
          _context.prev = 30;
          _context.t1 = _context["catch"](27);
          return _context.abrupt("return", next(new ErrorHandler(_context.t1.message, 400)));

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[18, 24], [27, 30]]);
});

var createActivationToken = function createActivationToken(user) {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "90d"
  });
}; // activate user


router.post("/activation", catchAsyncErrors(function _callee2(req, res, next) {
  var activation_token, newUser, name, email, password, avatar, user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          activation_token = req.body.activation_token;
          newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

          if (newUser) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new ErrorHandler("Invalid token", 400)));

        case 5:
          name = newUser.name, email = newUser.email, password = newUser.password, avatar = newUser.avatar;
          _context2.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 8:
          user = _context2.sent;

          if (!user) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", next(new ErrorHandler("User already exists", 400)));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(User.create({
            name: name,
            email: email,
            password: password,
            avatar: {
              public_id: "local",
              // temporary id
              url: "/uploads/".concat(avatar) // uploads folder se url banega

            }
          }));

        case 13:
          user = _context2.sent;
          sendToken(user, 201, res);
          _context2.next = 20;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", next(new ErrorHandler(_context2.t0.message, 500)));

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 17]]);
})); //login user

router.post("/login-user", catchAsyncErrors(function _callee3(req, res, next) {
  var _req$body2, email, password, user, isPasswordValid;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("req.body", req.body);
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

          if (!(!email || !password)) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next(new ErrorHandler("Please provide the all fields!", 400)));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }).select("+password"));

        case 7:
          user = _context3.sent;

          if (user) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", next(new ErrorHandler("User doesn't exists!", 400)));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(user.comparePassword(password));

        case 12:
          isPasswordValid = _context3.sent;

          if (isPasswordValid) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", next(new ErrorHandler("Please provide the correct information", 400)));

        case 15:
          sendToken(user, 201, res);
          _context3.next = 21;
          break;

        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", next(new ErrorHandler(_context3.t0.message, 500)));

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 18]]);
})); //load user

router.get("/getuser", isAuthenticated, catchAsyncErrors(function _callee4(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 3:
          user = _context4.sent;

          if (user) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", next(new ErrorHandler("User doesn't exists", 400)));

        case 6:
          res.status(200).json({
            success: true,
            user: user
          });
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", next(new ErrorHandler(_context4.t0.message, 500)));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}));
module.exports = router;