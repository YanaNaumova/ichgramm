import styles from "./styles.module.css";
import PropTypes from "prop-types";

function ConfirmDialog({
  onCloseConfirmDialog,
  isConfirmDialogOpen,
  onConfirm,
}) {
  if (!isConfirmDialogOpen) return null;
  return (
    <div className={styles.modalContainer} onClick={onCloseConfirmDialog}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <p>Are you sure you want to delete this post?</p>
        <div className={styles.dialogBtns}>
          <button className={styles.dialogBtn} onClick={onConfirm}>
            Yes
          </button>
          <button className={styles.dialogBtn} onClick={onCloseConfirmDialog}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmDialog.propTypes = {
  onCloseConfirmDialog: PropTypes.func.isRequired, // Функция для закрытия диалога
  isConfirmDialogOpen: PropTypes.bool.isRequired, // Булево значение для показа/скрытия диалога
  onConfirm: PropTypes.func.isRequired, // Функция для подтверждения действия
};

export default ConfirmDialog;
