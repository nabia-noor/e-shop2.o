const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../models/product");
const Shop = require("../models/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");

// create product
router.post(
    "/create-product",
    isSeller,
    upload.array("images"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            // Get shopId from body or from authenticated seller
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
                return next(new ErrorHandler("You can only create products for your own shop!", 403));
            }

            const files = req.files;
            if (!files || files.length === 0) {
                return next(new ErrorHandler("Please upload at least one product image", 400));
            }

            // Upload images to Cloudinary
            const imageUrls = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const result = await cloudinary.uploader.upload(file.buffer, {
                    folder: "products",
                    resource_type: "auto",
                });

                imageUrls.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            const productData = req.body;
            productData.images = imageUrls;
            productData.shop = shop;
            productData.shopId = shop._id.toString();

            const product = await Product.create(productData);

            res.status(201).json({
                success: true,
                product,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message || "Product creation failed", 400));
        }
    })
);

// get all products of a shop
router.get(
    "/get-all-products-shop/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.find({ shopId: req.params.id });

            res.status(200).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message || "Failed to get products", 400));
        }
    })
);

// delete product of a shop
router.delete(
    "/delete-shop-product/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const product = await Product.findById(req.params.id);

            if (!product) {
                return next(new ErrorHandler("Product is not found with this id", 404));
            }

            // Verify that the authenticated seller owns this product
            if (req.seller && req.seller._id.toString() !== product.shopId.toString()) {
                return next(new ErrorHandler("You can only delete products from your own shop!", 403));
            }

            // Delete images from Cloudinary if they exist
            if (product.images && product.images.length > 0) {
                for (let i = 0; i < product.images.length; i++) {
                    const image = product.images[i];
                    if (image.public_id && image.public_id !== "local") {
                        try {
                            await cloudinary.uploader.destroy(image.public_id);
                        } catch (error) {
                            console.error(`Error deleting image ${image.public_id}:`, error);
                            // Continue with deletion even if cloudinary delete fails
                        }
                    }
                }
            }

            await Product.findByIdAndDelete(req.params.id);

            res.status(200).json({
                success: true,
                message: "Product Deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message || "Failed to delete product", 400));
        }
    })
);

// get all products
router.get(
    "/get-all-products",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.find().sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message || "Failed to get products", 400));
        }
    })
);

// review for a product
router.put(
    "/create-new-review",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { user, rating, comment, productId, orderId } = req.body;

            const product = await Product.findById(productId);

            const review = {
                user,
                rating,
                comment,
                productId,
            };

            const isReviewed = product.reviews.find(
                (rev) => rev.user._id && rev.user._id.toString() === req.user._id.toString()
            );

            if (isReviewed) {
                product.reviews.forEach((rev) => {
                    if (rev.user._id && rev.user._id.toString() === req.user._id.toString()) {
                        rev.rating = rating;
                        rev.comment = comment;
                        rev.user = user;
                    }
                });
            } else {
                product.reviews.push(review);
            }

            let avg = 0;

            product.reviews.forEach((rev) => {
                avg += rev.rating;
            });

            product.ratings = avg / product.reviews.length;

            await product.save({ validateBeforeSave: false });

            // Optional: Update order if Order model exists
            // Uncomment if you have Order model
            // const Order = require("../models/order");
            // if (orderId) {
            //     await Order.findByIdAndUpdate(
            //         orderId,
            //         { $set: { "cart.$[elem].isReviewed": true } },
            //         { arrayFilters: [{ "elem._id": productId }], new: true }
            //     );
            // }

            res.status(200).json({
                success: true,
                message: "Reviewed successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message || "Failed to create review", 400));
        }
    })
);

// all products --- for admin
router.get(
    "/admin-all-products",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.find().sort({
                createdAt: -1,
            });
            res.status(200).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message || "Failed to get products", 500));
        }
    })
);
module.exports = router;