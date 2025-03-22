import React, { useState, Suspense } from "react";

import styles from "../Styles/PageSlider.module.css";
import { UserIcon, ParentIcon } from "../components/common/assets";
import { Loader } from "../components/common/Loader";
import Btn from "../components/common/Btn";

const File = React.lazy(() => import("./File"));
const GuaranteePage = React.lazy(() => import("./GuaranteePage"));

const PageSlider = () => {
  const [activePage, setActivePage] = useState("file");
  const handleTogglePage = () => {
    const newPage = activePage === "file" ? "guarantee" : "file";
    setActivePage(newPage);
  };
  const getIcon = () => {
    return activePage === "file" ? <ParentIcon /> : <UserIcon />;
  };

  return (
    <div className={styles.container}>
      <Suspense
        fallback={
          <div className={styles.center}>
            <Loader />
          </div>
        }
      >
        {activePage === "file" ? <File /> : <GuaranteePage />}
      </Suspense>

      <Btn
        label={activePage === "file" ? "Guarantee" : "User"}
        onClick={handleTogglePage}
        icon={getIcon()}
      />
    </div>
  );
};

export default PageSlider;
