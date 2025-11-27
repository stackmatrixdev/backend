import express from "express";
// Import controllers here
import AuthController from "../controllers/authController.js";

const router = express.Router();

// Auth routes - to be implemented
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/verify-otp", AuthController.verifyOtp);
// router.post('/logout', logout);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
// router.post('/verify-email', verifyEmail);
router.post('/refresh-token', AuthController.refreshToken);

export default router;
