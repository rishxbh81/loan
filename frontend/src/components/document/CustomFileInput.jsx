import React, { useRef } from "react";
import style from "./style/File.module.css";
import { UpdateFileInput } from "../common/UpdateFileInput";
import { CloseIcon } from "../common/assets";

export const CustomFileInput = ({ label, file, onFileChange }) => {
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
    console.log("Clear button clicked!");
    onFileChange(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      console.log("Input field reset!");
    }
  };

  return (
    <div className={style.fileInputContainer}>
      {/* Label added before the file input */}
      {label && <p className={style.fileLabel}>{label}</p>}

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
            <button
              type="button"
              onClick={handleClearFile}
              className="absolute top-1 right-0 text-red-500"
            >
              <CloseIcon />
            </button>
          </div>
        ) : (
          <div className={style.CustomUpload}>
            <UpdateFileInput />
          </div>
        )}
      </div>
    </div>
  );
};
