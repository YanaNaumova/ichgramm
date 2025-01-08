import { Router } from "express";
import {
  addFollowing,
  deleteFollowing,
  getFollowers,
  getFollowings,
} from "../controllers/followController.js";

const router = Router();

router.post("/following", addFollowing);
router.post("/unfollow", deleteFollowing);
router.get("/followings", getFollowings);
router.get("followers", getFollowers);

export default router;
