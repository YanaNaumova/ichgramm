import { Router } from "express";
import authMiddleware from "../middelwares/authMiddelware.js";
import {
  getUserPosts,
  createPost,
  deletePost,
  getPostById,
  updatePost,
  getAllPosts,
  uploadPostImages,
  getByUserIdPosts,
} from "../controllers/postController.js";

const router = Router();

router.get("/posts/:id", authMiddleware, getByUserIdPosts);
router.get("/posts", authMiddleware, getUserPosts);
router.post("/create", authMiddleware, uploadPostImages, createPost);
router.delete("/post/:id", authMiddleware, deletePost);
router.get("/post/:id", authMiddleware, getPostById);
router.put("/update/:id", authMiddleware, uploadPostImages, updatePost);
router.get("/allposts", authMiddleware, getAllPosts);

export default router;
