import mongoose from "mongoose";

const postlikeSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Types.ObjectId, ref: "Post" },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

export const PostLike = mongoose.model("PostLike", postlikeSchema);

const commentlikeSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Types.ObjectId, ref: "Post" },
  comment: { type: mongoose.Types.ObjectId, ref: "Comment" },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

export const CommentLike = mongoose.model("CommentLike", commentlikeSchema);
