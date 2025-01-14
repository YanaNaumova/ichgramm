import styles from "./styles.module.css";
import Upload from "../../assets/icons/upload.svg";
import User from "../../assets/icons/user.svg";

function CreateNewPost() {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.createNewPostContainer}>
        <div className={styles.header}>
          <p>Create new post</p>
          <button className={styles.cancelBtn}>Cancel</button>
        </div>
        <form className={styles.postFormContainer}>
          <div className={styles.uploadContainer}>
            <img src={Upload} className={styles.uploadImg} alt="upload" />
            <input
              type="file"
              accept="image/*"
              className={styles.uploadInput}
            />
          </div>
          <div className={styles.detailsContainer}>
            <div className={styles.userInfoContainer}>
              <img src={User} alt="user" className={styles.userImg} />
              <p className={styles.userName}>ski_laba</p>
            </div>
            <textarea
              className={styles.textarea}
              placeholder="Write a caption..."
              maxLength="200"
            />
            <div className={styles.btnContainer}>
              <button className={styles.shareButton}>Share</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNewPost;
