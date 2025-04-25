import { useState } from "react";
import { Form, Button, InputGroup, Row, Col, Card, Alert, Container, ProgressBar } from "react-bootstrap";
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaExclamationTriangle, FaCheck, FaInfoCircle } from "react-icons/fa";
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
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Toggle hiển thị mật khẩu
  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    if (!password) return { score: 0, text: "Yếu", variant: "danger" };
    
    let score = 0;
    
    // Criteria checks
    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Return result based on score
    if (score === 0) return { score: 0, text: "Rất yếu", variant: "danger" };
    if (score < 2) return { score: 1, text: "Yếu", variant: "danger" };
    if (score < 4) return { score: 2, text: "Trung bình", variant: "warning" };
    if (score < 5) return { score: 3, text: "Mạnh", variant: "success" };
    return { score: 4, text: "Rất mạnh", variant: "success" };
  };

  // Get password strength
  const passwordStrength = checkPasswordStrength(newPassword);

  // Check if passwords match
  const passwordsMatch = confirmPassword && newPassword === confirmPassword;
  
  // Validate new password meets criteria
  const validatePassword = () => {
    if (!newPassword) return true; // No validation if empty
    
    const hasMinLength = newPassword.length >= 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    
    return hasMinLength && hasUpperCase && hasNumbers;
  };

  // Has the form been touched?
  const formTouched = currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0;
  
  // Is the form valid?
  const isFormValid = 
    currentPassword.length > 0 && 
    newPassword.length > 0 && 
    confirmPassword.length > 0 &&
    passwordsMatch &&
    validatePassword();

  // Xử lý đổi mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFormError("");
    
    if (!isFormValid) {
      if (!passwordsMatch) {
        setFormError("Mật khẩu nhập lại không khớp!");
        return;
      }
      
      if (!validatePassword()) {
        setFormError("Mật khẩu mới không đáp ứng yêu cầu bảo mật!");
        return;
      }
      
      return;
    }
    
    setLoading(true);

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
      const errorMessage = error.response?.data?.error || "Lỗi đổi mật khẩu!";
      setFormError(errorMessage);
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="password-change-container py-4">
      <Card className="shadow-sm border-0" style={{ marginTop: "-13%" }}>
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex align-items-center">
            <div className="password-icon-wrapper me-3">
              <FaShieldAlt className="password-icon" />
            </div>
            <div>
              <h4 className="mb-1">Đổi Mật Khẩu</h4>
              <p className="text-muted small mb-0">
                Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
              </p>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-4">
          {formError && (
            <Alert variant="danger" className="d-flex align-items-center">
              <FaExclamationTriangle className="me-2" />
              <div>{formError}</div>
            </Alert>
          )}
          
          <Alert variant="info" className="d-flex mb-4">
            <FaInfoCircle className="me-2 mt-1" />
            <div>
              <p className="mb-2">Mật khẩu mới của bạn cần đáp ứng các yêu cầu sau:</p>
              <ul className="ps-3 mb-0">
                <li>Ít nhất 8 ký tự</li>
                <li>Ít nhất 1 chữ hoa</li>
                <li>Ít nhất 1 số</li>
                <li>Nên có ký tự đặc biệt (!@#$%^&*)</li>
              </ul>
            </div>
          </Alert>

          <Form onSubmit={handleResetPassword}>
            <div className="password-form-inner py-2">
              {/* Mật khẩu hiện tại */}
              <Form.Group className="mb-4">
                <Form.Label>Mật Khẩu Hiện Tại</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light"><FaLock /></InputGroup.Text>
                  <Form.Control
                    type={showPassword.current ? "text" : "password"}
                    placeholder="Nhập mật khẩu hiện tại"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="py-2"
                  />
                  <Button 
                    variant="light" 
                    onClick={() => togglePasswordVisibility("current")}
                    className="password-toggle-btn"
                  >
                    {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              {/* Mật khẩu mới */}
              <Form.Group className="mb-3">
                <Form.Label>Mật Khẩu Mới</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light"><FaLock /></InputGroup.Text>
                  <Form.Control
                    type={showPassword.new ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    isInvalid={newPassword && !validatePassword()}
                    className="py-2"
                  />
                  <Button 
                    variant="light" 
                    onClick={() => togglePasswordVisibility("new")}
                    className="password-toggle-btn"
                  >
                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
                
                {newPassword && (
                  <div className="mt-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small>Độ mạnh mật khẩu: </small>
                      <small className={`text-${passwordStrength.variant}`}>{passwordStrength.text}</small>
                    </div>
                    <ProgressBar 
                      now={(passwordStrength.score / 4) * 100} 
                      variant={passwordStrength.variant} 
                      style={{ height: "6px" }}
                    />
                  </div>
                )}
              </Form.Group>

              {/* Xác nhận mật khẩu */}
              <Form.Group className="mb-4">
                <Form.Label>Xác Nhận Mật Khẩu</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light"><FaLock /></InputGroup.Text>
                  <Form.Control
                    type={showPassword.confirm ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={confirmPassword && !passwordsMatch}
                    isValid={confirmPassword && passwordsMatch}
                    className="py-2"
                  />
                  <Button 
                    variant="light" 
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="password-toggle-btn"
                  >
                    {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
                {confirmPassword && !passwordsMatch && (
                  <Form.Text className="text-danger">
                    Mật khẩu nhập lại không khớp!
                  </Form.Text>
                )}
                {confirmPassword && passwordsMatch && (
                  <Form.Text className="text-success d-flex align-items-center">
                    <FaCheck className="me-1" /> Mật khẩu khớp
                  </Form.Text>
                )}
              </Form.Group>

              <div className="d-grid mt-4">
                <Button 
                  type="submit"
                  variant="primary" 
                  size="lg"
                  disabled={!isFormValid || loading}
                  className="change-password-btn py-2"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>Cập nhật mật khẩu</>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ChangePasswordForm;