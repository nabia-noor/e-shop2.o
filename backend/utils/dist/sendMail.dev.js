"use strict";

var nodemailer = require("nodemailer");

var sendMail = function sendMail(options) {
  var transporter, mailOptions;
  return regeneratorRuntime.async(function sendMail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            auth: {
              user: process.env.SMTP_MAIL,
              pass: process.env.SMTP_PASSWORD
            }
          });
          mailOptions = {
            from: process.env.SMTP_MAIL,
            to: options.email,
            subject: options.subject,
            text: options.message
          };
          _context.next = 4;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = sendMail;