import User from "../models/userModel.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
export async function getProfile(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${id} does not exist`,
      });
    }

    res.status(200).json({ message: "User was found", user: user });
  } catch (error) {
    res.status(500).json({ message: "Server internal error", error: error });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, biography } = req.body;
    const { id } = req.params;
    const userId = req.user.id;
    console.log(id, userId);
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${id} does not exist` });
    }

    if (user._id.toString() !== userId) {
      return res
        .status(400)
        .json({ message: "The user does not have access to this profile" });
    }
    if (name && name !== user.name) {
      user.name = name;
    }
    if (biography && biography !== user.biography) {
      user.biography = biography;
    }

    if (req.file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
        });
      }
      const base64Image = req.file.buffer.toString("base64");
      const base64EncodedImage = `data:${req.file.mimetype};base64,${base64Image}`;
      user.avatar = base64EncodedImage;
    }

    await user.save();
    res.status(200).json({ message: "user was updated", user: user });
  } catch (error) {
    return res.status(500).json({ message: "Server internal error", error });
  }
}

export async function addPhoto(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${id} does not exist` });
    }

    if (user._id.toString() !== userId) {
      return res
        .status(400)
        .json({ message: "The user does not have access to this profile" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No photo was uploaded. Please attach a file." });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
      });
    }
    const base64Image = req.file.buffer.toString("base64");
    const base64EncodedImage = `data:${req.file.mimetype};base64,${base64Image}`;
    user.avatar = base64EncodedImage;

    await user.save();
    res.status(200).json({ message: "user Photo was added", user: user });
  } catch (error) {
    return res.status(500).json({ message: "Server internal error", error });
  }
}

export const uploadProfileImage = upload.single("avatar");
