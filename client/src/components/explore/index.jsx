import styles from "./styles.module.css";
import { getRandomPosts } from "../../redux/slices/postsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import store from "../../redux/store";
import PostModal from "../postModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Explore() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  console.log(selectedPost, "selectedPost");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getRandomPosts());
      } catch (error) {
        console.error("Error fetching random posts:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleImageClick = (post) => {
    setSelectedPost(post);
    setIsOpenModal(true);
    navigate(`post/${post._id}`);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsOpenModal(false);
    navigate(-1);
  };

  console.log("Текущее состояние стора в profile:", store.getState());
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.exploreContainer}>
      <div className={styles.contentContainer}>
        {posts.map((post) => (
          <div
            key={post?._id}
            className={styles.postContainer}
            onClick={() => handleImageClick(post)}
          >
            <img
              src={post?.image}
              alt={post?.description || "Post description"}
              className={styles.image}
            />
          </div>
        ))}
      </div>
      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpenModal={isOpenModal}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}
export default Explore;
