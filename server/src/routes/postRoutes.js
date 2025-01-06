import { Router } from "express";
import authMiddleware from "../middelwares/authMiddelware.js";
import {
  getuserPosts,
  createPost,
  deletePost,
  getPostById,
  updatePost,
  getAllPosts,
  uploadPostImages,
} from "../controllers/postController.js";

const router = Router();

router.get("/posts", authMiddleware, getuserPosts);
router.post("/create", authMiddleware, uploadPostImages, createPost);
router.delete("/post/:id", authMiddleware, deletePost);
router.get("/post/:id", authMiddleware, getPostById);
router.put("/update/:id", authMiddleware, updatePost);
router.get("/allposts", authMiddleware, getAllPosts);

export default router;
