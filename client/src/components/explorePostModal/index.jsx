import PropTypes from "prop-types";
import User from "../../assets/icons/user.svg";
import Like from "../../assets/icons/like.svg";
import Comment from "../../assets/icons/comment.svg";
import Smile from "../../assets/icons/smile.svg";
import styles from "./styles.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllCommentsByPost } from "../../redux/slices/commentsSlice";
import { useState } from "react";
import { addComment } from "../../redux/slices/commentsSlice";
import { getPostLikes, togglePostLike } from "../../redux/slices/likeSlice";

function ExplorePostModal({ post, closeModal, isOpenModal }) {
  console.log(post, "POST");
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comments);
  const { postLikesCount, userPostLikes } = useSelector((state) => state.likes);
  console.log(userPostLikes, "userPostLikes");

  // const user = useSelector((state) => state.user.user);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(userPostLikes || false);
  console.log(isLiked, "isLiked");
  useEffect(() => {
    if (post && isOpenModal) {
      dispatch(getAllCommentsByPost(post._id));
      dispatch(getPostLikes(post._id));
    }
  }, [dispatch, post, isOpenModal]);

  useEffect(() => {
    if (userPostLikes !== undefined) {
      setIsLiked(userPostLikes); // Обновляем состояние лайка только после того, как данные о лайке были загружены
    }
  }, [userPostLikes]);

  if (!isOpenModal) return null;

  const handleAddComment = async () => {
    if (!post.user || !post.user._id) {
      setError("User not found");
      return;
    }

    const commentToSend = newComment.trim() || "";

    try {
      await dispatch(
        addComment({
          postId: post._id,
          commentText: commentToSend,
        })
      );
      setNewComment("");
      dispatch(getAllCommentsByPost(post._id));
    } catch (error) {
      console.log(error);
      setError("Error adding comment");
    }
  };

  const handleTogglePostLike = async () => {
    if (!post.user || !post.user._id) {
      setError("User not found");
      return;
    }

    try {
      const response = await dispatch(
        togglePostLike({
          postId: post._id,
        })
      ).unwrap();

      // Обновляем состояние лайка только на основании количества лайков
      console.log(response.liked, "response.liked");
      if (response.liked) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }

      // Обновить количество лайков
      dispatch(getPostLikes(post._id));
    } catch (error) {
      console.log(error);
      setError("Error toggling post like");
    }
  };

  return (
    <div className={styles.modalContainer} onClick={closeModal}>
      <div
        className={styles.postContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.leftContainer}>
          <div className={styles.postImgContainer}>
            <img src={post.image} alt="post image" className={styles.image} />
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.infoContainer}>
            <div className={styles.userInfo}>
              <img
                src={post.user?.avatar || User}
                alt="user photo"
                className={styles.userPhoto}
              />
              <div className={styles.username}>{post?.user?.username}</div>
            </div>
            <button className={styles.optionBtn}>...</button>
          </div>
          <div className={styles.descriptionInfoContainer}>
            <div className={styles.descriptionContainer}>
              <img
                src={post.user?.avatar || User}
                alt="user photo"
                className={styles.userPhoto}
              />
              <div className={styles.description}>
                <span className={styles.username}>{post.user?.username}</span>
                <span className={styles.descriptionInfo}>
                  {post.description}
                </span>
              </div>
            </div>
            <div className={styles.dayInfo}>1 day</div>
          </div>
          <div className={styles.likesCountContainer}>
            <div className={styles.liksAndMessageIcons}>
              {console.log(isLiked, "ISLIKED")}
              <img
                src={Like}
                alt="like"
                className={`${styles.like} ${
                  isLiked ? styles.liked : styles.like
                }`}
                onClick={handleTogglePostLike}
              />
              <img src={Comment} alt="comment" className={styles.comment} />
            </div>
            <div>{postLikesCount[post._id] || 0} likes</div>
            <div className={styles.dayInfo}>1 day</div>
          </div>

          <div className={styles.commentsContainer}>
            {loading && <div>Loading comments...</div>}
            {error && <div>Error loading comments: {error}</div>}
            {!loading && (comments?.length === 0 || !comments) && (
              <div>No comments</div>
            )}
            {!loading && comments?.length > 0 && (
              <div>
                {comments?.map((comment) => (
                  <div
                    key={
                      comment?._id || `comment-${Math.random()}-${Date.now()}`
                    }
                    className={styles.commentItem}
                  >
                    <div className={styles.commentHeader}>
                      <img
                        src={comment?.user?.avatar || User}
                        alt="User avatar"
                        className={styles.userPhoto}
                      />
                      <span className={styles.username}>
                        {comment?.user?.username}
                      </span>
                    </div>
                    <div className={styles.commentText}>
                      {comment?.commentText}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.addComment}>
            <img src={Smile} alt="smile" />
            <input
              type="text"
              placeholder="Add a comment..."
              className={styles.commentInput}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className={styles.sendBtn} onClick={handleAddComment}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ExplorePostModal.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string, // Идентификатор поста
    description: PropTypes.string, // Описание поста
    image: PropTypes.string, // Изображение поста
    user: PropTypes.shape({
      _id: PropTypes.string, // Идентификатор пользователя
      username: PropTypes.string, // Имя пользователя
      avatar: PropTypes.string, // Аватар пользователя
    }),
    comments: PropTypes.arrayOf(PropTypes.string), // Список комментариев
  }),
  closeModal: PropTypes.func, // Функция для закрытия модального окна
  isOpenModal: PropTypes.bool, // Флаг, показывающий, открыто ли модальное окно
};

export default ExplorePostModal;
