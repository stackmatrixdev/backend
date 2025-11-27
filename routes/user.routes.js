import express from "express";
// Import controllers and middleware here
import authenticate from "../middleware/authenticate.js";
import UserController from "../controllers/userController.js";
import AuthController from "../controllers/authController.js";
const router = express.Router();
// User routes - to be implemented
router.get("/profile", authenticate, UserController.getProfile);
// router.get('/stats', authenticate, getUserStats);
// router.get('/enrolled-programs', authenticate, getEnrolledPrograms);
// router.post('/enroll/:programId', authenticate, enrollProgram);
// router.put('/preferences', authenticate, updatePreferences);
router.delete('/account', authenticate, AuthController.deleteAccount);
router.put('/account', authenticate, UserController.updateProfile);
export default router;
