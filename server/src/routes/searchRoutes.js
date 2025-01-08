import { Router } from "express";
import { searchUser } from "../controllers/searchController.js";
import authMiddleware from "../middelwares/authMiddelware.js";

const router = Router();

router.get("/users", authMiddleware, searchUser);

export default router;
