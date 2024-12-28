import express, { Router } from "express";
import {
  signup,
  login,
  getMe,
  logout,
  validateOtp,
} from "../controllers/authController";
import authenticate from "../middlewares/authMiddleware";

const router: Router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/validate-otp", validateOtp);

// Protected routes
router.get("/me", getMe);
router.post("/logout", logout);

export default router;
