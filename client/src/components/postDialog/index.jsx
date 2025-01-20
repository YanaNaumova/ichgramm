import ConfirmDialog from "../../components/confirmDialog";
import styles from "./styles.module.css";
import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { deletePost } from "../../redux/slices/postsSlice";

function PostDialog({ post, onCloseDialog, isDialogOpen, closedModal }) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  function handelConfirm() {
    dispatch(deletePost(post._id));
    setIsConfirmDialogOpen(false);
    closedModal();
  }

  function openConfirmDialog() {
    setIsConfirmDialogOpen(true);
  }

  function closeConfirmDialog() {
    setIsConfirmDialogOpen(false);
  }

  if (!isDialogOpen) return null;
  return (
    <div className={styles.modalContainer} onClick={onCloseDialog}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {user._id === post.user._id && (
          <>
            <button className={styles.dialogBtn} onClick={openConfirmDialog}>
              Delete
            </button>
            <button className={styles.dialogBtn}>Edit</button>
          </>
        )}
        <button className={styles.dialogBtn}>Go to post</button>
        <button className={styles.dialogBtn}>Copy link</button>
        <button className={styles.dialogBtn} onClick={onCloseDialog}>
          Cancel
        </button>
      </div>
      {isConfirmDialogOpen && (
        <ConfirmDialog
          onCloseConfirmDialog={closeConfirmDialog}
          isConfirmDialogOpen={isConfirmDialogOpen}
          onConfirm={handelConfirm}
        />
      )}
    </div>
  );
}

PostDialog.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string, // Идентификатор поста
    description: PropTypes.string, // Описание поста
    image: PropTypes.string, // Изображение поста
    createAt: PropTypes.string,
    user: PropTypes.shape({
      _id: PropTypes.string, // Идентификатор пользователя
      username: PropTypes.string, // Имя пользователя
      avatar: PropTypes.string, // Аватар пользователя
    }),
    comments: PropTypes.arrayOf(PropTypes.string), // Список комментариев
  }),
  onCloseDialog: PropTypes.func,
  closedModal: PropTypes.func,
  isDialogOpen: PropTypes.bool,
};

export default PostDialog;
