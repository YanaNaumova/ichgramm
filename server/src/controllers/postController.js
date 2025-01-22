import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import multer from "multer";
import Comment from "../models/commentModel.js";
import { PostLike, CommentLike } from "../models/likeModel.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadPostImages = upload.single("image");

export async function getUserPosts(req, res) {
  try {
    const userId = req.user.id; // Получаем userId из запроса (предполагается, что он передается через middleware)

    // Находим все посты, принадлежащие данному пользователю
    const posts = await Post.find({ user: userId }).populate("user");

    if (!posts || posts.length === 0) {
      return res.status(200).json({ message: "No posts found", posts: [] });
    }

    // Отправляем список постов обратно в ответе
    res
      .status(200)
      .json({ message: `Found ${posts.length} post(s)`, posts: posts });
  } catch (error) {
    console.error(error); // Логируем ошибку для удобства отладки
    res.status(500).json({ message: "Server internal error" });
  }
}

export async function createPost(req, res) {
  try {
    const { description } = req.body;
    const id = req.user.id;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${id} does not exist` });
    }
    const newPost = new Post({
      description,
      user: id,
    });

    // if (!req.files || req.files.length === 0) {
    //   return res.status(400).json({ message: "The post photos are not added" });
    // }

    // const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    // const imageArray = [];
    // for (const file of req.files) {
    //   if (!allowedTypes.includes(file.mimetype)) {
    //     return res.status(400).json({
    //       message: "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
    //     });
    //   }
    //   const base64Image = file.buffer.toString("base64");
    //   const base64EncodedImage = `data:${file.mimetype};base64,${base64Image}`;
    //   imageArray.push(base64EncodedImage);
    // }
    // newPost.images = imageArray;
    if (!req.file) {
      return res.status(400).json({ message: "The post photos are not added" });
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
      newPost.image = base64EncodedImage;
    }

    await newPost.save();

    user.posts.push(newPost._id);
    await user.save();

    const populatedPost = await newPost.populate("user");

    res
      .status(201)
      .json({ message: "New post was created", newPost: populatedPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server internal error", error: error.message });
  }
}

export async function deletePost(req, res) {
  try {
    const userId = req.user.id;
    const { id: postId } = req.params;
    const user = await User.findById(userId).populate("posts");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${userId} was not found` });
    }
    const postIndex = user.posts.findIndex(
      (post) => post._id.toString() === postId
    );
    if (postIndex === -1) {
      return res
        .status(400)
        .json({ message: `post with id ${postId} was not found` });
    }

    // Удаляем комментарии, связанные с постом
    await Comment.deleteMany({ post: postId });

    // Получаем все лайки, связанные с этим постом
    const postLikes = await PostLike.find({ post: postId });
    const commentLikes = await CommentLike.find({ post: postId });

    // Получаем массив ID лайков, чтобы удалить их из модели User
    const postLikeIds = postLikes.map((like) => like._id);
    const commentLikeIds = commentLikes.map((like) => like._id);

    // Удаляем лайки, связанные с этим постом
    await PostLike.deleteMany({ post: postId });

    // Удаляем лайки, связанные с комментариями этого поста
    await CommentLike.deleteMany({ post: postId });

    const deletePost = await Post.findOneAndDelete({ _id: postId });
    if (!deletePost) {
      return res.status(400).json({ message: "Post was not delete" });
    }
    user.posts.splice(postIndex, 1);
    await user.save();

    // Обновляем модель Post, чтобы удалить все комментарии из массива 'comments'
    await Post.updateOne(
      { _id: postId },
      { $pull: { comments: { $in: deletePost.comments } } }
    );

    // Удаляем ссылки на лайки из модели User
    await User.updateMany(
      {
        $or: [
          { postLikes: { $in: postLikeIds } },
          { commentLikes: { $in: commentLikeIds } },
        ],
      },
      {
        $pull: {
          postLikes: { $in: postLikeIds },
          commentLikes: { $in: commentLikeIds },
        },
      }
    );

    res.status(200).json({ message: "Post was deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server internal error", error: error.message });
  }
}

export async function getPostById(req, res) {
  try {
    const { id: postId } = req.params;
    const post = await Post.findById(postId).populate("user");
    if (!post) {
      return res
        .status(404)
        .json({ message: `post with id ${postId} not found` });
    }
    res
      .status(200)
      .json({ message: `post with id ${postId} was found`, post: post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "server internal error", error: error.message });
  }
}

export async function updatePost(req, res) {
  try {
    const { id: postId } = req.params;
    const { description } = req.body;
    const userId = req.user.id;

    // Найдем пользователя
    const user = await User.findById(userId).populate("posts");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${userId} was not found` });
    }

    // Найдем пост
    const post = user.posts.find((post) => post._id.toString() === postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: `Post with id ${postId} was not found` });
    }

    // Обновим описание, если оно изменилось
    if (description && description !== post.description) {
      post.description = description;
    }

    // Обработаем файл изображения
    if (req.file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
        });
      }

      // Преобразуем изображение в base64
      const base64Image = req.file.buffer.toString("base64");
      const base64EncodedImage = `data:${req.file.mimetype};base64,${base64Image}`;
      post.image = base64EncodedImage; // Обновляем изображение поста
    }

    // Сохраняем изменения
    await post.save();

    // Возвращаем обновленный пост
    const populatedPost = await post.populate("user");

    res.status(200).json({
      message: "Post updated successfully",
      updatePost: populatedPost,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server internal error", error });
  }
}

export async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().populate("user");
    if (posts.length === 0) {
      return res.status(200).json({ message: "No posts found", posts: [] });
    }
    res.status(200).json({ message: `Was found ${posts.length} post`, posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server internal error", error: error.message });
  }
}
