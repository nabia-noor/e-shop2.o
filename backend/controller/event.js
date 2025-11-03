const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../models/shop");
const Event = require("../models/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const { upload } = require("../multer");


// create event
router.post(
    "/create-event",
    isSeller,
    upload.array("images"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const shopId = req.body.shopId || (req.seller && req.seller._id);

            if (!shopId) {
                return next(new ErrorHandler("Shop Id is required!", 400));
            }

            const shop = await Shop.findById(shopId);
            if (!shop) {
                return next(new ErrorHandler("Shop Id is invalid!", 400));
            }

            // Verify that the authenticated seller owns this shop
            if (req.seller && req.seller._id.toString() !== shopId.toString()) {
                return next(new ErrorHandler("You can only create events for your own shop!", 403));
            }

            const files = req.files;
            if (!files || files.length === 0) {
                return next(new ErrorHandler("Please upload at least one event image", 400));
            }

            const imageUrls = files.map((file) => ({
                public_id: "local",
                url: `/uploads/${file.filename}`
            }));

            const eventData = req.body;
            eventData.images = imageUrls;
            eventData.shop = shop;
            eventData.shopId = shop._id.toString();

            const event = await Event.create(eventData);

            res.status(201).json({
                success: true,
                event,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message || "Event creation failed", 400));
        }
    })
);

// get all events
router.get("/get-all-events", catchAsyncErrors(async (req, res, next) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            events,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || "Failed to get events", 400));
    }
}));

// get all events of a shop
router.get(
    "/get-all-events/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const events = await Event.find({ shopId: req.params.id });

            res.status(200).json({
                success: true,
                events,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message || "Failed to get events", 400));
        }
    })
);

// delete event of a shop
router.delete(
    "/delete-shop-event/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const event = await Event.findById(req.params.id);

            if (!event) {
                return next(new ErrorHandler("Event is not found with this id", 404));
            }

            // Verify that the authenticated seller owns this event
            if (req.seller && req.seller._id.toString() !== event.shopId.toString()) {
                return next(new ErrorHandler("You can only delete events from your own shop!", 403));
            }

            await Event.findByIdAndDelete(req.params.id);

            res.status(200).json({
                success: true,
                message: "Event Deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message || "Failed to delete event", 400));
        }
    })
);

// all events --- for admin
router.get(
    "/admin-all-events",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const events = await Event.find().sort({
                createdAt: -1,
            });
            res.status(200).json({
                success: true,
                events,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message || "Failed to get events", 500));
        }
    })
);

module.exports = router;