import PropTypes from "prop-types";
import User from "../../assets/icons/user.svg";
import Like from "../../assets/icons/like.svg";
import Comment from "../../assets/icons/comment.svg";
import Smile from "../../assets/icons/smile.svg";
import styles from "./styles.module.css";

function ExplorePostModal({ post, closeModal, isOpenModal }) {
  if (!isOpenModal) return null;

  return (
    <div className={styles.modalContainer} onClick={closeModal}>
      <div className={styles.postContainer}>
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
              <div className={styles.username}>{post.user?.username}</div>
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
              <img src={Like} alt="like" className={styles.like} />
              <img src={Comment} alt="comment" className={styles.comment} />
            </div>
            <div>25 likes</div>
            <div className={styles.dayInfo}>1 day</div>
          </div>
          <div className={styles.addComment}>
            <img src={Smile} alt="smile" />
            <div>Add comment</div>
            <button className={styles.sendBtn}>Send</button>
          </div>
        </div>
      </div>
      {/* Кнопка для закрытия модального окна */}
      <button onClick={closeModal}>Close</button>
    </div>
  );
}

ExplorePostModal.propTypes = {
  post: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    user: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.string),
  }),
  closeModal: PropTypes.func,
  isOpenModal: PropTypes.bool,
};

export default ExplorePostModal;
