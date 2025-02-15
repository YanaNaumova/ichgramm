import User from "../models/userModel.js";
import multer from "multer";
import mongoose from "mongoose";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export async function getProfileById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Error 400");
      return res.status(400).json({
        message: `Invalid user ID: ${id}`,
      });
    }

    const user = await User.findById(id)
      .select("-password")
      .populate({
        path: "posts",
        populate: {
          path: "user", // поле в post, которое ссылается на пользователя
          model: "User", // указываем модель для поля user
          // select: "_id username avatar", // выбираем только нужные поля
        },
      });

    console.log(user);
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

export async function getProfile(req, res) {
  try {
    const { id } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: `Invalid user ID: ${id}`,
      });
    }

    const user = await User.findById(id)
      .select("-password")
      .populate({
        path: "posts",
        populate: {
          path: "user", // поле в post, которое ссылается на пользователя
          model: "User", // указываем модель для поля user
          // select: "_id username avatar", // выбираем только нужные поля
        },
      });

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
    const { username, biography, webSite, full_name } = req.body;
    const userId = req.user.id; // Получаем ID пользователя из токена

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} does not exist` });
    }

    // Обновление данных пользователя
    if (username && username !== user.username) {
      user.username = username;
    }
    if (biography && biography !== user.biography) {
      user.biography = biography;
    }
    if (full_name && full_name !== user.full_name) {
      user.full_name = full_name;
    }
    if (webSite && webSite !== user.webSite) {
      user.webSite = webSite;
    }

    // Обработка загрузки аватара
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
    res.status(200).json({ message: "User was updated", user: user });
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
