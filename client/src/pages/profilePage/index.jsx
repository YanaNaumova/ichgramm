import styles from "./styles.module.css";
import Profile from "../../components/profile";

function ProfilePage() {
  return (
    <div className={styles.profilePageContainer}>
      <Profile />
    </div>
  );
}

export default ProfilePage;
