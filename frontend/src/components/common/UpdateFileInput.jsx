import { AddFileIcon } from "./assets";
import style from "./style/fileInput.module.css";
export const UpdateFileInput = () => {
  return (
    <button className={style.button}>
      <AddFileIcon />
      ADD FILE
    </button>
  );
};
