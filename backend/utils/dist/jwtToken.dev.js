"use strict";

// create token and saving that in cookies
var sendToken = function sendToken(user, statusCode, res) {
  var token = user.getJwtToken(); // Options for cookies

  var options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user: user,
    token: token
  });
};

module.exports = sendToken;