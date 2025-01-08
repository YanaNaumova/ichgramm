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

export async function deleteComment(req, res) {
  try {
    const userId = req.user.id;
    const { postId, commentId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${userId} was not found` });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: `Post with id ${postId} was not found` });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ message: `comment with id ${commentId}  was not found` });
    }

    if (comment.user.toString() !== userId) {
      return res
        .status(400)
        .json({ message: "The user who created the comment does not match" });
    }

    if (comment.post.toString() !== postId) {
      return res.status(400).json({ message: "The post does not match" });
    }

    const deletedComment = await Comment.deleteOne({ _id: commentId });

    post.comments = post.comments.filter((comment) => {
      return comment.toString() !== commentId;
    });
    await post.save();
    res.status(200).json({ message: "comment was deleted", deletedComment });
  } catch (error) {
    res.status(500).json({ message: "Server internal error", error: error });
  }
}

export async function allCommentsByPost(req, res) {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("comments");
    if (!post) {
      return res
        .status(400)
        .json({ message: `post with id ${postId} was not found` });
    }
    if (post.comments === 0) {
      return res.status(400).json({ message: "comments was not found" });
    }
    res.status(200).json({
      comments: post.comments,
      message: `was found ${post.comments.length} comment`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server internal error" });
  }
}
