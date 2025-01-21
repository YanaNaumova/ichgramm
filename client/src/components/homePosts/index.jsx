import { useSelector } from "react-redux";
import styles from "./styles.module.css";
import { getAllPosts } from "../../redux/slices/postsSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import User from "../../assets/icons/user.svg";
import { timeAgo } from "../../helpers";
import Like from "../../assets/icons/like.svg";
import Comment from "../../assets/icons/comment.svg";
import { getPostLikes, togglePostLike } from "../../redux/slices/likeSlice";
import { useState } from "react";
import { getAllCommentsByPost } from "../../redux/slices/commentsSlice";

function HomePosts() {
  const { posts, loading } = useSelector((state) => state.posts);
  const { postLikesCount, userPostLikes } = useSelector((state) => state.likes);
  const [likedPosts, setLikedPosts] = useState(userPostLikes);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  console.log(posts, loading, error);
  const limit = 30;

  useEffect(() => {
    const fetchPostsAndLikes = async () => {
      try {
        const response = await dispatch(getAllPosts()).unwrap(); // Используем unwrap() для получения данных без обертки
        if (response?.posts?.length) {
          for (const post of response.posts) {
            await dispatch(getPostLikes(post._id)); // Ждем загрузки лайков для каждого поста
            await dispatch(getAllCommentsByPost(post._id));
          }
        }
      } catch (error) {
        console.error("Error fetching posts or likes:", error);
      }
    };

    fetchPostsAndLikes();
  }, [dispatch]);

  useEffect(() => {
    // Инициализация локального состояния лайков
    if (userPostLikes) {
      setLikedPosts(userPostLikes);
    }
  }, [userPostLikes]);

  const handleTogglePostLike = async (postId) => {
    try {
      const response = await dispatch(togglePostLike({ postId })).unwrap();

      // Обновляем локальное состояние на основе результата запроса
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: response.liked, // Обновляем статус лайка
      }));

      // Обновить количество лайков
      dispatch(getPostLikes(postId));
    } catch (error) {
      console.log(error);
      setError("Error toggling post like");
    }
  };

  return (
    <div className={styles.postsContainer}>
      {posts.map((post) => (
        <div className={styles.postContainer} key={post?._id}>
          <div className={styles.userInfo}>
            <img
              src={post?.user?.avatar || User}
              alt="user photo"
              className={styles.userPhoto}
            />
            <div className={styles.username}>{post?.user?.username}</div>
            <div className={styles.time}>{`${timeAgo(post.createAt)}`}</div>
            <button className={styles.followBtn}>follow</button>
          </div>
          <img
            src={post?.image}
            alt={post?.description}
            className={styles.postImg}
          />
          <div className={styles.likeUndCommentContainer}>
            <div className={styles.likeUndCommentImgContainer}>
              <img
                src={Like}
                alt="like"
                className={`${styles.like} ${
                  likedPosts[post?._id] ? styles.liked : "" // Меняем цвет сердечка
                }`}
                onClick={() => handleTogglePostLike(post?._id)}
              />
              <img src={Comment} alt="like" className={styles.commentImg} />
            </div>
            <div className={styles.likeCount}>
              {postLikesCount[post?._id] || 0} likes
            </div>
          </div>
          <div className={styles.postDescriptionContainer}>
            <div className={styles.fullName}>{post?.user?.full_name}</div>

            <div className={styles.description}>
              {post?.description.length > limit
                ? `${post?.description.slice(0, limit)}...` // Убедитесь, что slice вызывается на строке, а не на длине
                : post?.description}
            </div>

            {post?.description.length > limit && ( // Условие для отображения кнопки "more"
              <button className={styles.moreBtn}>more</button>
            )}
          </div>
          <button className={styles.commentsContainer}>
            {post?.comments?.length > 0
              ? ` View all comments (${post?.comments?.length})`
              : `No comments`}
          </button>
        </div>
      ))}
    </div>
  );
}

export default HomePosts;
