import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../../redux/slices/selectedUserSlice";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import User from "../../assets/icons/user.svg";
import { useEffect } from "react";
import store from "../../redux/store";
import PostModal from "../postModal";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getByUserIdPosts } from "../../redux/slices/postsSlice";
import { getProfile } from "../../redux/slices/userSlice";
import { getFollowers, getFollowings } from "../../redux/slices/followSlice";

function OtherProfile() {
  const { selectedUser, loading, error } = useSelector((state) => {
    return state.selectedUser;
  });
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const { followersCount, followingsCount } = useSelector(
    (state) => state.follow
  );
  console.log(followingsCount, "followingsCount");
  console.log(followersCount, "followersCount");

  const { userId } = useParams(); //пользователь другой
  const [selectedPost, setSelectedPost] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user?._id) {
        await dispatch(getProfile());
      }
    };
    fetchUserProfile();
  }, [user, dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
      dispatch(getByUserIdPosts(userId));
      dispatch(getFollowers(userId));
      dispatch(getFollowings(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user && user?._id === userId) {
      navigate("/profile");
    }
  }, [user?._id, userId, user, navigate]);
  // console.log(":", store.getState());

  const handleMessage = () => {
    navigate("/messages");
  };

  const handleFollow = () => {
    console.log("follow");
  };

  const handleImageClick = (post) => {
    setSelectedPost(post);
    setIsOpenModal(true);
    navigate(`post/${post._id}`);
  };

  const closeModal = async () => {
    setSelectedPost(null);
    setIsOpenModal(false);
    await dispatch(getUserById(userId));
    await dispatch(getByUserIdPosts(userId));
    await dispatch(getProfile());
    navigate(-1);
  };

  if (!user || !user?._id || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>{error.message || "An error occurred"}</div>
    );
  }

  if (!selectedUser) {
    return <div className={styles.error}>User not found or invalid ID</div>;
  }
  console.log("profile:", store.getState().user); // Текущее состояние
  return (
    <>
      {selectedUser ? (
        <div className={styles.userProfileContainer}>
          <div className={styles.userProfileInfoAndPhotoContainer}>
            <img
              src={selectedUser?.avatar || User}
              alt="user photo"
              className={`${styles.userPhoto} ${styles.gradient}`}
            />
            <div className={styles.userProfileInfoContainer}>
              <div className={styles.btnContainer}>
                <div className={styles.userName}>{selectedUser?.username}</div>
                <button
                  className={styles.editProfileBtn}
                  onClick={handleFollow}
                >
                  Follow
                </button>
                <button className={styles.logoutBtn} onClick={handleMessage}>
                  Message
                </button>
              </div>
              <div className={styles.postsAndFollowersInfo}>
                <div className={styles.postsInfo}>
                  <div className={styles.postsNumber}>129</div> posts
                </div>
                <div className={styles.followerInfo}>
                  <div className={styles.followerNumber}>{followersCount}</div>
                  followers
                </div>
                <div className={styles.followingInfo}>
                  <div className={styles.followingNumber}>
                    {followingsCount}
                  </div>
                  following
                </div>
              </div>
              <div className={styles.profileDescription}>
                {selectedUser?.biography}
              </div>
              <a href="#" className={styles.website}>
                {selectedUser?.webSite}
              </a>
            </div>
          </div>
          <div className={styles.userProfilePostsContainer}>
            {posts?.length > 0 ? (
              <>
                {posts?.map((post, index) => (
                  <img
                    key={index}
                    src={post?.image}
                    alt="posts"
                    className={styles.postImage}
                    onClick={() => handleImageClick(post)}
                  />
                ))}
              </>
            ) : (
              <p>No posts available</p>
            )}
          </div>
          {selectedPost && (
            <PostModal
              post={selectedPost}
              isOpenModal={isOpenModal}
              closeModal={closeModal}
            />
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default OtherProfile;
