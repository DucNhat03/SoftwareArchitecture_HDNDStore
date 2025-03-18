import { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, Tab, Container, Row, Col, Card, Modal, Button, Form } from "react-bootstrap";
import "../../styles/profile/Orders.css";
import { FaTruck, FaBox, FaCalendarAlt, FaUser, FaPhone, FaMapMarkerAlt, FaTimesCircle, FaExclamationCircle, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]); // State lưu danh sách đơn hàng
  const [loading, setLoading] = useState(true);
//Hủy đơn hàng
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState({
    fullName: "",
    phone: "",
    address: {
      street: "",
      ward: "",
      district: "",
      city: "",
    },
  });
  const [error, setError] = useState(null);

  // Danh sách các tab
  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "shipping", label: "Đang giao" },
    { key: "delivered", label: "Đã giao" },
    { key: "cancelled", label: "Đã hủy" },
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

  useEffect(() => {
    if (showCancelModal) {
      document.body.classList.remove("modal-open");
      document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
    }
  }, [showCancelModal]);
  // Hiển thị modal nhập lý do hủy
  const handleShowCancelModal = (orderId) => {
    console.log("Mở modal hủy đơn:", orderId); // Debug
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const handleEditAddress = (selectedOrder) => {
    setReceiverInfo({
      fullName: selectedOrder.shippingAddress?.fullName || "",
      phone: selectedOrder.shippingAddress?.phone || "",
      address: {
        city: selectedOrder.shippingAddress?.address?.city || "",
        district: selectedOrder.shippingAddress?.address?.district || "",
        ward: selectedOrder.shippingAddress?.address?.ward || "",
        street: selectedOrder.shippingAddress?.address?.street || "",
      },
    });
    setSelectedOrderId(selectedOrder._id); // Cập nhật OrderId
    setShowEditModal(true);
  };



  const handleSaveReceiverInfo = async () => {
    if (!selectedOrderId) {
      console.log("Không tìm thấy OrderId!");
      setError("Không tìm thấy OrderId. Vui lòng thử lại!");
      return;
    }

    console.log("Gửi request cập nhật địa chỉ...", selectedOrderId, receiverInfo);

    try {
      const response = await fetch(`http://localhost:5002/api/orders/${selectedOrderId}/shipping-address`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: receiverInfo.fullName,
          phone: receiverInfo.phone,
          address: {
            city: receiverInfo.address.city || "",
            district: receiverInfo.address.district || "",
            ward: receiverInfo.address.ward || "",
            street: receiverInfo.address.street || "",
          },
        }),
      });

      const result = await response.json();
      console.log("Kết quả API:", result);

      if (response.ok) {
        toast.success("Cập nhật địa chỉ giao hàng thành công!", {
          position: "top-right",
        });
        setShowEditModal(false);
        // Chờ 2 giây trước khi reload trang
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        setError(null);
      } else {
        console.error("Lỗi khi cập nhật:", result);
        setError(result.message || "Không thể cập nhật thông tin. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu cập nhật:", error);
      setError("Có lỗi xảy ra khi cập nhật thông tin.");
    }
  };



  const handleCancelOrder = async () => {
    if (!cancelReason) {
      alert("Vui lòng nhập lý do hủy!");
      return;
    }

    const cancelDate = new Date().toISOString(); // Lấy ngày hiện tại

    try {
      // Kiểm tra trạng thái đơn hàng trước khi gửi yêu cầu hủy
      const orderResponse = await fetch(`http://localhost:5002/api/orders/${selectedOrderId}`);
      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        alert("Không thể lấy thông tin đơn hàng!");
        return;
      }

      if (orderData.status !== "Chờ xác nhận") {
        alert("Chỉ có thể hủy đơn hàng khi trạng thái là 'Chờ xác nhận'!");
        return;
      }

      // Nếu trạng thái hợp lệ, gửi yêu cầu hủy
      const response = await fetch(`http://localhost:5002/api/orders/${selectedOrderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lyDoHuy: cancelReason, ngayHuy: cancelDate }),
      });

      const result = await response.json();
      if (response.ok) {
     
        toast.success("Đơn hàng đã được hủy thành công!", {
          position: "top-right",
        });


        // Xóa dữ liệu trong form sau khi hủy thành công
        setCancelReason("");  
        setShowCancelModal(false);
        // Chờ 2 giây trước khi reload trang
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        alert(result.message || "Hủy đơn hàng thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const statusMap = {
    pending: "Chờ xác nhận",
    shipping: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };


  // Hàm lọc đơn hàng theo trạng thái
  const filteredOrders = activeTab === "all"
    ? orders
    : orders.filter((order) => order.status === statusMap[activeTab]);

  // Hàm xử lý thay đổi tab
  const handleTabChange = (key) => {
    setActiveTab(key);
  };



  return (
    <Container className="orders-container card p-2">
      <Tabs activeKey={activeTab} onSelect={handleTabChange} className="orders-tabs">
        {tabs.map((tab) => (
          <Tab key={tab.key} eventKey={tab.key} title={tab.label}>
            {loading ? (
              <p className="text-center mt-3">Đang tải đơn hàng...</p>
            ) : filteredOrders.length > 0 ? (
              <Row className="mt-4 order-container">
                {filteredOrders.map((order) => (  
                  <Card key={order._id} className="order-card">
                    <span className="trang-thai-don-hang" style={{ color: order.status === "Đã hủy" ? "red" : "black" }}>
                      {order.status === "Đã hủy" ? <FaTimesCircle /> : <FaTruck />} Trạng thái:
                      <span className="trang-thai-don-hang-2">{order.status}</span>
                    </span>

                    <Card.Body>
                      <Card.Title className="don-hang">
                        <FaBox /> Đơn hàng #{order._id}
                      </Card.Title>
                      <p className="ngay-dat">
                        <FaCalendarAlt /> Thời gian đặt: {new Intl.DateTimeFormat("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        }).format(new Date(order.orderDate))}
                      </p>

                      {order.ngayHuy && order.lyDoHuy && (
                        <div className="thong-tin-huy">
                          <p className="ngay-huy">
                            <FaCalendarAlt /> Thời gian hủy:{" "}
                            {new Intl.DateTimeFormat("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }).format(new Date(order.ngayHuy))}
                          </p>
                          <p className="ly-do-huy">
                            <FaExclamationCircle /> Lý do hủy: {order.lyDoHuy}
                          </p>
                        </div>
                      )}
                      {/* Hiển thị địa chỉ giao hàng */}
                      <p>Địa chỉ giao hàng:</p>
                      {order.shippingAddress ? (
                        <div className="shipping-info">
                          <p><FaUser /> Người nhận: {order.shippingAddress.fullName}</p>
                          <p><FaPhone /> SĐT: {order.shippingAddress.phone}</p>
                          <p><FaMapMarkerAlt /> Địa chỉ: {order.shippingAddress.address.street}, {order.shippingAddress.address.ward}, {order.shippingAddress.address.district}, {order.shippingAddress.address.city}</p>

                          {/* Hiển thị nút chỉnh sửa nếu trạng thái đơn hàng là "Chờ xác nhận" */}
                          {order.status === "Chờ xác nhận" && (
                            <Button variant="warning" className="edit-address-button" onClick={() => handleEditAddress(order)}>
                              <FaEdit /> Chỉnh sửa địa chỉ
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p>Không có thông tin địa chỉ giao hàng</p>
                      )}

                   
                      {/* Modal chỉnh sửa địa chỉ giao hàng */}
                      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                        <Modal.Header closeButton>
                          <Modal.Title>Chỉnh sửa địa chỉ nhận hàng</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Group>
                              <Form.Label>Người nhận</Form.Label>
                              <Form.Control
                                type="text"
                                value={receiverInfo?.fullName || ""}
                                onChange={(e) => setReceiverInfo({
                                  ...receiverInfo, fullName: e.target.value || ""
                                })}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Số điện thoại</Form.Label>
                              <Form.Control
                                type="text"
                                value={receiverInfo?.phone || ""}
                                onChange={(e) => setReceiverInfo({
                                  ...receiverInfo, phone: e.target.value || ""
                                })}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Thành phố</Form.Label>
                              <Form.Control
                                type="text"
                                value={receiverInfo?.address?.city || ""}
                                onChange={(e) => setReceiverInfo({
                                  ...receiverInfo,
                                  address: { ...receiverInfo.address, city: e.target.value || "" }
                                })}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Quận/Huyện</Form.Label>
                              <Form.Control
                                type="text"
                                value={receiverInfo?.address?.district || ""}
                                onChange={(e) => setReceiverInfo({
                                  ...receiverInfo,
                                  address: { ...receiverInfo.address, district: e.target.value || "" }
                                })}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Phường/Xã</Form.Label>
                              <Form.Control
                                type="text"
                                value={receiverInfo?.address?.ward || ""}
                                onChange={(e) => setReceiverInfo({
                                  ...receiverInfo,
                                  address: { ...receiverInfo.address, ward: e.target.value || "" }
                                })}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Địa chỉ cụ thể</Form.Label>
                              <Form.Control
                                type="text"
                                value={receiverInfo?.address?.street || ""}
                                onChange={(e) => setReceiverInfo({
                                  ...receiverInfo,
                                  address: { ...receiverInfo.address, street: e.target.value || "" }
                                })}
                              />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
                          <Button
                            variant="primary"
                            onClick={() => {
                              console.log("Nút Lưu đã được bấm!"); // Kiểm tra xem nút có hoạt động không
                              handleSaveReceiverInfo();
                            }}
                          >
                            Lưu
                          </Button>
                        </Modal.Footer>
                      </Modal>


                      


                      <p><strong>Sản phẩm trong đơn hàng:</strong></p>
                      {order.cartItems.length > 0 ? (
                        <ul>
                          {order.cartItems.map((item, index) => (
                            <li key={index}>
                              <img src={item.image?.[0] || "https://via.placeholder.com/60"} alt={item.name} />
                              <div className="product-info-order">
                                <span className="product-name">{item.name}</span>
                                <span className="product-description">{item.description}</span>

                                {/* Hiển thị tất cả màu sắc và size */}
                                <span className="phan-loai">
                                  Phân loại: {item.variants?.length > 0 ? (
                                    item.variants.map((v, i) => (
                                      <div key={i}>
                                        <span>{v.color} - {v.size} (Số lượng: {v.stock})</span>
                                      </div>
                                    ))
                                  ) : "Không có thông tin"}
                                </span>
                                <span className="product-price">Giá: {item.price.toLocaleString()} VND</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Không có sản phẩm trong giỏ hàng</p>
                      )}
                    </Card.Body>

                    <p className="total-amount">
                      Tổng số tiền: <strong className="total-vnd">{order.totalAmount.toLocaleString()} VND</strong>
                    </p>

                    {/* Modal hủy đơn hàng */}
                    <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} animation={false} backdrop={false} centered>
                      <Modal.Header closeButton>
                        <Modal.Title>Hủy đơn hàng</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
                        <Form.Control
                          type="text"
                          placeholder="Nhập lý do hủy"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                          Đóng
                        </Button>
                        <Button variant="danger" onClick={() => handleCancelOrder(selectedOrderId)}>
                          Xác nhận hủy
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    {/* Chỉ hiển thị nút nếu đơn hàng chưa bị hủy */}
                    {order.status !== "Đã hủy" && (
                      <div className="d-flex justify-content-between">
                        <Button variant="danger" className="cancel-button" onClick={() => handleShowCancelModal(order._id)}>
                          Hủy đơn hàng
                        </Button>
                        <Button variant="success" className="pay-button">
                          Thanh toán
                        </Button>
                      </div>
                    )}
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

