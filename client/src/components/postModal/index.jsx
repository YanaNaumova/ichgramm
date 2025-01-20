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
import {
  getPostLikes,
  togglePostLike,
  getCommentLikes,
  toggleCommentLike,
} from "../../redux/slices/likeSlice";
import PostDialog from "../postDialog";

function PostModal({ post, closeModal, isOpenModal }) {
  console.log(post.user, "POST.USER");
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comments);
  console.log(comments, "COMMENTS");
  const { postLikesCount, userPostLikes, commentLikesCount, userCommentLikes } =
    useSelector((state) => state.likes);
  console.log(userCommentLikes, "userCommentLikes");
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(userPostLikes?.[post?._id] || false);
  const [likedComments, setLikedComments] = useState(userCommentLikes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function openDialog() {
    setIsDialogOpen(true);
  }

  function closeDialog() {
    setIsDialogOpen(false);
  }

  function timeAgo(postDate) {
    const postDateObj = new Date(postDate); // Convert the string to a Date object
    const currentDate = new Date(); // Get the current date
    const diffInMilliseconds = currentDate - postDateObj; // Difference in milliseconds

    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60)); // Difference in minutes
    const diffInHours = Math.floor(diffInMinutes / 60); // Difference in hours
    const diffInDays = Math.floor(diffInHours / 24); // Difference in days

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""}`; // "1 day" or "2 days"
    } else if (diffInHours > 0) {
      return `${diffInHours} h.`; // "3 h." or "12 h."
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} min.`; // "45 min." or "1 min."
    } else {
      return "just now"; // If the difference is less than a minute
    }
  }

  useEffect(() => {
    if (post && isOpenModal) {
      dispatch(getAllCommentsByPost(post?._id));
      dispatch(getPostLikes(post?._id));
    }
  }, [dispatch, post, isOpenModal]);

  useEffect(() => {
    if (comments && comments.length > 0) {
      // Фильтруем только те комментарии, которые относятся к текущему посту
      comments
        .filter((comment) => comment?.post === post?._id) // Убедитесь, что comment.post === post._id
        .forEach((comment) => {
          dispatch(
            getCommentLikes({ postId: post?._id, commentId: comment?._id })
          );
        });
    }
  }, [dispatch, comments, post]);

  useEffect(() => {
    if (userPostLikes && post?._id) {
      setIsLiked(userPostLikes[post?._id] || false); // Устанавливаем лайк для текущего поста
    }
  }, [userPostLikes, post]);

  useEffect(() => {
    // Обновление likedComments при изменении userCommentLikes
    if (comments && userCommentLikes) {
      setLikedComments((prevState) => {
        const updatedState = { ...prevState };
        comments
          .filter((comment) => comment?.post === post?._id) // Только для комментариев этого поста
          .forEach((comment) => {
            // Обновляем состояние likedComments для текущего комментария
            updatedState[post?._id] = {
              ...updatedState[post?._id], // сохраняем предыдущие лайки для этого поста
              [comment?._id]:
                userCommentLikes[post?._id]?.[comment?._id] || false, // ставим значение лайка для текущего комментария
            };
          });
        return updatedState;
      });
    }
  }, [userCommentLikes, comments, post]);

  if (!isOpenModal) return null;

  const handleAddComment = async () => {
    if (!post?.user || !post?.user?._id) {
      setError("User not found");
      return;
    }

    const commentToSend = newComment.trim() || "";

    try {
      await dispatch(
        addComment({
          postId: post?._id,
          commentText: commentToSend,
        })
      );
      setNewComment("");
      dispatch(getAllCommentsByPost(post?._id));
    } catch (error) {
      console.log(error);
      setError("Error adding comment");
    }
  };

  const handleTogglePostLike = async () => {
    if (!post?.user || !post?.user?._id) {
      setError("User not found");
      return;
    }

    try {
      const response = await dispatch(
        togglePostLike({
          postId: post?._id,
        })
      ).unwrap();

      // Обновляем состояние лайка только на основании количества лайков

      setIsLiked(response.liked);

      // Обновить количество лайков
      dispatch(getPostLikes(post?._id));
    } catch (error) {
      console.log(error);
      setError("Error toggling post like");
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    if (!post?._id || !commentId) {
      setError("Invalid post or comment ID");
      return;
    }
    try {
      const response = await dispatch(
        toggleCommentLike({
          postId: post?._id,
          commentId,
        })
      ).unwrap();

      setLikedComments((prevState) => ({
        ...prevState,
        [post?._id]: {
          ...prevState[post?._id], // сохраняем предыдущие лайки для других комментариев этого поста
          [commentId]: response.liked, // обновляем лайк для текущего комментария
        },
      }));

      dispatch(
        getCommentLikes({
          postId: post?._id,
          commentId,
        })
      );
    } catch (error) {
      console.log(error);
      setError("Error toggling comment like");
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
          <div>
            <div className={styles.infoContainer}>
              <div className={styles.userInfo}>
                <img
                  src={post?.user?.avatar || User}
                  alt="user photo"
                  className={styles.userPhoto}
                />
                <div className={styles.username}>{post?.user?.username}</div>
              </div>
              <button className={styles.optionBtn} onClick={openDialog}>
                ...
              </button>
            </div>
            <div className={styles.descriptionInfoContainer}>
              <div className={styles.descriptionContainer}>
                <img
                  src={post?.user?.avatar || User}
                  alt="user photo"
                  className={styles.userPhoto}
                />
                <div className={styles.description}>
                  <span className={styles.username}>
                    {post?.user?.username}
                  </span>
                  <span className={styles.descriptionInfo}>
                    {post.description}
                  </span>
                  <div className={styles.dayInfo}>
                    {timeAgo(post?.createAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.commentsContainer}>
              {loading && <div>Loading comments...</div>}
              {error && <div>Error loading comments: {error}</div>}
              {!loading && (comments?.length === 0 || !comments) && (
                <div>No comments</div>
              )}
              {!loading && comments?.length > 0 && (
                <div className={styles.comments}>
                  {comments?.map((comment) => (
                    <div
                      key={
                        comment?._id || `comment-${Math.random()}-${Date.now()}`
                      }
                      className={styles.commentItemContainer}
                    >
                      <div className={styles.commentItem}>
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
                        <div className={styles.commentTextContainer}>
                          <div className={styles.commentText}>
                            {comment?.commentText}
                          </div>
                          <img
                            src={Like}
                            alt="like"
                            className={`${styles.smallLike} ${
                              likedComments[post?._id]?.[comment?._id]
                                ? styles.smallLiked
                                : ""
                            }`}
                            onClick={() =>
                              handleToggleCommentLike(comment?._id)
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.likeAndTimeContainer}>
                        <span className={styles.dayInfoLike}>
                          {timeAgo(comment?.createAt)}
                        </span>
                        <span className={styles.commentLikesCount}>
                          {commentLikesCount?.[post?._id]?.[comment?._id] || 0}{" "}
                          likes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className={styles.likesCountContainer}>
              <div className={styles.liksAndMessageIcons}>
                <img
                  src={Like}
                  alt="like"
                  className={`${styles.like} ${isLiked ? styles.liked : ""}`}
                  onClick={handleTogglePostLike}
                />
                <img src={Comment} alt="comment" className={styles.comment} />
              </div>
              <div className={styles.postCount}>
                {postLikesCount[post?._id] || 0} likes
              </div>
              <div className={styles.dayInfo}>{timeAgo(post?.createAt)}</div>
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
      {isDialogOpen && (
        <PostDialog
          onCloseDialog={closeDialog}
          isDialogOpen={isDialogOpen}
          post={post}
          closedModal={closeModal}
        />
      )}
    </div>
  );
}

PostModal.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string, // Идентификатор поста
    description: PropTypes.string, // Описание поста
    image: PropTypes.string, // Изображение поста
    createAt: PropTypes.string,
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

export default PostModal;
