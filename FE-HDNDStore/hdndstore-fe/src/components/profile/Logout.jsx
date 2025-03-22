import { Container, Button, Card, Form } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import "../../styles/profile/Logout.css";
import { useNavigate } from "react-router-dom"; 

const Logout = () => {
  const navigate = useNavigate(); 

  // Xử lý đăng xuất (xóa token, điều hướng)
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("promo_closed");

    // Xóa tất cả các key có tiền tố "promo_closed_"
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("promo_closed_")) {
            localStorage.removeItem(key);
        }
    });

    // Xóa thêm các thông tin khác nếu cần
    // localStorage.removeItem("carts");
    // localStorage.removeItem("selectedProduct");

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
