import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import PropTypes from "prop-types";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom";
import toastService from "../../utils/toastService";

const LoginForm = ({ switchMode }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", JSON.stringify(user._id));

      toastService.success("Đăng nhập thành công!");

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin/users");
        } else {
          navigate("/home");
        }
      }, 2000); 

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toastService.error(error.response?.data?.error || "Lỗi đăng nhập!");
    }
  };


  return (
    <Form className="text-center" onSubmit={handleSubmit}>
      {error && <p className="text-danger">{error}</p>} 

      {/* Ô nhập email */}
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaEnvelope />
        </InputGroup.Text>
        <Form.Control
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="email-input py-2 px-3"
        />
      </InputGroup>

      {/* Ô nhập mật khẩu có icon mắt */}
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaLock />
        </InputGroup.Text>
        <Form.Control
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Mật khẩu"
          required
          value={formData.password}
          onChange={handleChange}
          className="email-input py-2 px-3"
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
        <Button
          variant="link"
          className="forgot-link"
          onClick={() => switchMode("forgot")}
        >
          Quên mật khẩu?
        </Button>
      </div>

      {/* Nút đăng nhập */}
      <Button variant="primary" className="w-100 login-btn p-3" type="submit">
        Đăng nhập
      </Button>

      {/* Chuyển sang đăng ký */}
      <p className="mt-3 d-flex justify-content-center align-items-center">
        Chưa có tài khoản?{" "}
        <Button variant="link" onClick={() => switchMode("register")}>
          Đăng ký
        </Button>
      </p>
    </Form>
  );
};

LoginForm.propTypes = {
  switchMode: PropTypes.func.isRequired,
};

export default LoginForm;