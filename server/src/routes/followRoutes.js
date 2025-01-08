import { Router } from "express";
import {
  addFollowing,
  deleteFollowing,
  getFollowers,
  getFollowings,
} from "../controllers/followController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = Router();

router.post("/following", authMiddleware, addFollowing);
router.post("/unfollow", authMiddleware, deleteFollowing);
router.get("/followings", authMiddleware, getFollowings);
router.get("followers", authMiddleware, getFollowers);

export default router;
