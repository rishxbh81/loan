import styles from "./style/notFound.module.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div id={styles.oopss}>
      <div id={styles.errorText}>
        <img
          src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg"
          alt="404"
        />
        <span>404</span>
        <p className={styles.pA}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className={styles.goHome} onClick={() => navigate("/home")}>
          Go Back Home
        </p>
      </div>
    </div>
  );
};

export default NotFound;
