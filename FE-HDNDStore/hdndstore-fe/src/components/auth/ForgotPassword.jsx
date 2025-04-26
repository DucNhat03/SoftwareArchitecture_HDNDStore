import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaEnvelope, FaKey } from "react-icons/fa";
import PropTypes from "prop-types";
import { sendOtp, verifyOtp, resetPassword } from "../../services/api.js";
import toastService from "../../utils/toastService.js";

const ForgotPassword = ({ switchMode }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Đặt mật khẩu mới
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  // const [message, setMessage] = useState("");

  // Gửi OTP đến email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await sendOtp(email);
      setStep(2);
      toastService.success("Mã OTP đã được gửi đến email!");
    } catch (error) {
      toastService.error(error.error || showError(error.error || "Lỗi gửi OTP!"));
    }
  };

  // Xác minh OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(email, otp);
      setStep(3);
      toastService.success("OTP hợp lệ, vui lòng nhập mật khẩu mới!");
    } catch (error) {
      toastService.error(error.error || showError(error.error || "Lỗi xác minh OTP!"));
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email, newPassword);
      toastService.success("Mật khẩu đã được đặt lại thành công!");
      setTimeout(() => switchMode("login"), 1500); 
    } catch (error) {
      toastService.error(error.error || showError(error.error || "Lỗi đặt lại mật khẩu!"));
    }
  };

  // Hien thi loi
  const showError = (message) => (
    toastService.error(message)
  );


  return (
    <Form className="text-center">

      {step === 1 && (
        <>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaEnvelope />
            </InputGroup.Text>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="email-input py-2 px-3"
            />
          </InputGroup>
          <Button
            variant="warning"
            className="w-100 reset-btn p-3"
            onClick={handleSendOtp}

          >
            Lấy lại mật khẩu
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="mb-3">Nhập mã OTP đã gửi đến email</p>
          <Form.Control
            type="text"
            placeholder="Mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="email-input py-2 px-3"

          />
          <Button
            variant="warning"
            className="w-100 reset-btn mt-3"
            onClick={handleVerifyOtp}
          >
            Xác minh OTP
          </Button>
        </>
      )}

      {step === 3 && (
        <>
          <p className="mb-3">Nhập mật khẩu mới</p>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaKey />
            </InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="email-input py-2 px-3"
            />
          </InputGroup>
          <Button
            variant="warning"
            className="w-100 reset-btn"
            onClick={handleResetPassword}
          >
            Cập nhật mật khẩu
          </Button>
        </>
      )}

      <div className="text-center mt-3">
        <Button variant="link" onClick={() => switchMode("login")}>
          Quay lại
        </Button>
      </div>
    </Form>
  );
};

ForgotPassword.propTypes = {
  switchMode: PropTypes.func.isRequired,
};

export default ForgotPassword;
