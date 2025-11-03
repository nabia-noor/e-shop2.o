// create token and saving that in cookies
const sendShopToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    const isProduction = process.env.NODE_ENV === "PRODUCTION" || process.env.NODE_ENV === "production";

    // Options for cookies
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // Cross-site XHR from http://localhost:3000 -> http://localhost:8000 requires SameSite:"none"
        // Browsers generally require Secure with SameSite None, but localhost is typically exempt
        sameSite: isProduction ? "none" : "none",
        secure: isProduction ? true : false,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};

// create seller token and saving that in cookies
const sendSellerToken = (seller, statusCode, res) => {
    const token = seller.getJwtToken();

    const isProduction = process.env.NODE_ENV === "PRODUCTION" || process.env.NODE_ENV === "production";

    // Options for cookies
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // Cross-site XHR from http://localhost:3000 -> http://localhost:8000 requires SameSite:"none"
        // Browsers generally require Secure with SameSite None, but localhost is typically exempt
        sameSite: isProduction ? "none" : "none",
        secure: isProduction ? true : false,
    };

    res.status(statusCode).cookie("seller_token", token, options).json({
        success: true,
        seller,
        token,
    });
};

module.exports = sendShopToken;