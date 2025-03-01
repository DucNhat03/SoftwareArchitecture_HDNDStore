import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaUser, FaPhone, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import PropTypes from "prop-types";

const RegisterForm = ({ switchMode }) => {
  const [password, setPassword] = useState(""); // Trạng thái mật khẩu
  const [confirmPassword, setConfirmPassword] = useState(""); // Trạng thái xác nhận mật khẩu
  const [showPassword, setShowPassword] = useState(false); // Hiển thị mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Hiển thị xác nhận mật khẩu

  return (
    <Form className="text-center">
      {/* Ô nhập tên đăng nhập */}
      <InputGroup className="mb-3">
        <InputGroup.Text><FaUser /></InputGroup.Text>
        <Form.Control type="text" placeholder="Tên đăng nhập" required />
      </InputGroup>

      {/* Ô nhập số điện thoại */}
      <InputGroup className="mb-3">
        <InputGroup.Text><FaPhone /></InputGroup.Text>
        <Form.Control type="tel" placeholder="Số điện thoại" required />
      </InputGroup>

      {/* Ô nhập mật khẩu có icon eye */}
      <InputGroup className="mb-3">
        <InputGroup.Text><FaLock /></InputGroup.Text>
        <Form.Control
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password && (
          <Button
            variant="outline-secondary"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </Button>
        )}
      </InputGroup>

      {/* Ô nhập lại mật khẩu có icon eye */}
      <InputGroup className="mb-3">
        <InputGroup.Text><FaLock /></InputGroup.Text>
        <Form.Control
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Nhắc lại mật khẩu"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {confirmPassword && (
          <Button
            variant="outline-secondary"
            className="eye-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </Button>
        )}
      </InputGroup>

      {/* Nút đăng ký */}
      <Button variant="success" className="w-100 register-btn" type="submit">
        Đăng ký
      </Button>

      {/* Chuyển sang đăng nhập */}
      <p className="mt-3 d-flex justify-content-center align-items-center">
        Đã có tài khoản? <Button variant="link" onClick={() => switchMode("login")}>Đăng nhập ngay</Button>
      </p>
    </Form>
  );
};

RegisterForm.propTypes = {
  switchMode: PropTypes.func.isRequired,
};

export default RegisterForm;
