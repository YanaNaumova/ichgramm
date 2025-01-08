import { Router } from "express";
import {
  addPostLike,
  addCommentLike,
  getPostlikes,
  getCommentLikes,
} from "../controllers/likeController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = new Router();

router.post("/like/:postId", authMiddleware, addPostLike);
router.get("/likeCount/:postId", authMiddleware, getPostlikes);
router.post("/like/:postId/:commentId", authMiddleware, addCommentLike);
router.get("/likeCount/:postId/:commentId", authMiddleware, getCommentLikes);

export default router;
