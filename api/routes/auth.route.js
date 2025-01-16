import express from "express";
import {
  forgotPassword,
  google,
  resetPassword,
  signin,
  signup,
  updatePassword,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/signup", signup);
router.get("/verify-email/:token", verifyEmail);
router.post("/update-password/:id", updatePassword);  


export default router;
