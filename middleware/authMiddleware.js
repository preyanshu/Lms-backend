const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const protect = async (req, res, next) => {
  // Get the token from the request header
  const token = req.header("Authorization");

  if (!token) {
    // If token is not provided, return an error
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user information to the request object for later use
    req.user = await User.findById(decoded.id).select("-password");

    next(); // Continue to the protected route
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = { protect };
