import "../../styles/Footer.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content" style={{ fontSize: "14px"}}>
          <div className="footer-column">
            <strong style={{fontSize: "24px", color: "#f0790b"}}>HDND STORE</strong><br />
            Địa chỉ: 12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, TP. Hồ Chí Minh<br />
            Hotline: 039.799.6969<br />
            Email: hdndstore.cs1@gmail.com
          </div>
          <div className="footer-column" style={{ alignSelf: "flex-end", fontSize: "16px", color: "#f0790b"}}>
            © 2025 HDND Store - Elevate your step.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
