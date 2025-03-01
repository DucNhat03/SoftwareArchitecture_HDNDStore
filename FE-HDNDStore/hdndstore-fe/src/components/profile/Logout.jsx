import { Container, Button, Card, Form } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import "../../styles/profile/Logout.css";

const Logout = () => {
  // Xử lý đăng xuất (ví dụ: xóa token, điều hướng)
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token (nếu có)
    window.location.href = "#"; // Chuyển về trang đăng nhập
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
