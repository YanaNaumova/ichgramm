// import Post from "../models/postModel.js";
// export async function randomPosts(req, res) {
//   try {
//     const randomPosts = await Post.aggregate([{ $sample: { size: 9 } }]);
//     console.log("Random Posts:", randomPosts);
//     res.status(200).json(randomPosts);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Server internal error", error: error.message });
//   }
// }

import Post from "../models/postModel.js";
import User from "../models/userModel.js"; // Предполагаем, что у вас есть модель User
export async function randomPosts(req, res) {
  try {
    const randomPosts = await Post.aggregate([{ $sample: { size: 9 } }]);

    const postsWithUsers = await Promise.all(
      randomPosts.map(async (post) => {
        const user = await User.findById(post.user).select("username avatar");
        return { ...post, user };
      })
    );

    res.status(200).json(postsWithUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server internal error", error: error.message });
  }
}
