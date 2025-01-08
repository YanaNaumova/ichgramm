import Follower from "../models/followerModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

export async function addFollowing(req, res) {
  try {
    const { followId } = req.body;

    const userId = req.user.id;
    if (followId === userId) {
      return res.status(400).json({ message: "User cannot follow themselves" });
    }

    if (!followId) {
      return res.status(404).json({ message: `followId is required` });
    }
    if (!mongoose.Types.ObjectId.isValid(followId)) {
      return res.status(400).json({ message: `Invalid followId` });
    }

    const follower = await User.findById(followId);

    if (!follower) {
      return res
        .status(404)
        .json({ message: `Follower with id ${followId} was not found` });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `user with id ${userId} was not found` });
    }

    const existierFollower = await Follower.findOne({
      follower: user._id,
      following: follower._id,
    });

    if (existierFollower) {
      return res.status(400).json({ message: "The following already exists." });
    }
    const newFollower = new Follower({
      follower: user._id,
      following: follower._id,
    });

    await newFollower.save();
    if (!user.followings.includes(followId)) {
      user.followings.push(followId);
    }

    if (!follower.followers.includes(userId)) {
      follower.followers.push(userId);
    }
    await user.save();
    await follower.save();
    res.status(200).json(newFollower);
  } catch (error) {
    res.status(500).json({ message: "Server internal error", error: error });
  }
}
export async function deleteFollowing(req, res) {
  try {
    const { followId } = req.body;

    const userId = req.user.id;

    if (followId === userId) {
      return res.status(400).json({ message: "User cannot follow themselves" });
    }

    if (!followId) {
      return res.status(404).json({ message: `followId is required` });
    }
    if (!mongoose.Types.ObjectId.isValid(followId)) {
      return res.status(400).json({ message: `Invalid followId` });
    }

    const follower = await User.findById(followId);

    if (!follower) {
      return res
        .status(404)
        .json({ message: `Follower with id ${followId} was not found` });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `user with id ${userId} was not found` });
    }

    const existingFollower = await Follower.findOneAndDelete({
      follower: user._id,
      following: follower._id,
    });

    if (!existingFollower) {
      return res.status(400).json({ message: "The following was not found" });
    }

    user.followings = user.followings.filter(
      (id) => id.toString() !== followId
    );
    follower.followers = follower.followers.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await follower.save();
    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server internal error", error: error.message });
  }
}
export async function getFollowings(req, res) {}
export async function getFollowers(req, res) {}
