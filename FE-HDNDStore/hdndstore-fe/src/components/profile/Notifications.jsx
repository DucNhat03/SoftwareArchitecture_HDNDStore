import { useState } from "react";
import { 
  Container, 
  Card, 
  ListGroup, 
  Button, 
  Badge, 
  Row, 
  Col, 
  Tabs, 
  Tab,
  Alert,
  Dropdown
} from "react-bootstrap";
import { 
  FaBell, 
  FaTrashAlt, 
  FaShoppingBag, 
  FaTag, 
  FaPercent, 
  FaInfoCircle, 
  FaCheck, 
  FaRegBell 
} from "react-icons/fa";
import "../../styles/profile/Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: "Đơn hàng #DH2023 đang được giao đến bạn!", 
      time: "2 giờ trước", 
      read: false,
      type: "order",
      detail: "Dự kiến giao hàng trong 2-3 ngày tới"
    },
    { 
      id: 2, 
      message: "Bạn có mã giảm giá 10% cho đơn hàng tiếp theo!", 
      time: "1 ngày trước", 
      read: false,
      type: "promotion",
      detail: "Mã: SUMMER10 - Hạn sử dụng: 30/05/2025"
    },
    { 
      id: 3, 
      message: "Cập nhật: Sản phẩm yêu thích của bạn đang giảm giá!", 
      time: "3 ngày trước", 
      read: true,
      type: "product",
      detail: "Giày Sandal Cao Gót MWC - 3618 giảm 15%"
    },
    { 
      id: 4, 
      message: "Chúc mừng sinh nhật! Nhận ngay ưu đãi đặc biệt.", 
      time: "5 ngày trước", 
      read: true,
      type: "promotion",
      detail: "Giảm 15% cho tất cả đơn hàng trong ngày sinh nhật của bạn"
    },
    { 
      id: 5, 
      message: "Thông báo bảo trì hệ thống", 
      time: "1 tuần trước", 
      read: true,
      type: "system",
      detail: "Hệ thống sẽ bảo trì từ 23:00 ngày 30/04/2025 đến 01:00 ngày 01/05/2025"
    },
  ]);

  const [activeTab, setActiveTab] = useState('all');

  // Đánh dấu thông báo là đã đọc
  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((noti) =>
        noti.id === id ? { ...noti, read: true } : noti
      )
    );
  };

  // Xóa một thông báo
  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications((prevNotifications) =>
      prevNotifications.filter((noti) => noti.id !== id)
    );
  };

  // Xóa tất cả thông báo
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Đánh dấu tất cả là đã đọc
  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((noti) => ({
        ...noti,
        read: true
      }))
    );
  };

  // Lọc thông báo theo tab
  const getFilteredNotifications = () => {
    if (activeTab === 'all') {
      return notifications;
    }
    return notifications.filter(noti => noti.type === activeTab);
  };

  // Đếm số lượng thông báo chưa đọc
  const unreadCount = notifications.filter(noti => !noti.read).length;

  // Lấy icon theo loại thông báo
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'order':
        return <FaShoppingBag className="notification-type-icon order-icon" />;
      case 'promotion':
        return <FaPercent className="notification-type-icon promo-icon" />;
      case 'product':
        return <FaTag className="notification-type-icon product-icon" />;
      case 'system':
        return <FaInfoCircle className="notification-type-icon system-icon" />;
      default:
        return <FaBell className="notification-type-icon" />;
    }
  };

  return (
    <Container className="notifications-section py-4">
      <Card className="shadow-sm border-0" style={{ marginTop: "-13%" }}>
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="notification-header-icon me-3">
                <FaBell />
                {unreadCount > 0 && (
                  <span className="notification-count">{unreadCount}</span>
                )}
              </div>
              <div>
                <h4 className="mb-1">Thông Báo</h4>
                <p className="text-muted small mb-0">Cập nhật thông tin mới nhất từ cửa hàng</p>
              </div>
            </div>

            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm-2" id="dropdown-basic">
                Tùy chọn
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={markAllAsRead}>
                  <FaCheck className="me-2 text-success" /> Đánh dấu tất cả đã đọc
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={clearAllNotifications} className="text-danger">
                  <FaTrashAlt className="me-2" /> Xóa tất cả thông báo
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="notification-tabs mb-3"
          >
            <Tab eventKey="all" title={<span><FaBell className="me-1" /> Tất cả</span>}>
            </Tab>
            <Tab eventKey="order" title={<span><FaShoppingBag className="me-1" /> Đơn hàng</span>}>
            </Tab>
            <Tab eventKey="promotion" title={<span><FaPercent className="me-1" /> Khuyến mãi</span>}>
            </Tab>
            <Tab eventKey="system" title={<span><FaInfoCircle className="me-1" /> Hệ thống</span>}>
            </Tab>
          </Tabs>

          {unreadCount > 0 && (
            <Alert variant="info" className="mx-3 d-flex align-items-center">
              <FaInfoCircle className="me-2" />
              <div>Bạn có {unreadCount} thông báo chưa đọc</div>
              <Button 
                variant="link" 
                className="ms-auto p-0 text-decoration-none"
                onClick={markAllAsRead}
              >
                Đánh dấu đã đọc tất cả
              </Button>
            </Alert>
          )}

          <ListGroup variant="flush" className="notification-list">
            {getFilteredNotifications().length > 0 ? (
              getFilteredNotifications().map((noti) => (
                <ListGroup.Item
                  key={noti.id}
                  className={`notification-item ${noti.read ? "read" : "unread"}`}
                  onClick={() => markAsRead(noti.id)}
                  action
                >
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <div className={`notification-icon-wrapper ${noti.type}`}>
                        {getNotificationIcon(noti.type)}
                      </div>
                    </Col>
                    <Col>
                      <div className="notification-content">
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className={`mb-1 ${!noti.read ? 'fw-bold' : ''}`}>{noti.message}</h6>
                          {!noti.read && <Badge bg="primary" pill>Mới</Badge>}
                        </div>
                        <p className="notification-detail mb-1 small">{noti.detail}</p>
                        <small className="text-muted time-text">{noti.time}</small>
                      </div>
                    </Col>
                    <Col xs="auto">
                      <Button 
                        variant="link" 
                        className="delete-btn text-danger p-0 ps-2" 
                        onClick={(e) => deleteNotification(noti.id, e)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))
            ) : (
              <div className="text-center py-5 empty-notifications">
                <FaRegBell size={40} className="text-muted mb-3" />
                <h5>Không có thông báo nào</h5>
                <p className="text-muted">Hiện tại bạn không có thông báo nào</p>
              </div>
            )}
          </ListGroup>
        </Card.Body>

        {getFilteredNotifications().length > 5 && (
          <Card.Footer className="bg-white border-top-0 text-center py-3">
            <Button variant="outline-primary">Xem thêm thông báo</Button>
          </Card.Footer>
        )}
      </Card>
    </Container>
  );
};

export default Notifications;