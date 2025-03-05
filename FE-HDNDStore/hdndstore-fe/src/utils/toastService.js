import { toast } from "react-toastify";

const toastConfig = {
  position: "top-right",
  autoClose: 2000,
  style: { marginTop: "70px" }, 
};

const toastService = {
  success: (message) => toast.success(message, { ...toastConfig, autoClose: 1500 }),
  error: (message) => toast.error(message, { ...toastConfig, autoClose: 3000 }),
  info: (message) => toast.info(message, { ...toastConfig, autoClose: 2500 }),
  warning: (message) => toast.warning(message, { ...toastConfig, autoClose: 2500 }),
};

export default toastService; 
