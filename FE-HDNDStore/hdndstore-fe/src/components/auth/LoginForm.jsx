import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import PropTypes from "prop-types";

const LoginForm = ({ switchMode }) => {
  const [password, setPassword] = useState(""); // Lưu trạng thái mật khẩu
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu

  return (
    <Form className="text-center">
      {/* Ô nhập tên đăng nhập */}
      <InputGroup className="mb-3">
        <InputGroup.Text><FaUser /></InputGroup.Text>
        <Form.Control type="email" placeholder="Tên đăng nhập" required />
      </InputGroup>

      {/* Ô nhập mật khẩu có icon mắt */}
      <InputGroup className="mb-3">
        <InputGroup.Text><FaLock /></InputGroup.Text>
        <Form.Control
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Hiển thị icon eye nếu có nhập mật khẩu */}
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

      {/* Ghi nhớ mật khẩu & quên mật khẩu */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Check type="checkbox" label="Ghi nhớ mật khẩu" />
        <Button variant="link" className="forgot-link" onClick={() => switchMode("forgot")}>
          Quên mật khẩu?
        </Button>
      </div>

      {/* Nút đăng nhập */}
      <Button variant="primary" className="w-100 login-btn" type="submit">
        Đăng nhập
      </Button>

      {/* Chuyển sang đăng ký */}
      <p className="mt-3 d-flex justify-content-center align-items-center">
        Chưa có tài khoản? <Button variant="link" onClick={() => switchMode("register")}>Đăng ký</Button>
      </p>
    </Form>
  );
};

LoginForm.propTypes = {
  switchMode: PropTypes.func.isRequired,
};

export default LoginForm;
