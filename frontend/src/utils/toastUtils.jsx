import { toast } from "react-toastify";

export const showToast = (type, message) => {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  } else if (type === "warning") {
    toast.warn(message);
  } else if (type === "info") {
    toast.info(message);
  }
};
