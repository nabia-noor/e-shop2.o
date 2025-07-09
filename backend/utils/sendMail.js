const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  try {
    // Log SMTP configuration (excluding password)
    console.log("SMTP Configuration:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        // password hidden for security
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      // SSL/TLS configuration
      secure: true, // use TLS
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
      // Enable debug logging
      debug: true,
      logger: true,
    });

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // Verify SMTP connection configuration
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.response);
    return result;
  } catch (error) {
    console.error("Email sending failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack,
    });
    throw error; // Re-throw to handle it in the calling function
  }
};

module.exports = sendMail;
