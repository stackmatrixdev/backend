// controllers/authController.js

import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { handleError, handleSuccess } from "../utils/handleResponse.js";
import { devLog } from "../utils/helper.js";
import Otp from "../models/Otp.model.js";
import { generateNumericOtp, sendOtpEmail } from "../utils/otp.js";

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

      // Create new user (do not mark verified)
      const newUser = new User({
        name: fullname,
        email,
        password,
        isVerified: false,
      });
      await newUser.save();

      // generate OTP, save hashed version with TTL (e.g., 5 minutes)
      const otpPlain = generateNumericOtp(6);
      devLog(`Generated OTP: ${otpPlain} for user: ${newUser._id}`);
      await Otp.createForUser(newUser._id, otpPlain, 300);

      // send OTP via email
      await sendOtpEmail(newUser.email, otpPlain, { ttlSeconds: 300 });

      // respond telling client to verify OTP
      handleSuccess(
        res,
        201,
        { email: newUser.email, userId: newUser._id },
        "User registered. Verification OTP sent to email."
      );
    } catch (error) {
      handleError(res, 500, "Registration failed", error);
    }
  }

  // Verify OTP endpoint (add this to controller)
  static async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });

      devLog(`Verifying OTP for user: ${user ? user._id : "not found"}`);

      const userId = user?._id;
      if (!user) return handleError(res, 400, "User not found");

      const record = await Otp.findOne({ user: userId }).sort({
        createdAt: -1,
      }); // get latest otp

      devLog(`OTP record found: ${record ? "Yes" : "No"}`);

      if (!record) return handleError(res, 400, "OTP not found or expired");

      if (record.expiresAt < new Date()) {
        await record.deleteOne();
        return handleError(res, 400, "OTP expired");
      }

      const ok = await record.compareOtp(otp);

      devLog(`OTP match: ${ok}`);

      if (!ok) return handleError(res, 400, "Invalid OTP");

      // mark user as verified
      await User.findByIdAndUpdate(userId, { isVerified: true });

      // mark email as verified
      user.isVerified = true;
      await user.save();

      // remove used otp
      await record.deleteOne();

      handleSuccess(res, 200, null, "User verified successfully");
    } catch (error) {
      devLog(`OTP verification error: ${error.message} on line ${error.stack}`);
      handleError(res, 500, "OTP verification failed", error);
    }
  }

  //   User login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      devLog(`Login attempt for email: ${email}`);

      const user = await User.findOne({ email }).select("+password");
      if (!user) return handleError(res, 400, "User not found");

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return handleError(res, 400, "Invalid password");

      // access token (short-lived)
      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "1h",
      });

      // refresh token (long-lived) - sign with separate secret
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "30d",
        }
      );

      devLog(`Generated access token and refresh token for user ${user._id}`);

      // Optionally set httpOnly cookie for refresh token:
      // res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV==='production', maxAge: 30*24*60*60*1000 });

      handleSuccess(
        res,
        200,
        {
          email: user.email,
          accessToken,
          refreshToken,
          isActive: user.isActive,
        },
        "User logged in successfully"
      );
    } catch (error) {
      devLog(`Login error: ${error.message} on line ${error.stack}`);
      handleError(res, 500, "Login failed", error);
    }
  }

  // Forgot password
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      devLog(`Forgot password request for email: ${email}`);
      if (!user) {
        return handleError(res, 400, "User not found with this email");
      }

      // generate OTP, save hashed version with TTL (e.g., 10 minutes)
      const otpPlain = generateNumericOtp(6);
      devLog(`Generated OTP: ${otpPlain} for user: ${user._id}`);

      await Otp.createForUser(user._id, otpPlain, 600);
      await sendOtpEmail(user.email, otpPlain, { ttlSeconds: 600 });

      // Set flag to allow password reset — await the model method (it saves)
      await user.enableForgotPasswordRequests(600);

      devLog(`Sent forgot password OTP to ${user.email}`);

      handleSuccess(res, 200, null, "OTP sent to email for password reset");
    } catch (error) {
      devLog(`Forgot password error: ${error.message} on line ${error.stack}`);
      handleError(res, 500, "Forgot password failed", error);
    }
  }

  // Reset password
  static async resetPassword(req, res) {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
        return handleError(res, 400, "email and newPassword are required");
      }

      // select the hidden flag & expiry (fields marked select:false)
      const user = await User.findOne({ email }).select(
        "+forgotPasswordRequestsAllowed +forgotPasswordExpires +password"
      );

      devLog(`resetPassword: user found? ${!!user}`);
      if (user) {
        devLog(
          `forgotPasswordRequestsAllowed: ${user.forgotPasswordRequestsAllowed}`
        );
        devLog(`forgotPasswordExpires: ${user.forgotPasswordExpires}`);
        devLog(
          `forgotPasswordExpires (ms): ${user.forgotPasswordExpires?.getTime?.()}`
        );
        devLog(`now (ms): ${Date.now()}`);
      }

      if (!user) {
        return handleError(res, 400, "User not found with this email");
      }

      if (
        !user.forgotPasswordRequestsAllowed ||
        !user.forgotPasswordExpires ||
        user.forgotPasswordExpires < new Date()
      ) {
        return handleError(
          res,
          400,
          "Password reset not allowed. Please initiate forgot password first."
        );
      }

      // Update password and clear the flag/expiry
      user.password = newPassword;
      user.forgotPasswordRequestsAllowed = false;
      user.forgotPasswordExpires = null;
      await user.save();

      handleSuccess(res, 200, null, "Password reset successfully");
    } catch (error) {
      handleError(res, 500, "Reset password failed", error);
    }
  }

  // Refresh token
  static async refreshToken(req, res) {
    try {
      // get refresh token from cookie or body or Authorization header
      const token =
        req.cookies?.refreshToken ||
        req.body?.refreshToken ||
        (req.headers.authorization && req.headers.authorization.split(" ")[1]);

      if (!token) {
        devLog("No refresh token provided");
        return handleError(res, 400, "Refresh token is required");
      }

      // verify refresh token with the refresh secret
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      } catch (err) {
        devLog(`Refresh token verify error: ${err.message}`);
        return handleError(res, 401, "Invalid or expired refresh token");
      }

      // generate new access token
      const newAccessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "1h",
        }
      );

      // (optional) rotate refresh token: issue a new refresh token and send it
      const newRefreshToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "30d",
        }
      );

      // Optionally set cookie:
      // res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV==='production' });

      devLog(`Refreshed access token for user ${decoded.id}`);

      handleSuccess(
        res,
        200,
        { accessToken: newAccessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully"
      );
    } catch (error) {
      devLog(`Refresh token error: ${error.message} on line ${error.stack}`);
      handleError(res, 500, "Refresh token failed", error);
    }
  }

  // Delete account
  static async deleteAccount(req, res) {
    try {
      const userId = req.user._id;
      devLog(`Deleting account for user: ${userId}`);
      await User.findByIdAndDelete(userId);
      handleSuccess(res, 200, null, "Account deleted successfully");
    } catch (error) {
      devLog(`Delete account error: ${error.message} on line ${error.stack}`);
      handleError(res, 500, "Account deletion failed", error);
    }
  }
}

export default AuthController;
