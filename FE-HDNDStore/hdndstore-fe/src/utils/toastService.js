import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Hiển thị toast message
 * @param {"success" | "error" | "info" | "warning"} type Loại thông báo
 * @param {string} message Nội dung thông báo
 */
export const showToast = (type, message) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000, // Đóng sau 3 giây
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
