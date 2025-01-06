import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../controllers/userController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = Router();

router.get("/profile/:id", authMiddleware, getProfile);
router.put("/profile/:id", authMiddleware, uploadProfileImage, updateProfile);

export default router;
