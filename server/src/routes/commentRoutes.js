import { Router } from "express";
import {
  addComment,
  deleteComment,
  updateComment,
  getAllCommentsByPost,
} from "../controllers/commentController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = Router();

router.post("/comment/:postId", authMiddleware, addComment);
router.delete("/comment/:postId/:commentId", authMiddleware, deleteComment);
router.put("/comment/:postId/:commentId", authMiddleware, updateComment);
router.get("/comments/:postId", authMiddleware, getAllCommentsByPost);

export default router;
