import style from "./style/Btn.module.css";
export const IconBtn = ({
  icon,
  onClick,
  className,
  type = "button",
  label,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${style.IconBtn} ${className || ""}`}
    >
      <span className={style.Icon}>{icon}</span>
    </button>
  );
};
