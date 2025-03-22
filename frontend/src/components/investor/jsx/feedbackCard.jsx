import style from "../pages/style/FeedbackForm.module.css";
export const FeedbackCard = ({ children }) => {
  return <div className={style.card}>{children}</div>;
};
