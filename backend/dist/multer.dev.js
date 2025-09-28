"use strict";

var multer = require("multer");

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function filename(req, file, cb) {
    var uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    var ext = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
  }
});
exports.upload = multer({
  storage: storage
});