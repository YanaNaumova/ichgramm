import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { username, email, password, full_name } = req.body;

    if (!username || !email || !password || !full_name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const candidate = await User.findOne({ $or: [{ email }, { username }] });
    if (candidate) {
      return res.status(400).json({
        message: "The user with this email or username  already exists",
      });
    }

    if (password.length <= 6) {
      return res
        .status(400)
        .json({ message: "Password must be longer than 6 characters" });
    }
    const heshedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: heshedPassword,
      full_name,
    });
    res.status(201).json({
      message: "User was created",
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server internal error", error: error });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, username: user.username, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "User was found",
      user: {
        username: user.username,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server internal Error" });
  }
}
