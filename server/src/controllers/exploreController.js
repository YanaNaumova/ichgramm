import Post from "../models/postModel.js";
export async function randomPosts(req, res) {
  try {
    const randomPosts = await Post.aggregate([{ $sample: { size: 9 } }]);
    console.log("Random Posts:", randomPosts);
    res.status(200).json(randomPosts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server internal error", error: error.message });
  }
}
