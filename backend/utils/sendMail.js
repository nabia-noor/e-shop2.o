const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  try {
    const env = process.env.NODE_ENV || "development";

    // Allow either a well-known service OR host/port
    const hasService = !!process.env.SMTP_SERVICE;
    const hasHostPort = !!process.env.SMTP_HOST && !!process.env.SMTP_PORT;

    if (!hasService && !hasHostPort) {
      throw new Error(
        "SMTP configuration invalid. Provide SMTP_SERVICE or SMTP_HOST and SMTP_PORT"
      );
    }

    if (!process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD) {
      throw new Error(
        "Missing SMTP_MAIL or SMTP_PASSWORD. Check your backend/config/.env"
      );
    }

    const smtpPort = Number(process.env.SMTP_PORT || 0);
    const secure = smtpPort === 465 || process.env.SMTP_SECURE === "true";

    const transportConfig = hasService
      ? {
        service: process.env.SMTP_SERVICE,
        auth: { user: process.env.SMTP_MAIL, pass: process.env.SMTP_PASSWORD },
      }
      : {
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure,
        auth: { user: process.env.SMTP_MAIL, pass: process.env.SMTP_PASSWORD },
      };

    // Be tolerant in development environments
    if (env !== "production") {
      transportConfig.tls = { rejectUnauthorized: false };
    }

    const transporter = nodemailer.createTransport(transportConfig);

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // Only verify in production to avoid local blocking
    if (env === "production") {
      await transporter.verify();
    }

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Email sending failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack,
    });
    throw error;
  }
};

module.exports = sendMail;
