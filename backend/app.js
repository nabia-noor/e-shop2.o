const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./controller/user");
const shopRoutes = require("./controller/shop");
const productRoutes = require('./controller/product');
const eventRoutes = require('./controller/event');
const couponRoutes = require('./controller/coupounCode');

// Load environment variables if not production
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: ".env",
  });
}

// Middlewares (IMPORTANT: put these BEFORE routes)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/shop", shopRoutes);
app.use("/api/v1/event", eventRoutes);
app.use("/api/v1/coupon", couponRoutes);

// Error Handling Middleware
app.use(ErrorHandler);

module.exports = app;
