import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProfileSidebar = ({ activeSection }) => {
  const navigate = useNavigate();

  const menuItems = [
    { key: "", label: "Hồ sơ" },
    { key: "change_password", label: "Đổi mật khẩu" },
    { key: "orders", label: "Đơn mua" },
    { key: "notifications", label: "Thông báo" },
    { key: "vouchers", label: "Kho voucher" },
    { key: "wishlist", label: "Sản phẩm yêu thích" },
    { key: "logout", label: "Đăng xuất" },
  ];

  return (
    <ListGroup variant="flush">
      {menuItems.map((item) => (
        <ListGroup.Item
          key={item.key}
          action
          active={activeSection === item.key}
          onClick={() => navigate(`/profile/${item.key}`)}
        >
          {item.label}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
ProfileSidebar.propTypes = {
  activeSection: PropTypes.string.isRequired,
};

export default ProfileSidebar;