import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "../server/src/config/db.js";
import authRoutes from "../server/src/routes/authRoutes.js";
import userRoutes from "../server/src/routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    app.get("/", (req, res) => {
      res.send("Hello world");
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  } catch (error) {
    console.error("Failed connect to DB");
    process.exit(1);
  }
}

startServer();
