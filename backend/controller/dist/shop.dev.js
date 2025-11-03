"use strict";

var express = require("express");

var path = require("path");

var router = express.Router();

var fs = require("fs");

var jwt = require("jsonwebtoken");

var sendMail = require("../utils/sendMail");

var sendToken = require("../utils/jwtToken");

var Shop = require("../models/shop");

var _require = require("../middleware/auth"),
    isAuthenticated = _require.isAuthenticated;

var _require2 = require("../multer"),
    upload = _require2.upload;

var ErrorHandler = require("../utils/ErrorHandler");

var catchAsyncErrors = require("../middleware/catchAsyncErrors"); // ---- CREATE SHOP ----


router.post("/create-shop", upload.single("file"), function _callee(req, res, next) {
  var email, sellerEmail, _filename, filePath, filename, fileUrl, seller, activationToken, activationUrl;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          email = req.body.email;
          _context.next = 4;
          return regeneratorRuntime.awrap(Shop.findOne({
            email: email
          }));

        case 4:
          sellerEmail = _context.sent;

          if (!sellerEmail) {
            _context.next = 10;
            break;
          }

          _filename = req.file.filename;
          filePath = "uploads/".concat(_filename);
          fs.unlink(filePath, function (err) {
            if (err) console.log(err);
          });
          return _context.abrupt("return", next(new ErrorHandler("User already exists", 400)));

        case 10:
          filename = req.file.filename;
          fileUrl = path.join(filename);
          seller = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: fileUrl,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode
          };
          activationToken = createActivationToken(seller);
          activationUrl = "http://localhost:3000/seller/activation/".concat(activationToken);
          _context.prev = 15;
          _context.next = 18;
          return regeneratorRuntime.awrap(sendMail({
            email: seller.email,
            subject: "Activate your Shop",
            message: "Hello ".concat(seller.name, ", please click on the link to activate your Shop: ").concat(activationUrl)
          }));

        case 18:
          res.status(201).json({
            success: true,
            message: "Please check your email (".concat(seller.email, ") to activate your Shop!")
          });
          _context.next = 24;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](15);
          return _context.abrupt("return", next(new ErrorHandler(_context.t0.message, 500)));

        case 24:
          _context.next = 29;
          break;

        case 26:
          _context.prev = 26;
          _context.t1 = _context["catch"](0);
          return _context.abrupt("return", next(new ErrorHandler(_context.t1.message, 400)));

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 26], [15, 21]]);
});

var createActivationToken = function createActivationToken(user) {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "90d"
  });
}; // ----- ACTIVATE SHOP ----


router.post("/shop/activation", catchAsyncErrors(function _callee2(req, res, next) {
  var activation_token, newSeller, name, email, password, avatar, zipCode, address, phoneNumber, seller;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          activation_token = req.body.activation_token;
          newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

          if (newSeller) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new ErrorHandler("Invalid token", 400)));

        case 5:
          name = newSeller.name, email = newSeller.email, password = newSeller.password, avatar = newSeller.avatar, zipCode = newSeller.zipCode, address = newSeller.address, phoneNumber = newSeller.phoneNumber;
          _context2.next = 8;
          return regeneratorRuntime.awrap(Shop.findOne({
            email: email
          }));

        case 8:
          seller = _context2.sent;

          if (!seller) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", next(new ErrorHandler("User already exists", 400)));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(Shop.create({
            name: name,
            email: email,
            password: password,
            zipCode: zipCode,
            address: address,
            phoneNumber: phoneNumber,
            avatar: {
              public_id: "local",
              url: "/uploads/".concat(avatar)
            }
          }));

        case 13:
          seller = _context2.sent;
          sendToken(seller, 201, res);
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
}));
module.exports = router;