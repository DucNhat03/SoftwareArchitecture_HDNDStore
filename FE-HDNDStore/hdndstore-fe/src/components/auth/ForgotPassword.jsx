import { Form, Button, InputGroup } from "react-bootstrap";
import { FaEnvelope } from "react-icons/fa";
import PropTypes from "prop-types";

const ForgotPassword = ({ switchMode }) => {
  return (
    <Form className="text-center">
      <h4>LẤY LẠI MẬT KHẨU</h4>
      <p className="mb-3">Nhập Email để khôi phục mật khẩu</p>

      <InputGroup className="mb-3">
        <InputGroup.Text><FaEnvelope /></InputGroup.Text>
        <Form.Control type="email" placeholder="Email" required />
      </InputGroup>

      <Button variant="warning" className="w-100 reset-btn" type="submit">
        Lấy lại mật khẩu
      </Button>

      <div className="text-center mt-3">
        <Button variant="link" onClick={() => switchMode("login")}>Quay lại</Button>
      </div>

    </Form>
  );
};

ForgotPassword.propTypes = {
  switchMode: PropTypes.func.isRequired,
};

export default ForgotPassword;
