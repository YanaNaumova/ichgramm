import ConfirmDialog from "../../components/confirmDialog";
import styles from "./styles.module.css";
import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { deletePost } from "../../redux/slices/postsSlice";
import { updatePost } from "../../redux/slices/postsSlice";

function PostDialog({ post, onCloseDialog, isDialogOpen, closedModal }) {
  console.log(post, "POSTTTTT");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post?.description); // Редактируемый caption
  const [editedImage, setEditedImage] = useState(post?.image);
  const [editedImageFile, setEditedImageFile] = useState(null); // Редактируемое изображение
  const dispatch = useDispatch();

  console.log(showEditModal, "showEditModal");
  console.log(editedCaption, "editedCaption");

  function handelConfirm() {
    dispatch(deletePost(post._id));
    setIsConfirmDialogOpen(false);
    closedModal();
  }

  function handleGoToPost() {
    closedModal();
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
    alert("Link copied to clipboard!");
    closedModal();
  }

  function openConfirmDialog() {
    setIsConfirmDialogOpen(true);
  }

  function closeConfirmDialog() {
    setIsConfirmDialogOpen(false);
  }
  //
  async function handleSaveChanges() {
    try {
      if (!editedCaption && !editedImage && !editedImageFile) {
        console.error("No changes to save");
        return;
      }

      const formData = new FormData();
      if (editedImageFile) formData.append("image", editedImageFile); // Если есть файл, добавляем его
      formData.append("description", editedCaption); // Добавляем описание

      // Отправляем postId, description, и image
      await dispatch(
        updatePost({
          postId: post._id,
          description: editedCaption,
          image: editedImageFile,
        })
      );

      setShowEditModal(false);
      closedModal();
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  }

  function handelSetDescription(e) {
    setEditedCaption(e.target.value);
  }

  function handleChangeImage(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedImage(reader.result); // Предварительный просмотр изображения
      };
      reader.readAsDataURL(file);
    }
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
            <button
              className={styles.dialogBtn}
              onClick={() => {
                setShowEditModal(true);
              }}
            >
              Edit
            </button>
          </>
        )}
        <button className={styles.dialogBtn} onClick={handleGoToPost}>
          Go to post
        </button>
        <button className={styles.dialogBtn} onClick={handleCopyLink}>
          Copy link
        </button>
        <button className={styles.dialogBtn} onClick={onCloseDialog}>
          Cancel
        </button>
      </div>
      {showEditModal && (
        <div className={styles.editModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.editModalContent}>
            <h2>Edit Post</h2>

            {/* Редактирование текста */}
            <textarea
              className={styles.editInput}
              value={editedCaption}
              onChange={handelSetDescription}
              placeholder="Edit description"
            />

            {/* Загрузка нового изображения */}
            <input type="file" accept="image/*" onChange={handleChangeImage} />

            {editedImage && (
              <img
                src={editedImage}
                alt="Preview"
                className={styles.previewImage}
              />
            )}

            {/* Кнопки сохранения и отмены */}
            <div className={styles.editButtons}>
              <button className={styles.saveButton} onClick={handleSaveChanges}>
                Save
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowEditModal(false)} // Закрываем без сохранения
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
