import styles from "./styles.module.css";
import Profile from "../../components/profile";
import Footer from "../../components/footer";

function ProfilePage() {
  return (
    <div className={styles.profilePageContainer}>
      <Profile />
      <Footer />
    </div>
  );
}

export default ProfilePage;
