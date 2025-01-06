import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  description: { type: String, trim: true },
  images: {
    type: [String],
    required: true,
    trim: true,
  },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
