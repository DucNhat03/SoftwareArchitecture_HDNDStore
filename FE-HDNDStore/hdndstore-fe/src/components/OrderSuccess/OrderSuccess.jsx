import "../../styles/cart/ProductDetail.css";
import "../../styles/cart/OrderSuccess.css";
import { FaCheckCircle, FaShoppingCart, FaShoppingBag } from "react-icons/fa"; // Icon cho dấu tích thành công
import { useNavigate } from "react-router-dom"; // Dùng để chuyển trang
import Header from "../layout/Header";
import Footer from "../layout/Footer";



const OrderSuccess = () => {
    const navigate = useNavigate(); // Hook chuyển trang

    return (
        // Đặt hàng thành công
        <div className="dat-hang-thanh-cong">
            <FaCheckCircle className="success-icon" />
            <h2>ĐẶT HÀNG THÀNH CÔNG!</h2>
            <p>Cảm ơn bạn đã mua sắm tại HDND. Đơn hàng của bạn đang được xử lý.</p>
            <button onClick={() => navigate("/home")} className="btn-back-home">
                <FaShoppingCart style={{ marginRight: "5px" }} />
                Tiếp tục mua hàng
            </button>
            <button onClick={() => navigate("/profile/orders")} className="btn-xem-don-hang">
                <FaShoppingBag style={{ marginRight: "5px" }} />
                Xem đơn hàng đã đặt
            </button>
        </div>
    );
};



const Order = () => {
    return (
        // Trang kết quả đặt hàng thành công
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
