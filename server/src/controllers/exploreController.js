import Post from "../models/postModel.js";
export async function randomPost(req, res) {
  try {
    const randomPosts = await Post.aggregate([{ $sample: { size: 10 } }]);
    res.status(200).json(randomPosts);
  } catch (error) {
    res.status(500).json({ message: "Server internal error" });
  }
}
