const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

// Initialize Stripe only if secret key exists
const stripe = process.env.STRIPE_SECRET_KEY
    ? require("stripe")(process.env.STRIPE_SECRET_KEY)
    : null;

router.post(
    "/process",
    catchAsyncErrors(async (req, res, next) => {
        if (!stripe) {
            return next(new ErrorHandler("Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.", 500));
        }

        if (!req.body.amount) {
            return next(new ErrorHandler("Amount is required", 400));
        }

        try {
            const myPayment = await stripe.paymentIntents.create({
                amount: req.body.amount,
                currency: "inr",
                metadata: {
                    company: "Becodemy",
                },
            });
            res.status(200).json({
                success: true,
                client_secret: myPayment.client_secret,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message || "Payment processing failed", 500));
        }
    })
);

router.get(
    "/stripeapikey",
    catchAsyncErrors(async (req, res, next) => {
        const stripeApiKey = process.env.STRIPE_API_KEY || process.env.STRIPE_PUBLISHABLE_KEY || "";

        if (!stripeApiKey) {
            console.warn("STRIPE_API_KEY is not set in environment variables");
        }

        res.status(200).json({
            stripeApikey: stripeApiKey
        });
    })
);


module.exports = router;