import mongoose, { Schema } from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
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
  biography: {
    type: String,
    trim: "true",
  },
  avatar: {
    type: String,
    trim: true,
  },
  posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
});

const User = mongoose.model("User", userSchema);

export default User;
