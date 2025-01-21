import styles from "./styles.module.css";
import User from "../../assets/icons/user.svg";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, getProfile } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function EditProfile() {
  const { user, loading, error } = useSelector((state) => state.user);
  console.log(loading, error, "loading", "error");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || "");
  const [profileImage, setProfileImage] = useState(user?.avatar || "");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [webSite, setWebSite] = useState(user?.webSite || "");
  const [bio, setBio] = useState(user?.biography || "");
  const [count, setCount] = useState(bio.length);

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setProfileImage(user.avatar || "");
      setWebSite(user.webSite || "");
      setBio(user.biography || "");
      setCount(user.biography?.length || 0);
    }
  }, [user]);

  async function handelSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (profileImageFile) formData.append("avatar", profileImageFile);
      formData.append("username", username);
      formData.append("webSite", webSite);
      formData.append("biography", bio);

      const response = await dispatch(updateProfile(formData));
      if (updateProfile.fulfilled.match(response)) {
        navigate("/profile");
      }
      localStorage.setItem("user", JSON.stringify(response.payload));
    } catch (error) {
      console.error("Error updating user profile", error);
    }
  }

  function handelSetBio(e) {
    setBio(e.target.value);
    setCount(e.target.value.length);
  }

  function handleChangeImage(e) {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
  return (
    <form className={styles.editProfileFormContainer} onSubmit={handelSubmit}>
      <h3 className={styles.editProfileHeader}>Edit profile</h3>
      <div className={styles.editProfileImageFormContainer}>
        <img
          src={profileImage || User}
          alt="User Photo"
          className={styles.userPhoto}
        />
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.username}</div>
          <div className={styles.userBio}>{bio}</div>
        </div>
        <label className={styles.addPhotoBtn}>
          New photo
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChangeImage}
          />
        </label>
      </div>
      <label>
        Username
        <input
          type="text"
          value={username}
          className={styles.input}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Website
        <input
          type="text"
          value={webSite}
          className={styles.input}
          onChange={(e) => {
            setWebSite(e.target.value);
          }}
        />
      </label>
      <label>
        About
        <textarea
          type="text"
          value={bio}
          className={styles.textarea}
          maxLength={150}
          onChange={handelSetBio}
        />
        <div className={styles.count}>{count} / 150</div>
      </label>
      <button type="submit" className={styles.submitBtn}>
        Save
      </button>
    </form>
  );
}

export default EditProfile;
