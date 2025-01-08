import { Router } from "express";
import { randomPost } from "../controllers/exploreController.js";

const router = Router();

router.get("/randomPosts", randomPost);

export default router;
