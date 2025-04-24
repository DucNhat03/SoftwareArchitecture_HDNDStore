import { useEffect, useState } from "react";
import axios from "axios";
import {
  Tabs,
  Tab,
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
  Badge,
  Spinner,
  ListGroup,
  Accordion,
} from "react-bootstrap";
import "../../styles/profile/Orders.css";
import {
  FaTruck,
  FaBox,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaTimesCircle,
  FaExclamationCircle,
  FaEdit,
  FaCreditCard,
  FaCheckCircle,
  FaRegSadTear,
  FaSearch,
  FaFileInvoiceDollar,
  FaShippingFast,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]); 
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
    { key: "all", label: "Tất cả", icon: <FaSearch className="me-1" /> },
    {
      key: "pending",
      label: "Chờ xác nhận",
      icon: <FaFileInvoiceDollar className="me-1" />,
    },
    {
      key: "shipping",
      label: "Đang giao",
      icon: <FaShippingFast className="me-1" />,
    },
    {
      key: "delivered",
      label: "Đã giao",
      icon: <FaCheckCircle className="me-1" />,
    },
    {
      key: "cancelled",
      label: "Đã hủy",
      icon: <FaTimesCircle className="me-1" />,
    },
  ];

  const handlePayment = async (total, orderId) => {
    console.log("Thực hiện thanh toán cho đơn hàng:", orderId);
    console.log("Tổng tiền:", total);
    try {
      const response = await axios.post("http://localhost:5003/payment", {
        amount: total,
        orderId: orderId,
      });

      if (response.data && response.data.payUrl) {
        // Redirect người dùng sang trang thanh toán MoMo
        window.location.href = response.data.payUrl;
      } else {
        console.error("Không nhận được payUrl từ server:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu thanh toán:", error);
    }
  };

  // Hàm gọi API lấy danh sách đơn hàng theo userId
  const fetchOrders = async () => {
    let userId = localStorage.getItem("userId")?.replace(/"/g, ""); // Xóa dấu " không mong muốn

    console.log("userId lấy trong Order:", userId);
    if (!userId) {
      console.log("Không tìm thấy userId trong localStorage!");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5002/api/orders/user/${userId}`
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error(
        "Lỗi khi lấy đơn hàng:",
        error.response?.data?.message || error.message
      );
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
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
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

    console.log(
      "Gửi request cập nhật địa chỉ...",
      selectedOrderId,
      receiverInfo
    );

    try {
      const response = await fetch(
        `http://localhost:5002/api/orders/${selectedOrderId}/shipping-address`,
        {
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
        }
      );

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
        setError(
          result.message || "Không thể cập nhật thông tin. Vui lòng thử lại!"
        );
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
      const orderResponse = await fetch(
        `http://localhost:5002/api/orders/${selectedOrderId}`
      );
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
      const response = await fetch(
        `http://localhost:5002/api/orders/${selectedOrderId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lyDoHuy: cancelReason, ngayHuy: cancelDate }),
        }
      );

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
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === statusMap[activeTab]);

  // Hàm xử lý thay đổi tab
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Hàm render badge status
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return (
          <Badge bg="warning" text="dark" className="py-2 px-3">
            <FaFileInvoiceDollar className="me-1" /> {status}
          </Badge>
        );
      case "Đang giao":
        return (
          <Badge bg="info" className="py-2 px-3">
            <FaShippingFast className="me-1" /> {status}
          </Badge>
        );
      case "Đã giao":
        return (
          <Badge bg="success" className="py-2 px-3">
            <FaCheckCircle className="me-1" /> {status}
          </Badge>
        );
      case "Đã hủy":
        return (
          <Badge bg="danger" className="py-2 px-3">
            <FaTimesCircle className="me-1" /> {status}
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="py-2 px-3">
            {status}
          </Badge>
        );
    }
  };

  // Hàm render payment badge
  const renderPaymentBadge = (status) => {
    return status === "Đã thanh toán" ? (
      <Badge bg="success" className="py-2 px-3">
        <FaCheckCircle className="me-1" /> Đã thanh toán
      </Badge>
    ) : (
      <Badge bg="light" text="dark" className="py-2 px-3">
        <FaCreditCard className="me-1" /> Chưa thanh toán
      </Badge>
    );
  };

  return (
    <Container className="orders-container card p-4 shadow-sm rounded">
      <h4 className="mb-4 border-bottom pb-3">Quản lý đơn hàng</h4>

      <Tabs
        activeKey={activeTab}
        onSelect={handleTabChange}
        className="orders-tabs mb-4 nav-tabs-custom"
        fill
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            eventKey={tab.key}
            title={
              <span>
                {tab.icon} {tab.label}
              </span>
            }
          >
            {loading ? (
              <div className="text-center my-5 py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Đang tải đơn hàng...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              <Row className="mt-3 order-container">
                {filteredOrders.map((order) => (
                  <Card
                    key={order._id}
                    className="order-card mb-4 shadow-sm border-0"
                  >
                    <Card.Header className="d-flex justify-content-between align-items-center bg-light py-2 ">
                      <div>
                        <h5 className="mb-0 fw-bold">
                          <FaBox className="me-2" />
                          Đơn hàng #{order._id.substring(0, 50)}
                        </h5>
                        <small className="text-muted">
                          <FaCalendarAlt className="me-1" />
                          {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(order.orderDate))}
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        {renderStatusBadge(order.status)}
                        {renderPaymentBadge(order.statusPayment)}
                      </div>
                    </Card.Header>

                    <Card.Body>
                      {order.ngayHuy && order.lyDoHuy && (
                        <div className="alert alert-danger mb-3">
                          <div className="d-flex align-items-center">
                            <FaExclamationCircle
                              className="me-2"
                              size="1.5em"
                            />
                            <div>
                              <h6 className="mb-1">Đơn hàng đã bị hủy</h6>
                              <p className="mb-1">
                                <strong>Lý do:</strong> {order.lyDoHuy}
                              </p>
                              <small className="text-muted">
                                <FaCalendarAlt className="me-1" /> Thời gian
                                hủy:{" "}
                                {new Intl.DateTimeFormat("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }).format(new Date(order.ngayHuy))}
                              </small>
                            </div>
                          </div>
                        </div>
                      )}

                      <Accordion defaultActiveKey="0" className="mb-3">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <FaUser className="me-2" /> Thông tin giao hàng
                          </Accordion.Header>
                          <Accordion.Body>
                            {order.shippingAddress ? (
                              <Card className="border-0 bg-light mt-2">
                                <Card.Body>
                                  <ListGroup
                                    variant="flush"
                                    className="bg-transparent"
                                  >
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center bg-transparent border-0 py-1">
                                      <span className="text-muted">
                                        <FaUser className="me-2" /> Người nhận:
                                      </span>
                                      <span className="fw-bold">
                                        {order.shippingAddress.fullName}
                                      </span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center bg-transparent border-0 py-1">
                                      <span className="text-muted">
                                        <FaPhone className="me-2" /> Số điện
                                        thoại:
                                      </span>
                                      <span className="fw-bold">
                                        {order.shippingAddress.phone}
                                      </span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center bg-transparent border-0 py-1">
                                      <span className="text-muted">
                                        <FaMapMarkerAlt className="me-2" /> Địa
                                        chỉ:
                                      </span>
                                      <span className="fw-bold text-end">
                                        {order.shippingAddress.address.street},{" "}
                                        {order.shippingAddress.address.ward},{" "}
                                        {order.shippingAddress.address.district}
                                        , {order.shippingAddress.address.city}
                                      </span>
                                    </ListGroup.Item>
                                  </ListGroup>

                                  {order.status === "Chờ xác nhận" && (
                                    <div className="text-end mt-2">
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleEditAddress(order)}
                                      >
                                        <FaEdit className="me-1" /> Chỉnh sửa
                                        địa chỉ
                                      </Button>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                            ) : (
                              <div className="alert alert-warning">
                                Không có thông tin địa chỉ giao hàng
                              </div>
                            )}
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>

                      <h6 className="mb-3 fw-bold border-bottom pb-2">
                        Sản phẩm
                      </h6>

                      {order.cartItems.length > 0 ? (
                        <div className="product-list">
                          {order.cartItems.map((item, index) => (
                            <div
                              key={index}
                              className="product-item mb-3 p-3 border rounded d-flex"
                            >
                              <img
                                src={
                                  item.image?.[0] ||
                                  "https://via.placeholder.com/60"
                                }
                                alt={item.name}
                                className="product-image rounded me-3"
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  objectFit: "cover",
                                }}
                              />
                              <div className="product-details w-100">
                                <h6 className="mb-1">{item.name}</h6>
                                <p
                                  className="text-muted small mb-1 text-wrap"
                                  style={{
                                    wordBreak: "break-word",
                                    whiteSpace: "pre-wrap",
                                  }}
                                >
                                  {item.description?.substring(0, 1000)}
                                </p>

                                <div className="d-flex justify-content-between align-items-end mt-2">
                                  <div>
                                    {item.variants?.length > 0 && (
                                      <div className="variants">
                                        {item.variants.map((v, i) => (
                                          <Badge
                                            key={i}
                                            bg="light"
                                            text="dark"
                                            className="me-2 mb-1"
                                          >
                                            {v.color} - {v.size} (SL: {v.stock})
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-primary fw-bold">
                                    {item.price.toLocaleString()} đ
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="alert alert-warning">
                          Không có sản phẩm trong đơn hàng
                        </div>
                      )}
                    </Card.Body>

                    <Card.Footer className="bg-light">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                        <div className="mb-3 mb-md-0">
                          <h5 className="mb-0 d-flex align-items-center">
                            <span className="text-muted me-2">Tổng tiền:</span>
                            <span className="text-danger fw-bold">
                              {order.finalAmount.toLocaleString()} đ
                            </span>
                          </h5>
                        </div>

                        <div className="d-flex gap-2">
                          {/* Chỉ hiển thị nút nếu đơn hàng chưa bị hủy */}
                          {order.status !== "Đã hủy" &&
                            order.status !== "Đã giao" &&
                            order.status !== "Đang giao" &&
                            order.statusPayment !== "Đã thanh toán" && (
                              <>
                                <Button
                                  variant="outline-danger"
                                  onClick={() =>
                                    handleShowCancelModal(order._id)
                                  }
                                >
                                  <FaTimesCircle className="me-1" /> Hủy đơn
                                </Button>
                                <Button
                                  variant="success"
                                  onClick={() => {
                                    handlePayment(order.finalAmount, order._id);
                                    toast.success(
                                      "Đang chuyển đến trang thanh toán!",
                                      {
                                        position: "top-right",
                                        autoClose: 2000,
                                      }
                                    );
                                  }}
                                >
                                  <FaCreditCard className="me-1" /> Thanh toán
                                </Button>
                              </>
                            )}
                        </div>
                      </div>
                    </Card.Footer>
                  </Card>
                ))}
              </Row>
            ) : (
              <div className="text-center py-5 my-4 border rounded bg-light">
                <FaRegSadTear size="3em" className="text-muted mb-3" />
                <h5>Không có đơn hàng nào</h5>
                <p className="text-muted">
                  Bạn chưa có đơn hàng nào trong danh mục này
                </p>
                <Button variant="primary">Mua sắm ngay</Button>
              </div>
            )}
          </Tab>
        ))}
      </Tabs>

      {/* Modal chỉnh sửa địa chỉ giao hàng */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa địa chỉ nhận hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Người nhận</Form.Label>
                  <Form.Control
                    type="text"
                    value={receiverInfo?.fullName || ""}
                    onChange={(e) =>
                      setReceiverInfo({
                        ...receiverInfo,
                        fullName: e.target.value || "",
                      })
                    }
                    placeholder="Nhập tên người nhận"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    value={receiverInfo?.phone || ""}
                    onChange={(e) =>
                      setReceiverInfo({
                        ...receiverInfo,
                        phone: e.target.value || "",
                      })
                    }
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ cụ thể</Form.Label>
              <Form.Control
                type="text"
                value={receiverInfo?.address?.street || ""}
                onChange={(e) =>
                  setReceiverInfo({
                    ...receiverInfo,
                    address: {
                      ...receiverInfo.address,
                      street: e.target.value || "",
                    },
                  })
                }
                placeholder="Ví dụ: 123 Đường ABC"
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Phường/Xã</Form.Label>
                  <Form.Control
                    type="text"
                    value={receiverInfo?.address?.ward || ""}
                    onChange={(e) =>
                      setReceiverInfo({
                        ...receiverInfo,
                        address: {
                          ...receiverInfo.address,
                          ward: e.target.value || "",
                        },
                      })
                    }
                    placeholder="Nhập phường/xã"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Quận/Huyện</Form.Label>
                  <Form.Control
                    type="text"
                    value={receiverInfo?.address?.district || ""}
                    onChange={(e) =>
                      setReceiverInfo({
                        ...receiverInfo,
                        address: {
                          ...receiverInfo.address,
                          district: e.target.value || "",
                        },
                      })
                    }
                    placeholder="Nhập quận/huyện"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tỉnh/Thành phố</Form.Label>
                  <Form.Control
                    type="text"
                    value={receiverInfo?.address?.city || ""}
                    onChange={(e) =>
                      setReceiverInfo({
                        ...receiverInfo,
                        address: {
                          ...receiverInfo.address,
                          city: e.target.value || "",
                        },
                      })
                    }
                    placeholder="Nhập thành phố"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowEditModal(false)}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveReceiverInfo}>
            <FaCheckCircle className="me-1" /> Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal hủy đơn hàng */}
      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Xác nhận hủy đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-warning">
            <FaExclamationCircle className="me-2" /> Sau khi hủy, đơn hàng sẽ
            không thể khôi phục lại.
          </div>
          <Form.Group>
            <Form.Label>Vui lòng cho biết lý do hủy đơn:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ví dụ: Tôi muốn thay đổi sản phẩm..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowCancelModal(false)}
          >
            Quay lại
          </Button>
          <Button
            variant="danger"
            onClick={() => handleCancelOrder(selectedOrderId)}
            disabled={!cancelReason.trim()}
          >
            <FaTimesCircle className="me-1" /> Xác nhận hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orders;
