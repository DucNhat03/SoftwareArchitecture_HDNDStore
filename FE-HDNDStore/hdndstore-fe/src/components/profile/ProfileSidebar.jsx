import PropTypes from "prop-types";
import { ListGroup } from "react-bootstrap";
import { FaUser, FaKey, FaBox, FaBell, FaTag, FaHeart, FaSignOutAlt } from "react-icons/fa";
import "../../styles/profile/Profile.css";

const ProfileSidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: "profile", label: "Hồ Sơ", icon: <FaUser /> },
    { id: "change_password", label: "Đổi Mật Khẩu", icon: <FaKey /> },
    { id: "orders", label: "Đơn Mua", icon: <FaBox /> },
    { id: "notifications", label: "Thông Báo", icon: <FaBell /> },
    { id: "vouchers", label: "Kho Voucher", icon: <FaTag /> },
    { id: "wishlist", label: "Sản Phẩm Yêu Thích", icon: <FaHeart /> },
    { id: "logout", label: "Đăng Xuất", icon: <FaSignOutAlt /> },
  ];

  return (
    <ListGroup className="sidebar-menu">
      {menuItems.map((item) => (
        <ListGroup.Item
          key={item.id}
          action
          onClick={() => setActiveSection(item.id)}
          className={`sidebar-item ${activeSection === item.id ? "active" : ""}`}
        >
          <span className="menu-icon">{item.icon}</span>
          {item.label}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

ProfileSidebar.propTypes = {
  activeSection: PropTypes.string.isRequired,
  setActiveSection: PropTypes.func.isRequired,
};

export default ProfileSidebar;
