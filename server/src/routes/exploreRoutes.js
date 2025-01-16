import { Router } from "express";
import { randomPosts } from "../controllers/exploreController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = Router();

router.get("/randomPosts", authMiddleware, randomPosts);

export default router;
