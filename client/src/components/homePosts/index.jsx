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
import PostModal from "../postModal";
import { useNavigate } from "react-router-dom";
import store from "../../redux/store";
import {
  getUserFollowings,
  getUserFollowers,
  addFollowing,
  deleteFollowing,
} from "../../redux/slices/followSlice";

function HomePosts() {
  const { posts, loading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.user);
  const { postLikesCount, userPostLikes } = useSelector((state) => state.likes);
  const [likedPosts, setLikedPosts] = useState(userPostLikes);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  console.log(loading, error);
  const limit = 30;
  const { followings } = useSelector((state) => state.follow);
  const [isFollowing, setIsFollowing] = useState({});

  console.log(followings, "followings");

  console.log(posts, "POSTS");

  useEffect(() => {
    const fetchPostsAndLikes = async () => {
      try {
        const response = await dispatch(getAllPosts()).unwrap(); // Используем unwrap() для получения данных без обертки
        if (response?.posts?.length) {
          for (const post of response.posts) {
            await dispatch(getPostLikes(post._id)); // Ждем загрузки лайков для каждого поста
            await dispatch(getAllCommentsByPost(post._id));
            await dispatch(getUserFollowers());
            await dispatch(getUserFollowings());
          }
        }
      } catch (error) {
        console.error("Error fetching posts or likes:", error);
      }
    };

    fetchPostsAndLikes();
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (followings?.length) {
      const followingStatus = {};

      // Заполняем followingStatus только для пользователей из followings
      followings.forEach((follow) => {
        followingStatus[follow.following] = true; // Подписаны на этого пользователя
      });

      setIsFollowing(followingStatus);
    }
  }, [followings]);

  useEffect(() => {
    // Инициализация локального состояния лайков
    if (userPostLikes) {
      setLikedPosts(userPostLikes);
    }
  }, [userPostLikes]);

  const handleImageClick = async (post) => {
    setSelectedPost(post);
    setIsOpenModal(true);
    navigate(`post/${post._id}`);
  };

  const closeModal = async () => {
    setSelectedPost(null);
    setIsOpenModal(false);
    await dispatch(getAllPosts());
    navigate(-1);
  };

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

  const handleUnfollow = async (followId) => {
    try {
      await dispatch(deleteFollowing(followId));
      // После успешного удаления подписки, обновляем состояние followings
      await dispatch(getUserFollowings());
      await dispatch(getUserFollowers());
    } catch (error) {
      console.log("Error unfollowing:", error);
      setError("Error unfollowing user.");
    }
  };

  const handleFollow = async (followId) => {
    try {
      await dispatch(addFollowing(followId));
      // После успешного добавления подписки, обновляем состояние followings
      await dispatch(getUserFollowings());
      await dispatch(getUserFollowers());
    } catch (error) {
      console.log("Error following:", error);
      setError("Error following user.");
    }
  };
  const handleClickToFollow = async (e, postUserId) => {
    e.stopPropagation();
    const isUserFollowing = isFollowing[postUserId];

    try {
      if (isUserFollowing) {
        // Если подписаны, отписываемся
        await handleUnfollow(postUserId);
      } else {
        // Если не подписаны, подписываемся
        await handleFollow(postUserId);
      }

      // Локально обновляем состояние после выполнения действия
      setIsFollowing((prev) => ({
        ...prev,
        [postUserId]: !isUserFollowing, // Инвертируем состояние подписки
      }));
    } catch (error) {
      console.error("Error handling follow/unfollow:", error);
      setError("Error updating follow status.");
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };
  console.log("Home:", store.getState().user);

  // const isFollowing = followings.some((following) => {
  //   return following?.following?.toString() === post?.user?._id.toString();
  // });

  // console.log(isFollowing, "isFollowing");
  return (
    <div className={styles.postsContainer}>
      {posts?.map((post) => {
        const isUserFollowing = isFollowing[post?.user?._id];
        return (
          <div className={styles.postContainer} key={post?._id}>
            <div className={styles.userInfo}>
              <img
                src={post?.user?.avatar || User}
                alt="user photo"
                className={`${styles.userPhoto} ${styles.gradient}`}
                onClick={() => handleUserClick(post?.user?._id)}
              />
              <div className={styles.username}>{post?.user?.username}</div>
              <div className={styles.time}>{`• ${timeAgo(
                post.createAt
              )} •`}</div>
              {post.user._id !== user?._id && ( // Если это не пост текущего пользователя
                <button
                  className={styles.followBtn}
                  onClick={(e) => handleClickToFollow(e, post?.user?._id)}
                >
                  {isUserFollowing ? "Unfollow" : "Follow"}{" "}
                  {/* Кнопка подписки/отписки */}
                </button>
              )}
            </div>
            <img
              src={post?.image}
              alt={post?.description}
              className={styles.postImg}
              onClick={() => handleImageClick(post)}
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
                {post?.description?.length > limit
                  ? `${post?.description.slice(0, limit)}...` // Убедитесь, что slice вызывается на строке, а не на длине
                  : post?.description}
              </div>

              {post?.description?.length > limit && ( // Условие для отображения кнопки "more"
                <button
                  className={styles.moreBtn}
                  onClick={() => handleImageClick(post)}
                >
                  more
                </button>
              )}
            </div>
            <button
              className={styles.commentsContainer}
              onClick={() => handleImageClick(post)}
            >
              {post?.comments?.length > 0
                ? ` View all comments (${post?.comments?.length})`
                : `No comments`}
            </button>
          </div>
        );
      })}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpenModal={isOpenModal}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default HomePosts;
