import React from "react";
import style from "./style/Btn.module.css";

export const Button = ({ type, text, onClick, className }) => {
  return (
    <button type={type} onClick={onClick} className={style.btn}>
      {text}
    </button>
  );
};
