import { useState } from "react";
import { Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
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
          <Form.Label column sm={4}>
            Mật Khẩu Hiện Tại
          </Form.Label>
          <Col sm={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaLock />
              </InputGroup.Text>
              <Form.Control
                type={showPassword.current ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPassword.current ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Col>
          <Col sm={2} className="text-end">
            <Button variant="link" className="forgot-link">
              Quên mật khẩu?
            </Button>
          </Col>
        </Form.Group>

        {/* Mật khẩu mới */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Mật Khẩu Mới
          </Form.Label>
          <Col sm={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaLock />
              </InputGroup.Text>
              <Form.Control
                type={showPassword.new ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Col>
        </Form.Group>

        {/* Xác nhận mật khẩu */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Xác Nhận Mật Khẩu
          </Form.Label>
          <Col sm={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaLock />
              </InputGroup.Text>
              <Form.Control
                type={showPassword.confirm ? "text" : "password"}
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-4 d-flex justify-content-center align-items-center"
        >
          <Col sm={8} className="text-end">
            <Button variant="danger" className="mt-2">
              Xác Nhận
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
