import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadPostImages = upload.any();

export async function getuserPosts(req, res) {
  try {
    const posts = await Post.find();
    if (posts.length === 0) {
      return res.status(200).json({ message: "No posts found", posts: [] });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server internal error" });
  }
}

export async function createPost(req, res) {
  try {
    const { description } = req.body;
    const id = req.user.id;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${id} does not exist` });
    }
    const newPost = new Post({
      description,
      user: id,
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "The post photos are not added" });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const imageArray = [];
    for (const file of req.files) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
        });
      }
      const base64Image = file.buffer.toString("base64");
      const base64EncodedImage = `data:${file.mimetype};base64,${base64Image}`;
      imageArray.push(base64EncodedImage);
    }
    newPost.images = imageArray;

    await newPost.save();
    user.posts.push(newPost._id);
    await user.save();
    res.status(201).json({ message: "New post was created", newPost: newPost });
  } catch (error) {
    res.status(500).json({ message: "Server internal error", error: error });
  }
}
export async function deletePost(req, res) {}
export async function getPostById(req, res) {}
export async function updatePost(req, res) {}
export async function getAllPosts(req, res) {}
