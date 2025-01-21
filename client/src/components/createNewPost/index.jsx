import styles from "./styles.module.css";
import Upload from "../../assets/icons/upload.svg";
import User from "../../assets/icons/user.svg";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../redux/slices/postsSlice";
import { getProfile } from "../../redux/slices/userSlice";
import { useEffect } from "react";

function CreateNewPost({ closeModal }) {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPostSucess, setPostSucess] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { posts, loading, error } = useSelector((state) => state.posts);
  console.log(posts, "posts");
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handelDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      return;
    }
    try {
      await dispatch(createPost({ description, image }));
      dispatch(getProfile());
      setMessage("Post created successfully!");
      setPostSucess(true);
      setTimeout(() => {
        closeModal();
      }, 1000);
      setDescription("");
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      setMessage("Error creating post. Please try again.");
      setPostSucess(false);
      console.log(err);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [message]);
  return (
    <div className={styles.modalContainer}>
      <div className={styles.createNewPostContainer}>
        <div className={styles.header}>
          <p>Create new post</p>
          <button className={styles.cancelBtn} onClick={closeModal}>
            Cancel
          </button>
        </div>
        {message && (
          <div
            className={
              isPostSucess ? styles.messageSuccess : styles.messageError
            }
          >
            {message}
          </div>
        )}
        <form className={styles.postFormContainer} onSubmit={handleSubmit}>
          <div className={styles.uploadContainer}>
            <img src={Upload} className={styles.uploadImg} alt="upload" />
            <input
              type="file"
              accept="image/*"
              className={styles.uploadInput}
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className={styles.previewContainer}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.previewImage}
                />
              </div>
            )}
          </div>
          <div className={styles.detailsContainer}>
            <div className={styles.userInfoContainer}>
              <img
                src={user?.avatar || User}
                alt="user"
                className={`${styles.userImg} ${styles.gradient}`}
              />
              <p className={styles.userName}>{user?.username}</p>
            </div>
            <textarea
              className={styles.textarea}
              placeholder="Write a caption..."
              maxLength="200"
              value={description}
              onChange={handelDescriptionChange}
            />
            <div className={styles.btnContainer}>
              <button
                type="submit"
                className={styles.shareButton}
                disabled={loading}
              >
                {loading ? "Posting..." : "Share"}
              </button>
            </div>
          </div>
        </form>
        {error && <p className={styles.error}>{error.message || error}</p>}
      </div>
    </div>
  );
}
CreateNewPost.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default CreateNewPost;
