"use strict";

var express = require("express");

var ErrorHandler = require("./middleware/error");

var app = express();

var cookieParser = require("cookie-parser");

var bodyParser = require("body-parser");

var cors = require("cors");

var productRoutes = require("./routes/product");

var userRoutes = require("./controller/user"); // Load environment variables if not production


if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env"
  });
} // Middlewares (IMPORTANT: put these BEFORE routes)


app.use(cors({
  origin: "http://localhost:3000",
  // React frontend URL
  credentials: true // Allow cookies/token

}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
  limit: "50mb"
})); // Static files

app.use("/uploads", express["static"]("uploads")); // Routes

app.use("/api/v1/product", productRoutes);
app.use("/api/v1/user", userRoutes); // Error Handling Middleware 

app.use(ErrorHandler);
module.exports = app;