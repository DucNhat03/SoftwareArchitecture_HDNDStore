import "../../styles/Footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import logoImg from "../../assets/img-shop/logo-txt.png";
import { Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Row className="footer-content">
          <Col md={7} className="footer-column">
            <div className="footer-info">
              <p className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <span>
                  <strong>Địa chỉ:</strong> 12 Nguyễn Văn Bảo, Phường 1, Gò Vấp,
                  TP. Hồ Chí Minh
                </span>
              </p>
              <p className="info-item">
                <FaPhone className="info-icon" />
                <span>
                  <strong>Hotline:</strong> 039.799.6969
                </span>
              </p>
              <p className="info-item">
                <FaEnvelope className="info-icon" />
                <span>
                  <strong>Email:</strong> hdndstore.cs1@gmail.com
                </span>
              </p>
            </div>
          </Col>

          <Col md={5} className="footer-column">
            <div className="footer-payments">
              <div className="payment-label">Phương thức thanh toán:</div>
              <img
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png"
                alt="MoMo"
                title="Thanh toán qua MoMo"
                className="payment-icon"
                style={{ width: "32px", height: "32px" }} // tùy chỉnh kích thước tại đây
              />
            </div>

            <div className="footer-copyright">
              © 2025 <span>HDND Store</span> - Elevate your step. Tất cả quyền
              được bảo lưu.
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
