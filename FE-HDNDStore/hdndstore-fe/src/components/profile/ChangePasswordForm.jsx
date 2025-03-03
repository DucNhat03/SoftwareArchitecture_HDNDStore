import { useState } from "react";
import { Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../services/api"; // Import API helper
import toastService from "../../utils/toastService"; // Import Toast
import "../../styles/profile/Profile.css";

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Toggle hiển thị mật khẩu
  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Xử lý đổi mật khẩu
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toastService.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toastService.success(response.data.message || "Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toastService.error(error.response?.data?.error || "Lỗi đổi mật khẩu!");
    }
  };

  return (
    <div className="card p-5">
      <h4 className="mb-3">Đổi Mật Khẩu</h4>
      <p>
        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
      </p>
      <hr />

      <Form>
        {/* Mật khẩu hiện tại */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>Mật Khẩu Hiện Tại</Form.Label>
          <Col sm={5}>
            <InputGroup>
              <InputGroup.Text><FaLock /></InputGroup.Text>
              <Form.Control
                type={showPassword.current ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={() => togglePasswordVisibility("current")}>
                {showPassword.current ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Col>
        </Form.Group>

        {/* Mật khẩu mới */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>Mật Khẩu Mới</Form.Label>
          <Col sm={5}>
            <InputGroup>
              <InputGroup.Text><FaLock /></InputGroup.Text>
              <Form.Control
                type={showPassword.new ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={() => togglePasswordVisibility("new")}>
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Col>
        </Form.Group>

        {/* Xác nhận mật khẩu */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>Xác Nhận Mật Khẩu</Form.Label>
          <Col sm={5}>
            <InputGroup>
              <InputGroup.Text><FaLock /></InputGroup.Text>
              <Form.Control
                type={showPassword.confirm ? "text" : "password"}
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={() => togglePasswordVisibility("confirm")}>
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-4 d-flex justify-content-center align-items-center">
          <Col sm={6} className="text-end">
            <Button variant="danger" className="mt-4" onClick={handleResetPassword}>
              Xác Nhận
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
