import User from "../models/User.model.js";

const authorizeAdmin = async (req, res, next) => {
  try {
    // Check if user is authenticated (should be done by authenticate middleware first)
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get user details to check role
    const user = await User.findById(req.user.id).select("role isActive");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Check if user has admin role
    if (user.role !== "admin" && user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Add role to request for further use
    req.user.role = user.role;
    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

export default authorizeAdmin;
