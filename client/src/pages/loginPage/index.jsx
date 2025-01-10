import Login from "../../components/login";
import styles from "./styles.module.css";
import HandyImage from "../../assets/images/handy.png";

function LoginPage() {
  return (
    <div className={styles.loginPageContainer}>
      <img src={HandyImage} alt="handy" className={styles.handyImg} />
      <Login />
    </div>
  );
}

export default LoginPage;
