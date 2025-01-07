import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    commentText: { type: String, trim: true, required: true },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    post: { type: mongoose.Types.ObjectId, required: true, ref: "Post" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
