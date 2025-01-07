import { Router } from "express";
import { addComment } from "../controllers/commentController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = Router();

router.post("/comment/:postId", authMiddleware, addComment);

export default router;
