"use strict";

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"]
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false
  },
  phoneNumber: {
    type: Number
  },
  addresses: [{
    country: {
      type: String
    },
    city: {
      type: String
    },
    address1: {
      type: String
    },
    address2: {
      type: String
    },
    zipCode: {
      type: Number
    },
    addressType: {
      type: String
    }
  }],
  role: {
    type: String,
    "default": "user"
  },
  avatar: {
    public_id: {
      type: String
    },
    url: {
      type: String
    }
  },
  createdAt: {
    type: Date,
    "default": Date.now()
  },
  resetPasswordToken: String,
  resetPasswordTime: Date
}); //  Hash password

userSchema.pre("save", function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!this.isModified("password")) {
            next();
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, 10));

        case 3:
          this.password = _context.sent;

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
}); // jwt token

userSchema.methods.getJwtToken = function () {
  return jwt.sign({
    id: this._id
  }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES
  });
}; // compare password


userSchema.methods.comparePassword = function _callee2(enteredPassword) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(bcrypt.compare(enteredPassword, this.password));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
};

module.exports = mongoose.model("User", userSchema);