import styles from "./styles.module.css";
import BackgrondImage from "../../assets/images/handy.png";

function NotFound() {
  return (
    <div className={styles.errorPageContainer}>
      <div className={styles.rigthContainer}>
        <img src={BackgrondImage} alt="img" className={styles.imgBackground} />
      </div>
      <div className={styles.leftContainer}>
        <h1 className={styles.h1}>Oops! Page Not Found (404 Error)</h1>
        <p className={styles.p_errorMessage}>
          We&#39;re sorry, but the page you&#39;re looking for doesn&#39;t seem
          to exist. <br />
          If you typed the URL manually, please double-check the spelling.{" "}
          <br />
          If you clicked on a link, it may be outdated or broken.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
