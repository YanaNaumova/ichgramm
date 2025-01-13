import styles from "./styles.module.css";
import User from "../../assets/icons/user.svg";

function EditProfile() {
  return (
    <form className={styles.editProfileFormContainer}>
      <h3 className={styles.editProfileHeader}>Edit profile</h3>
      <div className={styles.editProfileImageFormContainer}>
        <img src={User} alt="User Photo" className={styles.userPhoto} />
        <div className={styles.userInfo}>
          <div className={styles.userName}>ichschool</div>
          <div className={styles.userBio}>
            Гарантия помощи с трудоустройством в ведущие IT-компании
          </div>
        </div>
        <button className={styles.addPhotoBtn}>New photo</button>
      </div>
      <label>
        Username
        <input type="text" className={styles.input} />
      </label>
      <label>
        Website
        <input type="text" className={styles.input} />
      </label>
      <label>
        About
        <textarea type="text" className={styles.textarea} maxLength={150} />
      </label>
      <button type="submit" className={styles.submitBtn}>
        Save
      </button>
    </form>
  );
}

export default EditProfile;
