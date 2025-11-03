// create token and saving that in cookies
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const isProduction = process.env.NODE_ENV === "PRODUCTION" || process.env.NODE_ENV === "production";

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    // For localhost: use "lax" or "strict", secure: false
    // For production: use "none", secure: true
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  };

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