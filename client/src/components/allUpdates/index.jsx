import styles from "./styles.module.css";
import AllUpdate from "../../assets/icons/illo-confirm.svg";
function AllUpdates() {
  return (
    <div className={styles.allUpdates}>
      <img src={AllUpdate} alt="All updates" className={styles.img} />
      <p className={styles.allUpBig}>You`ve seen all the updates</p>
      <p className={styles.allUpSmall}>You have viewed all new publications</p>
    </div>
  );
}

export default AllUpdates;
