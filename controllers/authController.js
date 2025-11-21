// controllers/authController.js

import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { handleError, handleSuccess } from "../utils/handleResponse.js";

class AuthController {
  // User registration
  static async register(req, res) {
    try {
      const { fullname, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.find({ email });
      if (existingUser.length > 0) {
        return handleError(res, 400, "User already exists with this email");
      }

      // Create new user
      const newUser = new User({ name: fullname, email, password });
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      handleSuccess(res, 201, { token }, "User registered successfully");
    } catch (error) {
      handleError(res, 500, "Registration failed", error);
    }
  }

  //   User login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return handleError(res, 400, "User not found");
      }
      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return handleError(res, 400, "Invalid password");
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      handleSuccess(res, 200, { token }, "User logged in successfully");
    } catch (error) {
      handleError(res, 500, "Login failed", error);
    }
  }
}

export default AuthController;
