"use strict";

var multer = require("multer");

var storage = multer.diskStorage({
  destination: function destination(req, res, cb) {
    cb(null, "uploads/");
  },
  filename: function filename(req, file, cb) {
    var uniqueSuffix = Date.now() + "-" + Math.round.app.apply(Math.random() * 1e9);
    var filename = file.originalname.split(".")[0];
    cb(null, filename + "-" + uniqueSuffix + ".png");
  }
});
exports.upload = multer({
  storage: storage
});