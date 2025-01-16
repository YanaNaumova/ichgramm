import styles from "./styles.module.css";
import { getRandomPosts } from "../../redux/slices/postsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import store from "../../redux/store";
// import ExpolrePostModal from "../../components/explorePostModal";

function Explore() {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  console.log(posts, "posts");
  //   const [selectedPost, setSelectedPost] = useState(null);
  //   const [isOpenModal, setIsOpenModal] = useState(false);
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

  //   const handleImageClick = (post) => {
  //     selectedPost(post);
  //     setIsOpenModal(true);
  //   };

  //   const closeModal = () => {
  //     setSelectedPost(null);
  //     setIsOpenModal(false);
  //   };
  console.log("Текущее состояние стора в profile:", store.getState());
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.exploreContainer}>
      <div className={styles.contentContainer}>
        {posts.map((post) => (
          <div key={post?._id} className={styles.postContainer}>
            <img
              src={post?.image}
              alt={post?.description || "Post image"}
              className={styles.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default Explore;
