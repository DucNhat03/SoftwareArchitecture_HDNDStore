import { useState } from "react";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import { FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import PropTypes from "prop-types";
import { register, verifyEmail, resendVerificationEmail } from "../../services/api";
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
  
  // New state for email verification flow
  const [registrationStep, setRegistrationStep] = useState("form"); // form, verification
  const [verificationCode, setVerificationCode] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

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
      // Send registration data to be stored in Redis temporarily
      const userData = {
        email: formData.email,
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
      };
      
      const response = await register(userData);
      
      setSuccess(response.message);
      setRegisteredEmail(response.email);
      setRegistrationStep("verification");
    } catch (err) {
      setError(err.error || "Lỗi đăng ký, vui lòng thử lại!");
      toastService.error(err.error || "Lỗi đăng ký, vui lòng thử lại!");
    }
  };
  
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!verificationCode) {
      setError("Vui lòng nhập mã xác thực!");
      return;
    }
    
    try {
      const response = await verifyEmail(registeredEmail, verificationCode);
      setSuccess(response.message);
      toastService.success(response.message);
      
      // After successful verification, redirect to login
      setTimeout(() => switchMode("login"), 2000);
    } catch (err) {
      setError(err.error || "Lỗi xác thực, vui lòng thử lại!");
      toastService.error(err.error || "Lỗi xác thực, vui lòng thử lại!");
    }
  };
  
  const handleResendCode = async () => {
    setError("");
    setIsResending(true);
    
    try {
      const response = await resendVerificationEmail(registeredEmail);
      setSuccess(response.message);
      toastService.success(response.message);
    } catch (err) {
      setError(err.error || "Lỗi khi gửi lại mã xác thực!");
      toastService.error(err.error || "Lỗi khi gửi lại mã xác thực!");
    } finally {
      setIsResending(false);
    }
  };

  // Render registration form
  if (registrationStep === "form") {
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
            className="email-input py-2 px-3"
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
            className="email-input py-2 px-3"
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
            className="email-input py-2 px-3"
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
        <Button variant={"primary"} className="w-100 register-btn p-3" type="submit">
          Đăng ký
        </Button>

        {/* Chuyển sang đăng nhập */}
        <p className="mt-3 d-flex justify-content-center align-items-center">
          Đã có tài khoản? <Button variant="link" onClick={() => switchMode("login")}>Đăng nhập ngay</Button>
        </p>
      </Form>
    );
  }
  
  // Render email verification form
  return (
    <Form className="text-center" onSubmit={handleVerifyEmail}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <div className="mb-4">
        <h5 className="mb-3">Xác thực email</h5>
        <p>Một mã xác thực đã được gửi đến email <strong>{registeredEmail}</strong>.</p>
        <p>Vui lòng kiểm tra hộp thư và nhập mã xác thực để hoàn tất đăng ký.</p>
      </div>
      
      {/* Ô nhập mã xác thực */}
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Nhập mã xác thực 6 chữ số"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          className="verification-input py-2 px-3 text-center"
          maxLength="6"
        />
      </InputGroup>
      
      {/* Nút xác nhận */}
      <Button variant="primary" className="w-100 verify-btn p-3 mb-3" type="submit">
        Xác nhận
      </Button>
      
      {/* Nút gửi lại mã */}
      <Button 
        variant="link" 
        className="resend-btn" 
        onClick={handleResendCode}
        disabled={isResending}
      >
        {isResending ? 'Đang gửi lại...' : 'Gửi lại mã xác thực'}
      </Button>
      
      {/* Quay lại form đăng ký */}
      <div className="mt-3">
        <Button variant="outline-secondary" onClick={() => setRegistrationStep("form")}>
          Quay lại
        </Button>
      </div>
    </Form>
  );
};

RegisterForm.propTypes = {
  switchMode: PropTypes.func.isRequired,
};

export default RegisterForm;