import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadPostImages = upload.any();

export async function getUserPosts(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("posts");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${userId} was not found` });
    }
    const posts = user.posts;
    if (posts.length === 0) {
      return res.status(200).json({ message: "No posts found", posts: [] });
    }
    res.status(200).json({ message: `Was found ${posts.length} post`, posts });
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

export async function deletePost(req, res) {
  try {
    const userId = req.user.id;
    const { id: postId } = req.params;
    const user = await User.findById(userId).populate("posts");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${id} was not found` });
    }
    const postIndex = user.posts.findIndex(
      (post) => post._id.toString() === postId
    );
    if (postIndex === -1) {
      return res
        .status(400)
        .json({ message: `post with id ${postId} was not found` });
    }
    const deletePost = await Post.findOneAndDelete({ _id: postId });
    if (!deletePost) {
      return res.status(400).json({ message: "Post was not delete" });
    }
    user.posts.splice(postIndex, 1);
    await user.save();
    res.status(200).json({ message: "Post was deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server internal error" });
  }
}

export async function getPostById(req, res) {
  try {
    const { id: postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: `post with id ${postId} not found` });
    }
    res
      .status(200)
      .json({ message: `post with id ${postId} was found`, post: post });
  } catch (error) {
    res.status(500).json({ message: "server internal error", error: error });
  }
}

export async function updatePost(req, res) {
  try {
    const { id: postId } = req.params;
    const { description } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).populate("posts");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${userId} was not found` });
    }
    const post = user.posts.find((post) => post._id.toString() === postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: `Post with id ${postId} was not found` });
    }

    if (description && post.description !== description) {
      post.description = description;
    }

    if (req.files && req.files.length > 0) {
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
      post.images = imageArray;
    }
    await post.save();
    res
      .status(200)
      .json({ message: `Post with id ${postId} was updated`, post });
  } catch (error) {
    res.status(500).json({ message: "Server internaal error" });
  }
}
export async function getAllPosts(req, res) {
  try {
    const posts = await Post.find();
    if (posts.length === 0) {
      return res.status(200).json({ message: "No posts found", posts: [] });
    }
    res.status(200).json({ message: `Was found ${posts.length} post`, posts });
  } catch (error) {
    res.status(500).json({ message: "Server internal error" });
  }
}
