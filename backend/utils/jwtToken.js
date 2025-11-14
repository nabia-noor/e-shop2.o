// create token and saving that in cookies
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const isProduction = process.env.NODE_ENV === "PRODUCTION" || process.env.NODE_ENV === "production";

  // Options for cookies
  // For localhost cross-origin: use "none" with secure: false (Chrome/Firefox allow this for localhost)
  // For production: use "none" with secure: true (required for cross-origin)
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none", // Required for cross-origin (localhost:3000 -> localhost:8000)
    secure: false, // false for localhost (browsers allow this exception), true for production
    path: "/", // Ensure cookie is available for all paths
    // Don't set domain - browser will automatically set it to the domain that sets it (localhost:8000)
  };

  // For production, set secure to true
  if (isProduction) {
    options.secure = true;
  }

  console.log("Setting cookie with options:", {
    expires: options.expires,
    httpOnly: options.httpOnly,
    sameSite: options.sameSite,
    secure: options.secure
  });

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
  // For localhost: use "lax" or "strict" with secure: false
  // For production: use "none" with secure: true
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction ? true : false,
  };

  res.status(statusCode).cookie("seller_token", token, options).json({
    success: true,
    seller,
    token,
  });
};

module.exports = { sendToken, sendSellerToken };