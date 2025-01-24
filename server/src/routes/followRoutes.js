import { Router } from "express";
import {
  addFollowing,
  deleteFollowing,
  getFollowers,
  getFollowings,
} from "../controllers/followController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = Router();

router.post("/following/:followId", authMiddleware, addFollowing);
router.delete("/unfollow/:followId", authMiddleware, deleteFollowing);
router.get("/followings/:userId", authMiddleware, getFollowings);
router.get("/followers/:userId", authMiddleware, getFollowers);

export default router;
