import User from "../models/userModel.js";

export async function searchUser(req, res) {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is missing" });
    }
    const users = await User.find({
      $or: [{ name: { $regex: `${query}`, $options: "i" } }],
    });
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ message: "users found", users });
  } catch (error) {
    res.status(500).json({ message: "Server internal error", error: error });
  }
}
