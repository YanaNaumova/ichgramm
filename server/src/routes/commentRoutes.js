import { Router } from "express";
import { addComment, deleteComment } from "../controllers/commentController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = Router();

router.post("/comment/:postId", authMiddleware, addComment);
router.delete("/comment/:postId/:commentId", authMiddleware, deleteComment);

export default router;
