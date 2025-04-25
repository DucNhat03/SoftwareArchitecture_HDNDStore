import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import "../../styles/Hotline.css";

const Hotline = () => {
  return (
    <div className="hotline-container">
      <div className="hotline-content">
        {/* Cột 1: Hotline */}
        <div className="hotline-column">
          <h4>Liên hệ mua hàng</h4>
          <p className="hotline-number">039.799.6969</p>
          <p className="hotline-note">Thời gian: 8h00 - 21h00 mỗi ngày</p>
          <p className="hotline-note">Tất cả các ngày trong tuần (Trừ tết Âm Lịch)</p>

          <h4 style={{ marginTop: "30px" }}>Hỗ trợ khách hàng</h4>
          <p className="hotline-number">039.799.6969</p>
          <p className="hotline-note">Thời gian: 8h30 - 20h30 mỗi ngày</p>
          <p className="hotline-note">Khiếu nại, góp ý, tư vấn mua hàng</p>
        </div>

        {/* Cột 2: Thông tin */}
        <div className="hotline-column">
          <h4>Chính sách & Hỗ trợ</h4>
          <ul>
            <li><a href="#">Hướng dẫn mua hàng online</a></li>
            <li><a href="#">Chính sách giao hàng</a></li>
            <li><a href="#">Chính sách đổi trả & hoàn tiền</a></li>
            <li><a href="#">Phương thức thanh toán</a></li>
            <li><a href="#">Chính sách bảo hành</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
          </ul>
        </div>

        {/* Cột 3: Giới thiệu */}
        <div className="hotline-column">
          <h4>Về HDND Store</h4>
          <ul>
            <li><a href="#">Giới thiệu về HDND Store</a></li>
            <li><a href="#">Tuyển dụng</a></li>
            <li><a href="#">Tin tức thời trang</a></li>
            <li><a href="#">Hệ thống cửa hàng</a></li>
            <li><a href="#">Liên hệ hợp tác</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
          </ul>
        </div>

        {/* Cột 4: Đăng ký nhận tin + Mạng xã hội */}
        <div className="hotline-column">
          <h4>Theo dõi chúng tôi</h4>
          <div className="hotline-socials">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
            <a href="#" aria-label="TikTok"><FaTiktok /></a>
          </div>

          <h4 style={{ marginTop: "30px" }}>Đăng ký nhận tin</h4>
          <p className="hotline-note" style={{ marginLeft: 0, marginBottom: "10px" }}>
            Cập nhật các bộ sưu tập và khuyến mãi mới nhất
          </p>
          <form className="email-subscribe">
            <input type="email" placeholder="Nhập email của bạn" required />
            <button type="submit">Đăng ký</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hotline;