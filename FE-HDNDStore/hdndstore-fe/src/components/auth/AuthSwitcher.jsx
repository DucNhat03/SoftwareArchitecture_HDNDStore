import { useState } from "react";
import { Card, Container, Button, Row, Col } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPassword from "./ForgotPassword";
import "../../styles/AuthSwitcher.css";

const AuthSwitcher = () => {
  const [authMode, setAuthMode] = useState("login");

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 auth-container">
      <Card className="auth-card p-4 shadow-lg">
        {/* Toggle giữa Login và Register */}
        <Row>
          <Col className="col-container" >
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

        {/* Đăng nhập với mạng xã hội */}
        <div className="text-center my-3">
          <p>Đăng nhập với:</p>
          <div className="social-icons">
            <FaFacebookF className="social-icon" />
            <FcGoogle className="social-icon" />
            <FaTwitter className="social-icon" />
            <FaGithub className="social-icon" />
          </div>
          <p className="mt-2">or:</p>
        </div>

        {/* Hiển thị form login/register/forgot */}
        {authMode === "login" && <LoginForm switchMode={setAuthMode} />}
        {authMode === "register" && <RegisterForm switchMode={setAuthMode} />}
        {authMode === "forgot" && <ForgotPassword switchMode={setAuthMode} />}
      </Card>
    </Container>
  );
};

export default AuthSwitcher;
