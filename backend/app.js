const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const productRoutes = require("./routes/product");
const userRoutes = require("./controller/user");

// Load environment variables if not production
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

// Middlewares (IMPORTANT: put these BEFORE routes)
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend URL
    credentials: true, // Allow cookies/token
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Static files
app.use("/", express.static("uploads"));

// Routes
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/user", userRoutes);

// Error Handling Middleware (keep this last)
app.use(ErrorHandler);

module.exports = app;
