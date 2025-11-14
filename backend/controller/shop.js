const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const { sendSellerToken } = require("../utils/jwtToken");
const Shop = require("../models/shop");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Helper function for creating activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "90d",
  });
};

// ---- CREATE SHOP ----
router.post("/create-shop", upload.single("file"), catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, name, password, address, phoneNumber, zipCode } = req.body;

    // Validate required fields
    if (!email || !name || !password || !address || !phoneNumber || !zipCode) {
      return next(new ErrorHandler("Please fill in all required fields", 400));
    }

    // Check if file is uploaded
    if (!req.file) {
      return next(new ErrorHandler("Please upload a shop avatar", 400));
    }

    // Check if seller already exists
    const sellerEmail = await Shop.findOne({ email });
    if (sellerEmail) {
      // Clean up uploaded file
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) console.log("Error deleting file:", err);
      });
      return next(new ErrorHandler("Shop with this email already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const seller = {
      name,
      email,
      password,
      avatar: fileUrl,
      address,
      phoneNumber: parseInt(phoneNumber),
      zipCode: parseInt(zipCode),
    };

    const activationToken = createActivationToken(seller);
    const activationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your Shop",
        message: `Hello ${seller.name}, please click on the link to activate your Shop: ${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email (${seller.email}) to activate your Shop!`,
      });
    } catch (error) {
      console.error("Email sending error:", error);
      // Clean up uploaded file if email fails
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) console.log("Error deleting file:", err);
      });
      return next(new ErrorHandler("Failed to send activation email. Please try again.", 500));
    }
  } catch (error) {
    console.error("Shop creation error:", error);
    return next(new ErrorHandler(error.message, 400));
  }
}));

// ----- ACTIVATE SHOP ----
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { name, email, password, avatar, zipCode, address, phoneNumber } =
        newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        password,
        zipCode,
        address,
        phoneNumber,
        avatar: {
          public_id: "local",
          url: `/uploads/${avatar}`,
        },
      });

      sendSellerToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("req.body", req.body);
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendSellerToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//load shop (seller)
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller.id);
      if (!seller) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }
      res.status(200).json({ success: true, seller });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// ----- LOGOUT SHOP (SELLER) -----
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const isProduction = process.env.NODE_ENV === "PRODUCTION" || process.env.NODE_ENV === "production";
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: isProduction ? true : false,
      });

      res.status(200).json({ success: true, message: "Seller logged out" });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }
      res.status(200).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);




module.exports = router;
