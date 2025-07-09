"use strict";

var nodemailer = require("nodemailer");

var sendMail = function sendMail(options) {
  var transporter, mailOptions, result;
  return regeneratorRuntime.async(function sendMail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Log SMTP configuration (excluding password)
          console.log("SMTP Configuration:", {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            auth: {
              user: process.env.SMTP_MAIL // password hidden for security

            }
          });
          transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            auth: {
              user: process.env.SMTP_MAIL,
              pass: process.env.SMTP_PASSWORD
            },
            // SSL/TLS configuration
            secure: true,
            // use TLS
            tls: {
              // do not fail on invalid certs
              rejectUnauthorized: false
            },
            // Enable debug logging
            debug: true,
            logger: true
          });
          mailOptions = {
            from: process.env.SMTP_MAIL,
            to: options.email,
            subject: options.subject,
            text: options.message
          }; // Verify SMTP connection configuration

          _context.next = 6;
          return regeneratorRuntime.awrap(transporter.verify());

        case 6:
          console.log("SMTP connection verified successfully");
          _context.next = 9;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 9:
          result = _context.sent;
          console.log("Email sent successfully:", result.response);
          return _context.abrupt("return", result);

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error("Email sending failed:", {
            message: _context.t0.message,
            code: _context.t0.code,
            command: _context.t0.command,
            stack: _context.t0.stack
          });
          throw _context.t0;

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

module.exports = sendMail;