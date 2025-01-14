import styles from "./styles.module.css";
import NotFound from "../../components/notFound";
import Footer from "../../components/footer";

function NotFoundPage() {
  return (
    <div className={styles.notFoundPageContainer}>
      <NotFound />
      <Footer />
    </div>
  );
}

export default NotFoundPage;
