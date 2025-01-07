import { Router } from "express";
import { addLike } from "../controllers/likeController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = new Router();

router.post("/like/:postId", authMiddleware, addLike);
router.post("/like/:postId/:commentId", authMiddleware, addLike);

export default router;
