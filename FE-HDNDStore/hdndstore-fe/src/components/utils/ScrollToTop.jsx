import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import "../../styles/ScrollToTop.css";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const smoothScrollToTop = () => {
    let currentPosition = window.scrollY;
    const scrollStep = currentPosition / 50; // tốc độ cuộn

    const scrollAnimation = () => {
      if (currentPosition > 0) {
        window.scrollTo(0, currentPosition);
        currentPosition -= scrollStep; 
        requestAnimationFrame(scrollAnimation);
      } else {
        window.scrollTo(0, 0);
      }
    };

    requestAnimationFrame(scrollAnimation);
  };

  return (
    <button
      onClick={smoothScrollToTop}
      className={`scroll-to-top ${isVisible ? "visible" : ""}`}
    >
      <FaArrowUp size={24} />
      <span className="tooltip">Cuộn lên đầu trang</span>
    </button>
  );
};

export default ScrollToTop;
