import { useState } from "react";
import { Card, Container, Button, Row, Col } from "react-bootstrap";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toastService from "../../utils/toastService";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPassword from "./ForgotPassword";
import "../../styles/AuthSwitcher.css";

const AuthSwitcher = () => {
  const [authMode, setAuthMode] = useState("login");
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
      <Container className="d-flex justify-content-center align-items-center min-vh-100 auth-container">
        <Card className="auth-card p-4 shadow-lg">
          {/* Toggle giữa Login và Register */}
          <Row>
            <Col className="col-container">
              <Button
                variant={authMode === "login" ? "primary" : "light"}
                className="toggle-btn"
                onClick={() => setAuthMode("login")}
              >
                ĐĂNG NHẬP
              </Button>
              <Button
                variant={authMode === "register" ? "primary" : "light"}
                className="toggle-btn"
                onClick={() => setAuthMode("register")}
              >
                ĐĂNG KÝ
              </Button>
            </Col>
          </Row>

          {/* Đăng nhập với Google */}
          <div className="text-center my-3">
            <p>Hoặc đăng nhập với:</p>
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => toastService.error("Đăng nhập Google thất bại!")}
              useOneTap
            />
          </div>

          {/* Hiển thị form login/register/forgot */}
          {authMode === "login" && <LoginForm switchMode={setAuthMode} />}
          {authMode === "register" && <RegisterForm switchMode={setAuthMode} />}
          {authMode === "forgot" && <ForgotPassword switchMode={setAuthMode} />}
        </Card>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default AuthSwitcher;
