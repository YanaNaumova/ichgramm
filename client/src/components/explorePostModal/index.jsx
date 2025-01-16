import styles from "./styles.module.css";
import PropTypes from "prop-types";
import User from "../../assets/icons/user.svg";
import Like from "../../assets/icons/like.svg";
import Comment from "../../assets/icons/comment.svg";
import Smile from "../../assets/icons/smile.svg";
import { useSelector } from "react-redux";
import store from "../../redux/store";

function ExplorePostModal({ post, isOpenModal, closeModal }) {
  const { user } = useSelector((state) => state.user);
  console.log("Текущее состояние стора в exploreModal:", store.getState());
  console.log(post, closeModal);
  if (!isOpenModal) return null;

  const handleOutsideClick = (e) => {
    if (e.target.className.includes(styles.modalContainer)) {
      closeModal();
    }
  };
  return (
    <div className={styles.modalContainer} onClick={handleOutsideClick}>
      <div
        className={styles.postContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.leftContainer}>
          <div className={styles.postImgContainer}>
            {console.log(post)}
            <img src={post?.image} alt="post image" className={styles.image} />
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.infoContainer}>
            <div className={styles.userInfo}>
              <img
                src={user?.avatar || User}
                alt="user photo"
                className={styles.userPhoto}
              />
              <div className={styles.username}>{user?.username}</div>
            </div>
            <button className={styles.optionBtn}>...</button>
          </div>
          <div className={styles.descriptionInfoContainer}>
            <div className={styles.descriptionContainer}>
              <img
                src={user?.avatar || User}
                alt="user photo"
                className={styles.userPhoto}
              />
              <div className={styles.description}>
                <span className={styles.username}>{user.username}</span>
                <span className={styles.descriptionInfo}>
                  Потрясающие новости пришли к нам из Черногории! Проект по
                  поддержке бездомных животных TailBook, в разработке которого
                  участвуют сразу 9 наших стажёров, будет представлен на Web
                  Summit 2024 в Португалии🔥
                </span>
              </div>
            </div>
            <div className={styles.dayInfo}>1 day</div>
          </div>
          <div className={styles.commentsContainer}>
            <div className={styles.commentInfo}>
              <img src={User} alt="user Photo" className={styles.userPhoto} />
              <div className={styles.username}>coach.tonia</div>
            </div>
            <div className={styles.comment}>спасибо!!!!</div>
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
    </div>
  );
}

ExplorePostModal.propTypes = {
  post: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    user: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.string),
    createAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
  }),
  isOpenModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ExplorePostModal;
