import mongoose from "mongoose";

const postlikeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

export const PostLike = mongoose.model("PostLike", postlikeSchema);

const commentlikeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    comment: { type: mongoose.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

export const CommentLike = mongoose.model("CommentLike", commentlikeSchema);
