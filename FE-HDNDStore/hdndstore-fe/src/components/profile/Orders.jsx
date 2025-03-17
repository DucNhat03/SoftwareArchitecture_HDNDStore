import { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, Tab, Container, Row, Col, Card } from "react-bootstrap";
import "../../styles/profile/Orders.css";
import { FaTruck, FaBox, FaCalendarAlt } from "react-icons/fa";


const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]); // State lưu danh sách đơn hàng
  const [loading, setLoading] = useState(true);

  // Danh sách các tab
  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "processing", label: "Chờ lấy hàng" },
    { key: "shipping", label: "Đang giao" },
    { key: "delivered", label: "Đã giao" },
    { key: "cancelled", label: "Đã Hủy" },
  ];

  // Hàm gọi API lấy danh sách đơn hàng theo userId
  const fetchOrders = async () => {
    let userId = localStorage.getItem("userId")?.replace(/"/g, ""); // Xóa dấu " không mong muốn

    console.log("userId lấy trong Order:", userId);
    if (!userId) {
      console.log("Không tìm thấy userId trong localStorage!");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5002/api/orders/user/${userId}`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);

  // Hàm lọc đơn hàng theo trạng thái
  const filteredOrders = activeTab === "all"
    ? orders
    : orders.filter((order) => order.status.toLowerCase() === activeTab);

  return (
    <Container className="orders-container card p-2">
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="orders-tabs">
        {tabs.map((tab) => (
          <Tab key={tab.key} eventKey={tab.key} title={tab.label}>
            {loading ? (
              <p className="text-center mt-3">Đang tải đơn hàng...</p>
            ) : filteredOrders.length > 0 ? (
                <Row className="mt-4 order-container">
                  {filteredOrders.map((order) => (
                    <Card key={order._id} className="order-card">
                      <span className="trang-thai-don-hang">
                        <FaTruck /> Trạng thái: <span className="trang-thai-don-hang-2">{order.status}</span>
                      </span>
                      <Card.Body>
                        <Card.Title className="don-hang">
                          <FaBox /> Đơn hàng #{order._id}
                        </Card.Title>
                        <p className="ngay-dat">
                          <FaCalendarAlt /> Ngày đặt: {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <p><strong>Sản phẩm trong đơn hàng:</strong></p>
                        {order.cartItems.length > 0 ? (
                          <ul>
                            {order.cartItems.map((item, index) => (
                              <li key={index}>
                                <img src={item.image?.[0] || "https://via.placeholder.com/60"} alt={item.name} />
                                <div className="product-info">
                                  <span className="product-name">{item.name}</span>
                                  <span className="product-description">{item.description}</span>
                                  <span className="phan-loai">Số lượng: <span>{item.quantity}</span></span>
                                  <span className="phan-loai">Phân loại: {item.variants?.[0]?.color} - {item.variants?.[0]?.size}</span>
                                  <span className="product-price">{item.price.toLocaleString()} VND</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Không có sản phẩm trong giỏ hàng</p>
                        )}
                        <p className="total-sp">🛒 Tổng số sản phẩm: {order.cartItems.length}</p>
                      </Card.Body>
                      <p className="total-amount">
                        Tổng số tiền: <strong className="total-vnd">{order.finalAmount.toLocaleString()} VND</strong>
                      </p>
                    </Card>
                  ))}
                </Row>

            ) : (
              <Row className="justify-content-center mt-4">
                <Col md={6} className="text-center">
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/020/696/242/small_2x/3d-minimal-customer-order-online-shopping-concept-customer-service-concept-order-clipboard-with-a-checkmark-3d-illustration-png.png"
                    alt="No Orders"
                    className="empty-orders-img"
                  />
                  <p className="mt-3">Chưa có đơn hàng</p>
                </Col>
              </Row>
            )}
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
};

export default Orders;

