import Like from "../models/likeModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";

async function removeLike(likeId, user) {
  await Like.findByIdAndDelete(likeId);

  user.likes = user.likes.filter(
    (like) => like.toString() !== likeId.toString()
  );
  await user.save();
}

async function handleLike(entityId, entityType, user, userId) {
  const entityModel = entityType === "post" ? Post : Comment;

  const entity = await entityModel.findById(entityId);
  if (!entity) {
    return { status: 404, message: `${entityType} not found` };
  }

  const likeData = {
    user: userId,
    [entityType]: entityId,
  };
  if (entityType === "post") {
    likeData.comment = null;
  } else if (entityType === "comment") {
    likeData.post = null;
  }
  const existingLike = await Like.findOne({
    user: userId,
    [entityType]: entityId,
  });
  if (existingLike) {
    await removeLike(existingLike._id, user);

    return { status: 200, message: `Like removed from ${entityType}` };
  }
  const newLike = new Like(likeData);
  await newLike.save();
  user.likes.push(newLike._id);
  await user.save();
  return { status: 200, message: `Like added to ${entityType}` };
}

export async function addLike(req, res) {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user was not found" });
    }

    let responseMessage;

    if (commentId) {
      responseMessage = await handleLike(commentId, "comment", user, userId);
    } else if (postId) {
      responseMessage = await handleLike(postId, "post", user, userId);
    } else {
      return res
        .status(400)
        .json({ message: "Neither postId nor commentId provided" });
    }

    res
      .status(responseMessage.status)
      .json({ message: responseMessage.message });
  } catch (error) {
    res.status(500).json({ message: "Server internal error", error: error });
  }
}
