import { Router } from "express";
import { addPostLike, addCommentLike } from "../controllers/likeController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = new Router();

router.post("/like/:postId", authMiddleware, addPostLike);
router.post("/like/:postId/:commentId", authMiddleware, addCommentLike);

export default router;
