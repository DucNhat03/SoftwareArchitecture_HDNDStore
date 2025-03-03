import { useState } from "react";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import { FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import PropTypes from "prop-types";
import axios from "axios";
import toastService from "../../utils/toastService";


const RegisterForm = ({ switchMode }) => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/auth/register", {
        email: formData.email, // Email
        password: formData.password,
        fullName: formData.fullName || "",
        phone: formData.phone,
        gender: formData.gender || "other",
        birthday: {
          day: formData.birthdayDay || "",
          month: formData.birthdayMonth || "",
          year: formData.birthdayYear || "",
        },
        address: {
          city: formData.city || "",
          district: formData.district || "",
          ward: formData.ward || "",
          street: formData.street || "",
        },
        avatar: "", // upload ảnh
      });

      {/*setSuccess(response.data.message || "Đăng ký thành công!"); */}
      toastService.success(response.data.message || "Đăng ký thành công!");
      setTimeout(() => switchMode("login"), 2000);
    } catch (err) {
      {/*setError(err.response?.data?.error || "Lỗi đăng ký, vui lòng thử lại!");*/}
      toastService.error(err.response?.data?.error || "Lỗi đăng ký, vui lòng thử lại!");
    }
  };


  return (
    <Form className="text-center" onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Ô nhập Email */}
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

      {/* Ô nhập số điện thoại */}
      <InputGroup className="mb-3">
        <InputGroup.Text><FaPhone /></InputGroup.Text>
        <Form.Control
          type="tel"
          placeholder="Số điện thoại"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </InputGroup>

      {/* Ô nhập mật khẩu có icon eye */}
      <InputGroup className="mb-3">
        <InputGroup.Text><FaLock /></InputGroup.Text>
        <Form.Control
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button
          variant="outline-secondary"
          className="eye-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </Button>
      </InputGroup>

      {/* Ô nhập lại mật khẩu có icon eye */}
      <InputGroup className="mb-3">
        <InputGroup.Text><FaLock /></InputGroup.Text>
        <Form.Control
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Nhắc lại mật khẩu"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button
          variant="outline-secondary"
          className="eye-btn"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </Button>
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
