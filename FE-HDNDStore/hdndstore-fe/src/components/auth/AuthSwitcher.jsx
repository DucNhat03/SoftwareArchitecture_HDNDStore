import { useState, useEffect } from "react";
import { Card, Container, Button, Row, Col, Image } from "react-bootstrap";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toastService from "../../utils/toastService";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPassword from "./ForgotPassword";
import "../../styles/AuthSwitcher.css";
import logo from "../../assets/img-shop/logo-txt.png"; 

const AuthSwitcher = () => {
  const [authMode, setAuthMode] = useState("login");
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Add animation effect on load
    setTimeout(() => setLoaded(true), 100);
  }, []);

  // Xử lý đăng nhập Google
  const handleGoogle = async (response) => {
    if (!response.credential) {
      toastService.error("Không nhận được ID Token từ Google!");
      return;
    }

    try {
      console.log("Google ID Token:", response.credential);

      const res = await api.post("/auth/google", {
        token: response.credential,
      });

      localStorage.setItem("token", res.data.token);
      toastService.success("Đăng nhập Google thành công!");
      navigate("/profile");
    } catch (error) {
      console.error("Google Login Failed:", error);
      toastService.error("Lỗi đăng nhập Google!");
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="auth-background">
        <div className="auth-gradient-overlay"></div>
        <div className="auth-circles"></div>
        
        <Container className={`d-flex justify-content-center align-items-center min-vh-100 auth-container ${loaded ? 'fade-in' : ''}`}>
          <Card className="auth-card p-4 shadow-lg bg-white border-0">
            {/* Logo */}
            <div className="text-center mb-4">
              <Image 
                src={logo} 
                alt="HDND Store" 
                width={140}
                className="mb-3"
              />
              <h4 className="fw-bold">
                {authMode === "login" ? "ĐĂNG NHẬP TÀI KHOẢN" : 
                 authMode === "register" ? "ĐĂNG KÝ TÀI KHOẢN" : 
                 "KHÔI PHỤC MẬT KHẨU"}
              </h4>
              <p className="text-muted small">
                {authMode === "login" ? "" : 
                 authMode === "register" ? "" : 
                 "Nhập email của bạn để lấy lại mật khẩu!"}
              </p>
            </div>
            
            {/* Toggle giữa Login và Register */}
            {authMode !== "forgot" && (
              <Row className="mb-4 ">
                <Col className="col-container d-flex gap-2">
                  <Button
                    variant={authMode === "login" ? "primary" : "outline-secondary"}
                    className="flex-grow-1 rounded-start py-2.5 toggle-btn"
                    onClick={() => setAuthMode("login")}
                  >
                    ĐĂNG NHẬP
                  </Button>
                  <Button
                    variant={authMode === "register" ? "primary" : "outline-secondary"}
                    className="flex-grow-1 rounded-end py-2.5 toggle-btn"
                    onClick={() => setAuthMode("register")}
                  >
                    ĐĂNG KÝ
                  </Button>
                </Col>
              </Row>
            )}

            {/* Hiển thị form login/register/forgot */}
            <div className="auth-form-container">
              {authMode === "login" && <LoginForm switchMode={setAuthMode} />}
              {authMode === "register" && <RegisterForm switchMode={setAuthMode} />}
              {authMode === "forgot" && <ForgotPassword switchMode={setAuthMode} />}
            </div>

            {/* Đăng nhập với Google (Ẩn khi ở chế độ forgot password) */}
            {authMode !== "forgot" && (
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted small">Hoặc đăng nhập với:</p>
                <div className="social-login mb-3">
                  <GoogleLogin
                    onSuccess={handleGoogle}
                    onError={() => toastService.error("Đăng nhập Google thất bại!")}
                    useOneTap
                    type="icon"
                    shape="circle"
                    theme="filled_blue"
                    size="large"
                  />
                </div>
              </div>
            )}
            
            {/* Footer */}
            <div className="text-center mt-3">
              <small className="text-muted">
                © {new Date().getFullYear()} HDND Store. Tất cả thông tin được bảo mật.
              </small>
            </div>
          </Card>
        </Container>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthSwitcher;