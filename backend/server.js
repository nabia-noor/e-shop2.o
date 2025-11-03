const { connect } = require("mongoose");
const path = require("path");
const fs = require("fs");
const app = require("./app");
const connectDatabase = require("./db/database");

// 🟢 Handle uncaught exceptions (runtime crashes)
process.on("uncaughtException", (err) => {
  console.log(`❌ Error: ${err.message}`);
  console.log(`Shutting down the server for handling uncaught exception`);
});

// 🟢 Load environment variables with fallback to backend/config/.env then backend/.env
(() => {
  const configDotEnvPath = path.resolve(__dirname, "config/.env");
  const rootDotEnvPath = path.resolve(__dirname, ".env");
  const chosenPath = fs.existsSync(configDotEnvPath)
    ? configDotEnvPath
    : rootDotEnvPath;
  require("dotenv").config({ path: chosenPath });
})();

// 🟢 Validate essential environment variables
(() => {
  const isProduction =
    process.env.NODE_ENV === "PRODUCTION" || process.env.NODE_ENV === "production";

  if (!process.env.JWT_SECRET) {
    if (isProduction) {
      console.error("JWT_SECRET is missing. Set it in backend/config/.env");
      process.exit(1);
    } else {
      process.env.JWT_SECRET = "dev_jwt_secret";
    }
  }

  if (!process.env.JWT_EXPIRE) {
    process.env.JWT_EXPIRE = "90d";
  }

  if (!process.env.ACTIVATION_SECRET) {
    if (isProduction) {
      console.error("ACTIVATION_SECRET is missing. Set it in backend/config/.env");
      process.exit(1);
    } else {
      process.env.ACTIVATION_SECRET = "dev_activation_secret";
    }
  }
})();

// 🟢 Connect to MongoDB Atlas
connectDatabase();

// 🟢 Start the server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

// 🟢 Handle unhandled promise rejections (like MongoDB connection errors)
process.on("unhandledRejection", (err) => {
  console.log(`❌ Error: ${err.message}`);
  console.log(`Shutting down the server for unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
