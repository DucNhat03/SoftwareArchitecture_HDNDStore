import { Routes, Route, useLocation } from "react-router-dom";
import { Breadcrumb, Container, Row, Col } from "react-bootstrap";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileForm from "../components/profile/ProfileForm";
import ChangePasswordForm from "../components/profile/ChangePasswordForm";
import Orders from "../components/profile/Orders";
import Notifications from "../components/profile/Notifications";
import Vouchers from "../components/profile/Vouchers";
import Wishlist from "../components/profile/Wishlist";
import Logout from "../components/profile/Logout";
import "../styles/profile/Profile.css";
import Header from "../components/layout/Header";

const ProfilePage = () => {
  const location = useLocation();

  // Lấy section từ URL, nếu không có thì mặc định là "profile"
  const section = location.pathname.replace("/profile/", "") || "profile";

  return (
    <>
      <Header />
      <Container className="mt-6 profile-container">
        {/* Thanh điều hướng (Breadcrumb) */}
        <Breadcrumb className="breadcrumb-custom">
          <Breadcrumb.Item href="/home">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>
            {section === "profile"
              ? "Hồ sơ"
              : section === "change_password"
              ? "Đổi mật khẩu"
              : section === "orders"
              ? "Đơn mua"
              : section === "notifications"
              ? "Thông báo"
              : section === "vouchers"
              ? "Kho voucher"
              : section === "wishlist"
              ? "Sản phẩm yêu thích"
              : section === "logout"
              ? "Đăng xuất"
              : "Hồ sơ"}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          <Col md={3}>
            <ProfileSidebar activeSection={section} />
          </Col>
          <Col md={9}>
            <Routes>
              <Route path="/" element={<ProfileForm />} />
              <Route path="change_password" element={<ChangePasswordForm />} />
              <Route path="orders" element={<Orders />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="vouchers" element={<Vouchers />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="logout" element={<Logout />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProfilePage;