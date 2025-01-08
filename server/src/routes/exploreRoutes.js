import { Router } from "express";
import { randomPost } from "../controllers/exploreController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = Router();

router.get("/randomPosts", authMiddleware, randomPost);

export default router;
