import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import PropTypes from "prop-types";
import api from "../../services/api"; // Gọi API đăng nhập
import { useNavigate } from "react-router-dom";
import toastService from "../../utils/toastService";

const LoginForm = ({ switchMode }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu
  const [error, setError] = useState(""); // Lưu lỗi đăng nhập
  const navigate = useNavigate();

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý submit form đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token); // Lưu token vào localStorage
      toastService.success("Đăng nhập thành công!"); 
      setTimeout(() => navigate("/profile"), 2000); // Chuyển hướng sau khi hiển thị toast
    } catch (error) {
      toastService.error(error.response?.data?.error || "Lỗi đăng nhập!");
    }
  };

  return (
    <Form className="text-center" onSubmit={handleSubmit}>
      {error && <p className="text-danger">{error}</p>} {/* Hiển thị lỗi */}

      {/* Ô nhập email */}
      <InputGroup className="mb-3">
        <InputGroup.Text><FaEnvelope /></InputGroup.Text>
        <Form.Control
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />
      </InputGroup>

      {/* Ô nhập mật khẩu có icon mắt */}
      <InputGroup className="mb-3">
        <InputGroup.Text><FaLock /></InputGroup.Text>
        <Form.Control
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Mật khẩu"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          variant="outline-secondary"
          className="eye-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </Button>
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
