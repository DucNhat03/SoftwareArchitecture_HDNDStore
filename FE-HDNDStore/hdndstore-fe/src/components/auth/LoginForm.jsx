import { Form, Button, InputGroup } from "react-bootstrap";
import { FaUser, FaLock } from "react-icons/fa";
import PropTypes from "prop-types";

const LoginForm = ({ switchMode }) => {
  return (
    <Form className="text-center">
      <InputGroup className="mb-3">
        <InputGroup.Text><FaUser /></InputGroup.Text>
        <Form.Control type="email" placeholder="Tên đăng nhập" required />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text><FaLock /></InputGroup.Text>
        <Form.Control type="password" placeholder="Mật khẩu" required />
      </InputGroup>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Check type="checkbox" label="Ghi nhớ mật khẩu" />
        <Button variant="link" className="forgot-link" onClick={() => switchMode("forgot")}>
          Quên mật khẩu?
        </Button>
      </div>

      <Button variant="primary" className="w-100 login-btn" type="submit">
        Đăng nhập
      </Button>

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
