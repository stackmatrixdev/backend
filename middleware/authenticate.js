import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { devLog } from "../utils/helper.js";
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    console.log("🔐 [Auth] Checking authentication...");
    console.log(
      "📋 [Auth] Headers:",
      req.headers.authorization ? "Present" : "Missing"
    );
    console.log(
      "🍪 [Auth] Cookie token:",
      req.cookies?.token ? "Present" : "Missing"
    );
    console.log("🎫 [Auth] Token:", token ? "Found" : "Not found");

    if (!token) {
      console.log("❌ [Auth] No token provided");
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ [Auth] Token verified for user:", decoded.id);

      // Get user from token
      const user = await User.findById(decoded.id).select("-password ");

      if (!user) {
        console.log("❌ [Auth] User not found in database");
        return res.status(401).json({
          success: false,
          message: "No user found with this token",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        console.log("❌ [Auth] User account is deactivated");
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      // Add user to request
      req.user = user;
      req.user.id = user._id; // Ensure req.user.id is set
      console.log("✅ [Auth] Authentication successful for:", user.email);
      devLog("Authenticated user:", req.user.id);
      next();
    } catch (error) {
      console.log("❌ [Auth] Token verification failed:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

export default authenticate;
