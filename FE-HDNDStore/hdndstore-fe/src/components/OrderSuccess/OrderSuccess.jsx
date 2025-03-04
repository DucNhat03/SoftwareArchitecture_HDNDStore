import "../ProductDetail/ProductDetail.css";
import "./OrderSuccess.css";
import { FaCheckCircle } from "react-icons/fa"; // Icon cho dấu tích thành công
import { useNavigate } from "react-router-dom"; // Dùng để chuyển trang

const Header = () => (
    <div className="header">
        <img src="/src/images/header.png" alt="Header" />
    </div>
);

const OrderSuccess = () => {
    const navigate = useNavigate(); // Hook chuyển trang

    return (
        <div className="dat-hang-thanh-cong">
            <FaCheckCircle className="success-icon" />
            <h2>ĐẶT HÀNG THÀNH CÔNG!</h2>
            <p>Cảm ơn bạn đã mua sắm tại MWC. Đơn hàng của bạn đang được xử lý.</p>
            <button onClick={() => navigate("/home")} className="btn-back-home">
                Quay về trang chủ
            </button>
        </div>
    );
};

const Footer = () => (
    <div className="footer">
        <img src="/src/images/footer.png" alt="Footer" />
    </div>
);

const Order = () => {
    return (
        <div>
            <Header />
            <div className="container">
                <div className="breadcumb">
                    <a href="/home">Trang chủ</a>
                    <span className="delimiter"> | </span>
                    <a href="/dat-hang-thanh-cong">Kết quả đặt hàng</a>
                </div>
                <OrderSuccess />
            </div>
            <Footer />
        </div>
    );
};

export default Order;
