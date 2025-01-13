import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [7, "Password must be longer than 6 characters"],
  },
  full_name: { type: String, required: true, trim: true },
  biography: {
    type: String,
    trim: true,
    default: "",
  },
  webSite: {
    type: String,
    trim: true,
    default: "",
  },
  avatar: {
    type: String,
    default: "",
  },
  posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
  postLikes: [{ type: mongoose.Types.ObjectId, ref: "Like" }],
  commentLikes: [{ type: mongoose.Types.ObjectId, ref: "Like" }],
  followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  followings: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
