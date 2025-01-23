import User from "../models/userModel.js";

export async function searchUser(req, res) {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is missing" });
    }
    const users = await User.find({
      $or: [
        { username: { $regex: `${query}`, $options: "i" } },
        { full_name: { $regex: `${query}`, $options: "i" } },
      ],
    }).populate("posts");
    if (users.length === 0) {
      return res.status(200).json({ message: "No users found", users: [] }); // 200 OK
    }
    res.status(200).json({ message: "users found", users: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server internal error", error: error.message });
  }
}
