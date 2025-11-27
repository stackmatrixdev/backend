// controllers/userController.js

import User from "../models/User.model.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";

class UserController {
  // Get user profile
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return handleError(res, 404, "User not found");
      }
      handleSuccess(res, 200, user, "User profile fetched successfully");
    } catch (error) {
      handleError(res, 500, "Failed to fetch user profile", error);
    }
  }

  // updateProfile
  static async updateProfile(req, res) {
    try {
      const updates = req.body; /// Get updates from request body
      const user = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");

      // Check if user exists
      if (!user) {
        return handleError(res, 404, "User not found");
      }

      handleSuccess(res, 200, user, "User profile updated successfully");
    } catch (error) {
      handleError(res, 500, "Failed to update user profile", error);
    }
  }

  
}

export default UserController;
