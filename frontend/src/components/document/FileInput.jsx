import React, { useRef } from "react";
import style from "./style/File.module.css";
import DownloadBtn from "../common/downloadBtn";
import { Button } from "../common/Button";
import { CloseIcon } from "../../components/common/assets";
export const FileInput = ({ file, onFileChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("File selected:", selectedFile);
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleClearFile = (e) => {
    e.stopPropagation();

    // Ensure onFileChange is correctly updating the state or props
    onFileChange(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
  };

  return (
    <div
      className={style.uploadBox}
      onClick={() => fileInputRef.current.click()}
      role="button"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      {file ? (
        <div className="flex justify-center items-center w-full text-center">
          <p className={style.fileName}>{file.name}</p>
          {/* <button
            type="button"
            onClick={handleClearFile}
            className="absolute top-3 right-0 text-red-500"
          >
            <CloseIcon />
          </button> */}
        </div>
      ) : (
        <div className={style.upload}>
          {/* <Button text="Select File" /> */}
          <DownloadBtn />
        </div>
      )}
    </div>
  );
};
