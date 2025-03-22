import { useState, useEffect } from "react";
import logo from "../../assets/img-shop/khuyenmai.png";
import "../../styles/PromoModal.css"; // Đảm bảo bạn đã tạo và nhập tệp CSS cho modal

const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  // check userId trong localStorage, nếu có thì hiên thị modal 1 lần duy nhất
  // còn nếu chưa có thì sẽ hiển thị lặp lại sau mỗi lần load lại trang web

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const hasClosed = localStorage.getItem("promo_closed");

    if (userId !== null) {
      if (hasClosed === "true") {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("promo_closed", "true");
  };

  return (
    isOpen && (
      <>
        <div className="modal-overlay" onClick={handleClose}></div>
        <div className="modal-container animate-fadeIn">
          <button className="close-button" onClick={handleClose}>
            ✖
          </button>
          <h2 className="modal-title">🔥 Khuyến Mãi Cực Sốc 🔥</h2>
          <img src={logo} alt="Quảng cáo" className="modal-image" />
          <p className="modal-description">
            Giảm ngay <span className="per-discout">20% </span> khi mua từ 2 sản
            phẩm!
          </p>
          <div className="modal-cta">
            <a href="/category" className="modal-button">
              Mua ngay
            </a>
          </div>
        </div>
      </>
    )
  );
};

export default PromoModal;
