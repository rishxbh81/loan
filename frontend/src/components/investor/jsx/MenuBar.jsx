import styles from "./style/menuBar.module.css";
import {
  AnalyticIcon,
  DashboardIcon,
  OppIcon,
  RupeesIcon,
} from "../../common/assets";
import { useNavigate } from "react-router-dom";

const MenuBar = () => {
  const navigate = useNavigate();
  return (
    <div id={styles.navbody}>
      <form action="">
        <ul className={styles.ul}>
          <input
            name="rad"
            className={styles.radio}
            id="choose1"
            type="radio"
          />
          <label htmlFor="choose1">
            <li
              className={styles.li}
              onClick={() => navigate("/earnings-repayment")}
            >
              <RupeesIcon className={styles.svg} />
            </li>
          </label>
          <input
            className={styles.radio}
            name="rad"
            defaultChecked
            id="choose2"
            type="radio"
          />
          <label htmlFor="choose2">
            <li className={styles.li} onClick={() => navigate("/portfolio")}>
              <DashboardIcon className={styles.svg} />
            </li>
          </label>

          <input
            className={styles.radio}
            name="rad"
            id="choose5"
            type="radio"
          />
          <label htmlFor="choose5">
            <li className={styles.li} onClick={() => navigate("/report")}>
              <AnalyticIcon className={styles.svg} />
            </li>
          </label>
          <input
            className={styles.radio}
            name="rad"
            id="choose3"
            type="radio"
          />
          <label htmlFor="choose3">
            <li
              className={styles.li}
              onClick={() => navigate("/make-investment")}
            >
              <OppIcon className={styles.svg} />
            </li>
          </label>
        </ul>
      </form>
    </div>
  );
};

export default MenuBar;
