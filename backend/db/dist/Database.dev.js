"use strict";

var mongoose = require("mongoose");

var connectDatabase = function connectDatabase() {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(function (data) {
    console.log("mongod connected with server: ".concat(data.connection.host));
  });
};

module.exports = connectDatabase;