import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/slices/userSlice";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import User from "../../assets/icons/user.svg";
import { useEffect } from "react";
import store from "../../redux/store";

function Profile() {
  const { user, loading, error } = useSelector((state) => {
    console.log(state.user, "state");
    return state.user;
  });
  console.log(user?.username, "user");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("Текущее состояние стора:", store.getState());
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  // console.log(user, "user");
  console.log(loading, "loading");
  console.log(error, "error");

  return (
    <div className={styles.userProfileContainer}>
      <div className={styles.userProfileInfoAndPhotoContainer}>
        <img src={User} alt="user photo" className={styles.userPhoto} />
        <div className={styles.userProfileInfoContainer}>
          <div className={styles.btnContainer}>
            <div className={styles.userName}>{user?.username}</div>
            <button className={styles.editProfileBtn}>Edit profile</button>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className={styles.postsAndFollowersInfo}>
            <div className={styles.postsInfo}>
              <div className={styles.postsNumber}>129</div> posts
            </div>
            <div className={styles.followerInfo}>
              <div className={styles.followerNumber}>9993</div> followers
            </div>
            <div className={styles.followingInfo}>
              <div className={styles.followingNumber}>59</div> following
            </div>
          </div>
          <div className={styles.profileDescription}>
            Гарантия помощи с трудоустройством в ведущие IT-компании Выпускники
            зарабатывают от 45к евро БЕСПЛАТНАЯ
          </div>
        </div>
      </div>
      <div className={styles.userProfilePosts}></div>
    </div>
  );
}

export default Profile;
