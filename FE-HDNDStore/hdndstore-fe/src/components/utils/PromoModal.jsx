import { useState, useEffect } from "react";
import logo from "../../assets/img-shop/khuyenmai.png";
import "../../styles/PromoModal.css"; 
import { useNavigate } from "react-router-dom";


const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    
    if (userId) {
      // Kiểm tra trạng thái promo đã hiển thị cho user này chưa
      const promoShown = localStorage.getItem(`promo_closed_${userId}`);
      if (!promoShown) {
        setIsOpen(true);
      }
    } else {
      // Nếu chưa đăng nhập, luôn hiển thị modal mỗi lần load trang
      setIsOpen(true);
    }
    
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.setItem(`promo_closed_${userId}`, "true");
    }
  };

  const handleBuyNow = () => {
    handleClose();
    navigate("/category");
  }
    

  return (
    isOpen && (
      <>
      <div className="modal-overlay" onClick={handleClose}></div>
      <div className="modal-container animate-fadeIn">
        <button className="close-button" onClick={handleClose}>
          ✖
        </button>
        <h2 className="modal-title">🎉 ƯU ĐÃI ĐẶC BIỆT 🎉</h2>
        <img src={logo} alt="Quảng cáo" className="modal-image" />
        <p className="modal-description">
          🔥 Giảm ngay <span className="per-discout">20% </span> khi mua từ 2 sản phẩm! 🔥
        </p>
        <div className="modal-cta">
          <button className="modal-button" onClick={handleBuyNow}>
            🛒 Mua ngay
          </button>
        </div>
      </div>
      </>
    )
  );
};

export default PromoModal;
