import { useState } from "react";
import { Tabs, Tab, Container, Row, Col, Image } from "react-bootstrap";
import "../../styles/profile/Orders.css";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Danh sách các tab
  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "processing", label: "Chờ lấy hàng" },
    { key: "shipping", label: "Đang giao" },
    { key: "delivered", label: "Đã giao" },
    { key: "cancelled", label: "Đã Hủy" },
  ];

  return (
    <Container className="orders-container card p-2">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="orders-tabs"
      >
        {tabs.map((tab) => (
          <Tab key={tab.key} eventKey={tab.key} title={tab.label}>
            <Row className="justify-content-center mt-4">
              <Col md={6} className="text-center">
                <Image
                  src="https://static.vecteezy.com/system/resources/thumbnails/020/696/242/small_2x/3d-minimal-customer-order-online-shopping-concept-customer-service-concept-order-clipboard-with-a-checkmark-3d-illustration-png.png"
                  alt="No Orders"
                  className="empty-orders-img"
                />
                <p className="mt-3">Chưa có đơn hàng</p>
              </Col>
            </Row>
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
};

export default Orders;
