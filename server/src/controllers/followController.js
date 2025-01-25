import Follower from "../models/followerModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

//добавить подписку
export async function addFollowing(req, res) {
  try {
    const { followId } = req.params;

    const userId = req.user.id;

    if (!followId) {
      return res.status(404).json({ message: `followId is required` });
    }

    if (!mongoose.Types.ObjectId.isValid(followId)) {
      return res.status(400).json({ message: `Invalid followId` });
    }

    if (followId === userId) {
      return res.status(400).json({ message: "User cannot follow themselves" });
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
      return res.status(200).json({
        message: "The following already exists",
        newFollower: null,
        isFollowing: true,
      });
    }
    const newFollower = new Follower({
      follower: user._id,
      following: follower._id,
      created_at: new Date(),
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
    res.status(200).json({
      message: "Foolowing was adder",
      isFollowing: false,
      newFollower,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server internal error",
      error: error,
      isFollowing: false,
    });
  }
}
export async function deleteFollowing(req, res) {
  try {
    const { followId } = req.params;

    const userId = req.user.id;

    if (!followId) {
      return res.status(404).json({ message: `followId is required` });
    }
    if (!mongoose.Types.ObjectId.isValid(followId)) {
      return res.status(400).json({ message: `Invalid followId` });
    }
    if (followId === userId) {
      return res.status(400).json({ message: "User cannot follow themselves" });
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
    res.status(200).json({
      message: "User unfollowed successfully",
      unfollowedId: followId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server internal error", error: error.message });
  }
}
//получить подписчиков
export async function getFollowings(req, res) {
  try {
    const userId = req.params.userId || req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user was not found" });
    }
    const followings = await Follower.find({ follower: userId });
    // .populate("following", "username email")
    // .exec();

    if (!followings || followings.length === 0) {
      return res.status(200).json({
        message: "following was not found",
        followings: [],
        followingsCount: 0,
      });
    }
    const followingsCount = await Follower.countDocuments({ follower: userId });
    res.status(200).json({
      message: `was found ${followings.length} following`,
      followings,
      followingsCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server internal error", error: error });
  }
}

//получить на кого я подписана
export async function getFollowers(req, res) {
  try {
    const userId = req.params.userId || req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user was not found" });
    }
    const followers = await Follower.find({ following: userId });
    // .populate("follower", "username email")
    // .exec();

    if (!followers || followers.length === 0) {
      return res.status(200).json({
        message: "followers was not found",
        followers: [],
        followersCount: 0,
      });
    }

    const followersCount = await Follower.countDocuments({ following: userId });
    res.status(200).json({
      message: `was found ${followers.length} followers`,
      followers,
      followersCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server internal error", error: error });
  }
}
