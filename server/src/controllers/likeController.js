import { PostLike, CommentLike } from "../models/likeModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";

export async function addPostLike(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user was not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ message: `Post with ID ${postId} was not found` });
    }

    const existingLike = await PostLike.findOne({
      user: userId,
      post: postId,
    });
    if (existingLike) {
      await PostLike.findByIdAndDelete(existingLike._id);

      user.postLikes = user.postLikes.filter(
        (like) => like.toString() !== existingLike._id.toString()
      );
      await user.save();

      return res.status(200).json({ message: "Like removed from post" });
    }
    const newLike = new PostLike({
      user: userId,
      post: postId,
    });
    await newLike.save();
    user.postLikes.push(newLike._id);
    await user.save();
    return res.status(200).json({ message: "Like added to post" });
  } catch (error) {
    res.status(500).json({ message: "Server internal error", error: error });
  }
}

export async function addCommentLike(req, res) {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user was not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ message: `Post with ID ${postId} was not found` });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(400)
        .json({ message: `Comment with ID ${commentId} was not found` });
    }

    const existingLike = await CommentLike.findOne({
      user: userId,
      comment: commentId,
    });
    if (existingLike) {
      await CommentLike.findByIdAndDelete(existingLike._id);

      user.commentLikes = user.commentLikes.filter(
        (like) => like.toString() !== existingLike._id.toString()
      );
      await user.save();

      return res.status(200).json({ message: `Like removed from comment` });
    }
    const newLike = new CommentLike({
      user: userId,
      comment: commentId,
    });
    await newLike.save();
    user.commentLikes.push(newLike._id);
    await user.save();
    return res.status(200).json({ message: "Like added to comment" });
  } catch (error) {
    res.status(500).json({ message: "Server internal error", error: error });
  }
}
