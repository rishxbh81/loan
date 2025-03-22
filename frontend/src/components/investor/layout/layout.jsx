import { Outlet } from "react-router-dom";
import MenuBar from "../jsx/MenuBar";
import styles from "./style/Layout.module.css";

const Layout = () => {
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <div className={styles.menu}>
        <MenuBar />
      </div>
    </div>
  );
};

export default Layout;
