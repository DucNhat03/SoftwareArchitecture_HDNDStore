import { Container, Button, Card, Form } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import "../../styles/profile/Logout.css";
import { useNavigate } from "react-router-dom"; 

const Logout = () => {
  const navigate = useNavigate(); 

  // Xử lý đăng xuất (xóa token, điều hướng)
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khỏi localStorage
    localStorage.removeItem("userId"); // Xóa User khỏi localStorage
    navigate("/auth"); 
  };

  return (
    <Container className="logout-container">
      <Card className="logout-card p-2 text-center">
        <h4 className="mb-3">Bạn có chắc chắn muốn đăng xuất?</h4>
        <p className="text-muted">
          Hãy đảm bảo rằng bạn đã lưu tất cả công việc trước khi đăng xuất khỏi tài khoản.
        </p>

        <Form className="d-flex justify-content-center gap-3">
          <Button variant="danger" onClick={handleLogout}>
            <FaSignOutAlt className="me-1" /> Đăng Xuất
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Logout;
