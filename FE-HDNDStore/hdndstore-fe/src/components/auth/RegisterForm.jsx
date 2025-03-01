import { Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";


const RegisterForm = ({ switchMode }) => {
  return (
    <Form className="text-center">
      <Form.Group className="mb-3">
        <Form.Control type="text" placeholder="Tên đăng nhập" required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control type="phone" placeholder="Số điện thoại" required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control type="password" placeholder="Mật khẩu" required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control type="password" placeholder="Nhắc lại mật khẩu" required />
      </Form.Group>

      <Button variant="success" className="w-100 register-btn" type="submit">
        Đăng ký
      </Button>

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
