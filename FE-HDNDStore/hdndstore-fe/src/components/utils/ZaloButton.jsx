import { useState, useEffect } from "react";
import { FaComment } from "react-icons/fa"; // Biểu tượng chat hoặc Zalo
import "../../styles/ZaloButton.css"; // Đảm bảo đường dẫn đúng với file CSS của bạn

const ZaloButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleZaloClick = () => {
    // Mở ứng dụng Zalo (nếu có cài đặt trên thiết bị)
    const zaloUrl = "zalo://"; // URL scheme của Zalo
    window.location.href = zaloUrl;
  };

  return (
    <button
      onClick={handleZaloClick}
      className={`zalo-button ${isVisible ? "visible" : ""}`}
    >
      <FaComment size={24} /> {/* Biểu tượng Zalo */}
      <span className="tooltip">Mở Zalo</span>
    </button>
  );
};

export default ZaloButton;
