import { useState } from "react";
import { ListGroup, Container, Row, Col, Button, Badge } from "react-bootstrap";
import { FaBell, FaTrashAlt } from "react-icons/fa";
import "../../styles/profile/Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Đơn hàng của bạn đang được giao!", time: "2 giờ trước", read: false },
    { id: 2, message: "Bạn có mã giảm giá 10% cho đơn hàng tiếp theo!", time: "1 ngày trước", read: false },
    { id: 3, message: "Cập nhật: Sản phẩm yêu thích của bạn đang giảm giá!", time: "3 ngày trước", read: true },
  ]);

  // Đánh dấu thông báo là đã đọc
  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((noti) =>
        noti.id === id ? { ...noti, read: true } : noti
      )
    );
  };

  // Xóa một thông báo
  const deleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((noti) => noti.id !== id)
    );
  };

  // Xóa tất cả thông báo
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <Container className="notifications-container card p-4">
      <h4 className="mb-3">Thông Báo</h4>
      <p>Nhận thông tin mới nhất từ cửa hàng</p>
      <hr />
      <Row>
        <Col md={12} className="text-end mb-2">
          {notifications.length > 0 && (
            <Button variant="danger" size="sm" onClick={clearAllNotifications}>
              Xóa Tất Cả
            </Button>
          )}
        </Col>
      </Row>
      <ListGroup>
        {notifications.length > 0 ? (
          notifications.map((noti) => (
            <ListGroup.Item
              key={noti.id}
              className={`notification-item ${noti.read ? "read" : "unread"}`}
              onClick={() => markAsRead(noti.id)}
            >
              <FaBell className="notification-icon" />
              <div className="notification-content">
                <p className="mb-1">{noti.message}</p>
                <small className="text-muted">{noti.time}</small>
              </div>
              {!noti.read && <Badge bg="primary">Mới</Badge>}
              <Button variant="link" className="delete-btn" onClick={() => deleteNotification(noti.id)}>
                <FaTrashAlt />
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <p className="text-center text-muted">Không có thông báo nào</p>
        )}
      </ListGroup>
    </Container>
  );
};

export default Notifications;
