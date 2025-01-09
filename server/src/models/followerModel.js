import mongoose from "mongoose";

const followerSchema = new mongoose.Schema({
  follower: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  following: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const Follower = mongoose.model("Follower", followerSchema);

export default Follower;
