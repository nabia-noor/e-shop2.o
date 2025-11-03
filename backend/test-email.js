const nodemailer = require("nodemailer");
require("dotenv").config({ path: "config/.env" });

console.log("Testing Email Configuration...");
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_SERVICE:", process.env.SMTP_SERVICE);
console.log("SMTP_MAIL:", process.env.SMTP_MAIL);
console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "SET" : "NOT SET");

if (!process.env.SMTP_HOST || !process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD) {
    console.error("❌ Missing required environment variables!");
    console.log("Please check your .env file in backend/config/");
    process.exit(1);
}

async function testEmail() {
    try {
        const transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            secure: true,
            tls: {
                rejectUnauthorized: false,
            },
        });

        console.log("🔍 Verifying SMTP connection...");
        await transporter.verify();
        console.log("✅ SMTP connection verified successfully!");

        console.log("📧 Sending test email...");
        const result = await transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: process.env.SMTP_MAIL, // Send to yourself
            subject: "Test Email from E-shop",
            text: "This is a test email to verify your SMTP configuration is working correctly.",
        });

        console.log("✅ Test email sent successfully!");
        console.log("Message ID:", result.messageId);

    } catch (error) {
        console.error("❌ Email test failed:");
        console.error("Error:", error.message);
        console.error("Code:", error.code);

        if (error.code === "EAUTH") {
            console.log("\n💡 Authentication failed. Please check:");
            console.log("1. Your email address is correct");
            console.log("2. You're using an App Password (not your regular password)");
            console.log("3. 2-Factor Authentication is enabled on your Gmail account");
        }
    }
}

testEmail();
