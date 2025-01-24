import { Router } from "express";
import {
  getProfileById,
  updateProfile,
  uploadProfileImage,
  addPhoto,
  getProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = Router();

router.get("/profile", authMiddleware, getProfile);
router.get("/profile/:id", authMiddleware, getProfileById);
router.put("/profile/", authMiddleware, uploadProfileImage, updateProfile);
router.post("/profile/:id", authMiddleware, uploadProfileImage, addPhoto);

export default router;
