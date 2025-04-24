import { FaFacebook, FaInstagramSquare, FaYoutube, FaTiktok } from "react-icons/fa";
import "../../styles/Hotline.css";

const Hotline = () => {
  return (
    <div className="hotline-container">
      <hr />
      <div className="hotline-content">
        {/* Cột 1: Hotline */}
        <div className="hotline-column">
          <h4>GỌI MUA HÀNG ONLINE</h4>
          <p className="hotline-note">(08:00 - 21:00 mỗi ngày)</p>
          <h5 className="hotline-number">039.799.6969</h5>
          <p className="hotline-note">Tất cả các ngày trong tuần (Trừ tết Âm Lịch)</p>

          <h4>GÓP Ý & KHIẾU NẠI</h4>
          <p className="hotline-note">(08:30 - 20:30)</p>
          <h5 className="hotline-number">039.799.6969</h5>
          <p className="hotline-note">Tất cả các ngày trong tuần (Trừ tết Âm Lịch)</p>
        </div>

        {/* Cột 2: Thông tin */}
        <div className="hotline-column">
          <h4>HỖ TRỢ</h4>
          <ul>
            <li><a href="#">Chính sách giao hàng</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Phương thức thanh toán</a></li>
            <li><a href="#">Hướng dẫn đặt hàng</a></li>
          </ul>
        </div>

        {/* Cột 3: Giới thiệu */}
        <div className="hotline-column">
          <h4>VỀ HDND STORE</h4>
          <ul>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Tuyển dụng</a></li>
            <li><a href="#">Hệ thống cửa hàng</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </div>

        {/* Cột 4: Đăng ký nhận tin + Mạng xã hội */}
        <div className="hotline-column">
          <h4>KẾT NỐI VỚI CHÚNG TÔI</h4>
          <div className="hotline-socials">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagramSquare /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaTiktok /></a>
          </div>

          <h4 style={{ marginTop: "20px" }}>ĐĂNG KÝ NHẬN TIN</h4>
          <form className="email-subscribe">
            <input type="email" placeholder="Email của bạn" required />
            <button type="submit">Gửi</button>
          </form>
        </div>
      </div>

      <hr style={{ margin: "20px 0", borderColor: "#444" }} />

    </div>
  );
};

export default Hotline;
