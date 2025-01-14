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
  console.log(user?.posts, "user");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("Текущее состояние стора в profile:", store.getState());
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleEditProfie = () => {
    navigate("/profile/edit");
  };
  // console.log(user, "user");
  console.log(loading, "loading");
  console.log(error, "error");

  if (loading) {
    console.log("isLoading: ", loading);
    return <div>Loading...</div>;
  }

  if (error) {
    console.log("error: ", error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.userProfileContainer}>
      <div className={styles.userProfileInfoAndPhotoContainer}>
        <img
          src={user?.avatar || User}
          alt="user photo"
          className={styles.userPhoto}
        />
        <div className={styles.userProfileInfoContainer}>
          <div className={styles.btnContainer}>
            <div className={styles.userName}>{user?.username}</div>
            <button
              className={styles.editProfileBtn}
              onClick={handleEditProfie}
            >
              Edit profile
            </button>
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
          <div className={styles.profileDescription}>{user?.biography}</div>
          <a href="#" className={styles.website}>
            {user?.webSite}
          </a>
        </div>
      </div>
      <div className={styles.userProfilePostsContainer}>
        {user?.posts?.length > 0 ? (
          user.posts.map((post, index) => (
            <img
              key={index}
              src={post?.image}
              alt="posts"
              className={styles.postImage}
            />
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
