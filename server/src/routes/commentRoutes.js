import { Router } from "express";
import {
  addComment,
  deleteComment,
  allCommentsByPost,
} from "../controllers/commentController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = Router();

router.post("/comment/:postId", authMiddleware, addComment);
router.delete("/comment/:postId/:commentId", authMiddleware, deleteComment);
router.get("/comments/:postId", authMiddleware, allCommentsByPost);

export default router;
