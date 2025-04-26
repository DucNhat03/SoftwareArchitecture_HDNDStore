import { useState, useEffect } from "react";
import { Container, Button, Card, Form, Modal, Alert } from "react-bootstrap";
import { FaSignOutAlt, FaUndo, FaExclamationTriangle, FaCheck, FaUserLock } from "react-icons/fa";
import "../../styles/profile/Logout.css";
import { useNavigate } from "react-router-dom"; 
import api from "../../services/api"; // Đường dẫn đến file api.js

const Logout = () => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");


  useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = localStorage.getItem("token");
    
            if (!token) {
              console.error("Chưa có token, vui lòng đăng nhập!");
              return;
            }
    
            const response = await api.get("/auth/profile", {
              headers: { Authorization: `Bearer ${token}` }, 
            });
            setEmail(response.data.email);
    
            console.log("Avatar URL:", response.data.avatar);
          } catch (error) {
            console.error(
              "Lỗi khi lấy thông tin user:",
              error.response?.data || error
            );
          }
        };
    
        fetchUserData();
      }, []);
  
  const initiateLogout = () => {
    setShowConfirmModal(true);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    
    setTimeout(() => {
      try {
        localStorage.removeItem("token"); 
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("promo_closed");
        
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("promo_closed_")) {
            localStorage.removeItem(key);
          }
        });
        
        setFeedback("success");
        
        setTimeout(() => {
          navigate("/auth");
        }, 1500);
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        setFeedback("error");
        setIsLoggingOut(false);
      }
    }, 800);
  };

  return (
    <Container className="logout-section py-4">
      <Card className="shadow-sm border-0" style={{ marginTop: "-14%" }}>
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex align-items-center">
            <div className="logout-icon-wrapper me-3">
              <FaUserLock className="logout-icon" />
            </div>
            <div>
              <h4 className="mb-1">Đăng xuất tài khoản</h4>
              <p className="text-muted small mb-0">Đăng xuất khỏi tài khoản của bạn</p>
            </div>
          </div>
        </Card.Header>
        
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <img 
              src="https://img.freepik.com/free-vector/access-control-system-illustration_335657-4640.jpg" 
              alt="Logout Illustration" 
              className="logout-illustration mb-4"
              style={{ maxHeight: '200px' }}
            />
            <h5 className="mb-3">Cảm ơn bạn đã sử dụng HDND Store</h5>
          </div>
          
          <Alert variant="info" className="d-flex align-items-start">
            <FaExclamationTriangle className="me-2 mt-1 text-info" />
            <div>
              <strong>Lưu ý:</strong> Khi đăng xuất, bạn sẽ không thể truy cập vào các tính năng dành riêng cho người dùng đã đăng nhập.
            </div>
          </Alert>
          
          <div className="d-flex justify-content-center mt-4">
            <Button 
              variant="danger" 
              size="lg"
              className="px-4 logout-button"
              onClick={initiateLogout}
            >
              <FaSignOutAlt className="me-2" /> Đăng Xuất Ngay
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Confirmation Modal */}
      <Modal 
        show={showConfirmModal} 
        onHide={() => !isLoggingOut && setShowConfirmModal(false)}
        centered
        backdrop="static"
        className="logout-confirmation-modal"
      >
        <Modal.Header closeButton={!isLoggingOut}>
          <Modal.Title className="d-flex align-items-center"  style={{color: '#000'}}>
            <FaExclamationTriangle className="text-warning me-2" />
            Xác nhận đăng xuất
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="py-4">
          {feedback === "success" ? (
            <div className="text-center py-3">
              <div className="success-checkmark mb-3">
                <FaCheck className="success-icon" />
              </div>
              <h5 className="text-success mb-2">Đăng xuất thành công!</h5>
              <p className="text-muted">Bạn sẽ được chuyển hướng đến trang đăng nhập...</p>
            </div>
          ) : feedback === "error" ? (
            <Alert variant="danger">
              Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.
            </Alert>
          ) : (
            <>
              <p>Bạn có chắc chắn đăng xuất khỏi tài khoản không?</p>
              
              <div className="session-info p-3 rounded bg-light mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Email:</span>
                  <span className="fw-bold">{email || "user@example.com"}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Phiên đăng nhập:</span>
                  <span className="text-primary">{new Date().toLocaleString("vi-VN")}</span>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        
        {feedback === "" && (
          <Modal.Footer>
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowConfirmModal(false)}
              disabled={isLoggingOut}
            >
              <FaUndo className="me-1" /> Hủy bỏ
            </Button>
            <Button 
              variant="danger" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang đăng xuất...
                </>
              ) : (
                <>
                  <FaSignOutAlt className="me-1" /> Xác nhận đăng xuất
                </>
              )}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </Container>
  );
};

export default Logout;