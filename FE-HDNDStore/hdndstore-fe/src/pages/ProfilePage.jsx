import { useState } from "react";
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
  const [activeSection, setActiveSection] = useState("profile");

  // Danh sách tiêu đề Breadcrumb dựa trên activeSection
  const breadcrumbTitles = {
    profile: "Hồ sơ",
    change_password: "Đổi mật khẩu",
    orders: "Đơn mua",
    notifications: "Thông báo",
    vouchers: "Kho voucher",
    wishlist: "Sản phẩm yêu thích",
    logout: "Đăng xuất",
  };

  return (
    <>
      <Header />
      <Container className="mt-6 profile-container">
        {/* Thanh điều hướng (Breadcrumb) */}
        <Breadcrumb className="breadcrumb-custom">
          <Breadcrumb.Item href="/home">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>{breadcrumbTitles[activeSection]}</Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          <Col md={3}>
            <ProfileSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          </Col>
          <Col md={9}>
            {activeSection === "profile" && <ProfileForm />}
            {activeSection === "change_password" && <ChangePasswordForm />}
            {activeSection === "orders" && <Orders />}
            {activeSection === "notifications" && <Notifications />}
            {activeSection === "vouchers" && <Vouchers />}
            {activeSection === "wishlist" && <Wishlist />}
            {activeSection === "logout" && <Logout />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProfilePage;
