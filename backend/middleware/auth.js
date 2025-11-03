const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken")
const User = require("../models/user");
const Shop = require("../models/shop");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    // Check multiple possible cookie names and locations
    const token = req.cookies?.token || req.headers?.authorization?.replace('Bearer ', '') || req.cookies?.access_token;

    console.log("Auth check - Cookies:", req.cookies);
    console.log("Auth check - Token found:", !!token);

    if (!token) {
        console.log("No token found in request");
        return next(new ErrorHandler("please login to continue", 401));
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set in environment variables");
            return next(new ErrorHandler("Server configuration error", 500));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded successfully:", decoded);

        if (!decoded || !decoded.id) {
            console.log("Invalid decoded token structure");
            return next(new ErrorHandler("Invalid token", 401));
        }

        const user = await User.findById(decoded.id);
        console.log("User found:", !!user);

        if (!user) {
            console.log("User not found in database");
            return next(new ErrorHandler("User not found", 401));
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error.name, error.message);
        if (error.name === 'JsonWebTokenError') {
            return next(new ErrorHandler("Invalid token", 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new ErrorHandler("Token expired, please login again", 401));
        }
        return next(new ErrorHandler(error.message || "Authentication failed", 401));
    }
})

// Shop authentication middleware
exports.isSeller = catchAsyncErrors(async (req, res, next) => {
    const { seller_token } = req.cookies;

    if (!seller_token) {
        return next(new ErrorHandler("please login to continue", 401));
    }

    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET);

    req.seller = await Shop.findById(decoded.id);

    next();
})

// Admin authentication middleware
exports.isAdmin = (role = "Admin") => {
    return catchAsyncErrors(async (req, res, next) => {
        if (!req.user) {
            return next(new ErrorHandler("Please login to access this resource", 401));
        }

        if (req.user.role !== role && req.user.role !== role.toLowerCase()) {
            return next(new ErrorHandler(`Access denied. ${role} role required.`, 403));
        }

        next();
    });
}

