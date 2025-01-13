import styles from "./styles.module.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.linkConatiner}>
        <Link to={"/home"} className={styles.link}>
          Home
        </Link>
        <Link to={"/search"} className={styles.link}>
          Search
        </Link>
        <Link to={"/explore"} className={styles.link}>
          Explore
        </Link>
        <Link to={"/messages"} className={styles.link}>
          Messages
        </Link>
        <Link to={"/notifications"} className={styles.link}>
          Notificaitons
        </Link>
        <Link to={"/create"} className={styles.link}>
          Create
        </Link>
      </div>
      <div className={styles.copyrightContainer}>© 2024 ICHgram</div>
    </div>
  );
}

export default Footer;
