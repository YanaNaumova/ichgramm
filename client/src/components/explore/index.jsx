import styles from "./styles.module.css";
import { getRandomPosts } from "../../redux/slices/postsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import store from "../../redux/store";
import ExpolrePostModal from "../../components/explorePostModal";
import { useState } from "react";

function Explore() {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

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
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsOpenModal(false);
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
        <ExpolrePostModal
          post={selectedPost}
          isOpenModal={isOpenModal}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}
export default Explore;
