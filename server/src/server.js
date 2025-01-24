import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import exploreRoutes from "./routes/exploreRoutes.js";
import followerRoutes from "./routes/followRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    app.get("/", (req, res) => {
      res.send("Hello, world!");
    });

    app.post("/api/hello", (req, res) => {
      res.send("Hello world");
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/posts", postRoutes);
    app.use("/api/likes", likeRoutes);
    app.use("/api/comments", commentRoutes);
    app.use("/api/search", searchRoutes);
    app.use("/api/random", exploreRoutes);
    app.use("/api/follower", followerRoutes);
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  } catch (error) {
    console.error("Failed connect to DB");
    process.exit(1);
  }
}

startServer();
