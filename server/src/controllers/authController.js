import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      return res
        .status(400)
        .json({ message: "The user with this email already exists" });
    }
    //если имя существет сообщать об этом
    // добавить user_name
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length <= 6) {
      return res
        .status(400)
        .json({ message: "Password must be longer than 6 characters" });
    }
    const heshedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: heshedPassword,
    });
    res.status(201).json({
      message: "User was created",
      user: { name: user.name, email: user.email },
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
      { email: user.email, name: user.name, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "User was found",
      user: {
        name: user.name,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server internal Error" });
  }
}
