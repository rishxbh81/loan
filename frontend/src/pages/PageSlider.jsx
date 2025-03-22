import React, { useState, Suspense } from "react";

import styles from "../Styles/PageSlider.module.css";
import { UserIcon, ParentIcon } from "../components/common/assets";
import { Loader } from "../components/common/Loader";

import { Button } from "../components/common/Button";

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

      <Button
        text={activePage === "file" ? "Guarantee" : "User"}
        onClick={handleTogglePage}
      />
    </div>
  );
};

export default PageSlider;
