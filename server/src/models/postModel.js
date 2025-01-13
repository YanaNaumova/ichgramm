import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  description: { type: String, trim: true, default: "" },
  // images: [
  //   {
  //     type: String,
  //     required: true,
  //     trim: true,
  //   },
  // ],
  image: { type: String, required: true, trim: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
