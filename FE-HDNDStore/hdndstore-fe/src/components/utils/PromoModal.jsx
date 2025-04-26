import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/promodal/Promodal.css"; 
import { FaTimes, FaShoppingCart, FaTag } from "react-icons/fa";
import summerSaleImg from "../../assets/img-shop/summer-sale.png";
import productImg1 from "../../assets/img-shop/productImg1.png";
import productImg2 from "../../assets/img-shop/productImg2.png";
import productImg3 from "../../assets/img-shop/product-new.png";


const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });


  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); 
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate - now;
      
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    
    if (userId) {
      const promoShown = localStorage.getItem(`promo_closed_${userId}`);
      if (!promoShown) {
        setTimeout(() => setIsOpen(true), 1000);
      }
    } else {
      setTimeout(() => setIsOpen(true), 1000); 
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

  const padNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="promo-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          <motion.div 
            className="promo-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <button className="promo-close-btn" onClick={handleClose}>
              <FaTimes />
            </button>
            
            <div className="promo-content">
              <div className="promo-left">
                <motion.div 
                  className="discount-badge"
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <FaTag className="tag-icon" />
                  <span className="discount-text">20%</span>
                  <span className="discount-label">OFF</span>
                </motion.div>
                
                <h2 className="promo-title">
                  Ưu Đãi Mùa Hè<br />
                  <span className="highlight">Siêu Giảm Giá</span>
                </h2>
                
                <p className="promo-description">
                  Giảm ngay <strong>20%</strong> khi mua từ 2 sản phẩm.<br/>
                  Áp dụng cho toàn bộ danh mục sản phẩm!
                </p>
                
                <div className="promo-timer">
                  <motion.div 
                    className="timer-item"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="timer-value">{padNumber(timeLeft.days)}</span>
                    <span className="timer-label">Ngày</span>
                  </motion.div>
                  <motion.div 
                    className="timer-item"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="timer-value">{padNumber(timeLeft.hours)}</span>
                    <span className="timer-label">Giờ</span>
                  </motion.div>
                  <motion.div 
                    className="timer-item"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="timer-value">{padNumber(timeLeft.minutes)}</span>
                    <span className="timer-label">Phút</span>
                  </motion.div>
                  <motion.div 
                    className="timer-item"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <span className="timer-value">{padNumber(timeLeft.seconds)}</span>
                    <span className="timer-label">Giây</span>
                  </motion.div>
                </div>
                
                <motion.button 
                  className="promo-cta-btn"
                  onClick={handleBuyNow}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShoppingCart className="cart-icon" />
                  <span>Mua Ngay</span>
                </motion.button>
              </div>
              
              <div className="promo-right">
                <div className="promo-image-container">
                  <motion.img 
                    src={summerSaleImg} 
                    alt="Summer Sale Promotion" 
                    className="promo-image"
                    initial={{ y: 20, opacity: 0.8 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      y: { type: "spring", stiffness: 100, repeat: Infinity, repeatType: "reverse", duration: 2 }
                    }}
                  />
                </div>
                
                <div className="featured-products">
                  <motion.div 
                    className="featured-product"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={productImg1} alt="Featured Product 1" />
                  </motion.div>
                  <motion.div 
                    className="featured-product"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={productImg2} alt="Featured Product 2" />
                  </motion.div>
                  <motion.div 
                    className="featured-product"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={productImg3} alt="Featured Product 3" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PromoModal;