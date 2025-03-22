import { FaFacebook, FaInstagramSquare, FaYoutube, FaTiktok } from "react-icons/fa";
import "../../styles/Hotline.css";

const Hotline = () => {
  return (
    <div className="hotline-container">
      <hr />
      <div className="hotline-content">
        {/* Cột 1: Hotline */}
        <div className="hotline-column">
          <h4>📞 GỌI MUA HÀNG ONLINE</h4>
          <p className="hotline-note">(08:00 - 21:00 mỗi ngày)</p>
          <h5 className="hotline-number">1900.633.349</h5>
          <p className="hotline-note">Tất cả các ngày trong tuần (Trừ tết Âm Lịch)</p>

          <h4>🛠 GÓP Ý & KHIẾU NẠI</h4>
          <p className="hotline-note">(08:30 - 20:30)</p>
          <h5 className="hotline-number">1900.633.349</h5>
          <p className="hotline-note">Tất cả các ngày trong tuần (Trừ tết Âm Lịch)</p>
        </div>

        {/* Cột 2: Thông tin */}
        <div className="hotline-column">
          <h4>📌 THÔNG TIN</h4>
          <ul>
            <li><a href="#">Giới thiệu về HDND Store</a></li>
            <li><a href="#">Thông tin Website thương mại điện tử</a></li>
            <li><a href="#">Góp ý</a></li>
            <li><a href="#">Chính sách và quy định</a></li>
          </ul>
        </div>

        {/* Cột 3: FAQ & Social */}
        <div className="hotline-column">
          <h4>❓ FAQ</h4>
          <ul>
            <li><a href="#">Vận chuyển</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Chính sách đổi trả bảo hành</a></li>
          </ul>
          <div className="hotline-socials">
            <a href="#"><FaFacebook size={24} /></a>
            <a href="#"><FaInstagramSquare size={24} /></a>
            <a href="#"><FaYoutube size={24} /></a>
            <a href="#"><FaTiktok size={24} /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotline;
