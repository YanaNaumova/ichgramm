import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";

export async function addComment(req, res) {
  try {
    const { commentText } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user was not found" });
    }
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post was not found" });
    }
    if (!commentText) {
      return res.status(400).json({ message: "The comment was not provided" });
    }
    const newComment = new Comment({
      commentText,
      user: userId,
      post: postId,
    });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    res.status(200).json({ message: "comment was created", newComment });
  } catch (error) {
    res.status(500).json({ message: "Server internal error", error: error });
  }
}
