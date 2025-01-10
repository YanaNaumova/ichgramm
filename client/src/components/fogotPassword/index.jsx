import styles from "./styles.module.css";
import TroubleLogin from "../../assets/icons/Troublelogging in_.svg";
import { Link } from "react-router-dom";

function fogotPassword() {
  return (
    <div className={styles.fogotPasswordMainContainer}>
      <div className={styles.fogotPasswordContainer}>
        <div className={styles.fogotPasswordWithoutBtnContainer}>
          <img
            src={TroubleLogin}
            alt="trouble_login"
            className={styles.troubleLoginImg}
          />
          <h3 className={styles.headerText}>Trouble logging in?</h3>
          <form className={styles.resetFormContainer}>
            <input
              type="text"
              name="emailOrUsername"
              placeholder="Email or Username"
              required
            ></input>
            <Link to={"/reset"} className={styles.resetBtnLink}>
              <button type="submit" className={styles.resetBtn}>
                Reset your password
              </button>
            </Link>
          </form>
          <div className={styles.lineBoxContainer}>
            <div className={styles.line}></div>
            <div className={styles.text}>OR</div>
            <div className={styles.line}></div>
          </div>
          <Link to={"/register"} className={styles.createNewAccount}>
            Create new account{" "}
          </Link>
        </div>
        <Link to={"/login"} className={styles.backToLoginLink}>
          <button className={styles.backToLoginBtn}>Back to login</button>
        </Link>
      </div>
    </div>
  );
}

export default fogotPassword;
