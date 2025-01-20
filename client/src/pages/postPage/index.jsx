import styles from "./styles.module.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPostById } from "../../redux/slices/postsSlice";
import { useDispatch } from "react-redux";
import PostModal from "../../components/postModal";
import { useNavigate } from "react-router-dom";

function PostPage() {
  const { postId } = useParams();
  const { posts } = useSelector((state) => state.posts);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const post = posts.find((p) => p._id === postId);

  useEffect(() => {
    if (!post) {
      dispatch(getPostById(postId));
    }
  }, [dispatch, postId, post]);

  useEffect(() => {
    if (selectedPost) {
      // Переход к модальному окну поста после выбора поста
      navigate(`/post/${selectedPost._id}`);
    }
  }, [selectedPost, navigate]); // этот эффект срабатывает только при изменении selectedPost

  const handleImageClick = (post) => {
    setSelectedPost(post);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsOpenModal(false);
    navigate(-1); // Возвращаемся на предыдущую страницу
  };

  if (!post) return <div>Post not found</div>;

  return (
    <div className={styles.postContainer}>
      <div
        className={styles.postContainer}
        onClick={() => handleImageClick(post)}
      >
        <img
          src={post?.image}
          alt={post?.description || "Post description"}
          className={styles.image}
        />
      </div>
      {selectedPost && (
        <PostModal
          post={post}
          isOpenModal={isOpenModal}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default PostPage;
