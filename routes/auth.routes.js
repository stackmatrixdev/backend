import express from "express";
// Import controllers here
import AuthController from "../controllers/authController.js";
const router = express.Router();

// Auth routes - to be implemented
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
// router.post('/logout', logout);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);
// router.post('/verify-email', verifyEmail);
// router.post('/refresh-token', refreshToken);

export default router;
