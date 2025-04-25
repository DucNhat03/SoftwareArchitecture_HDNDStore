import { useEffect, useState } from "react";
import { ListGroup, Container, Button, Badge, Toast, Card, Row, Col, Spinner } from "react-bootstrap";
import { FaTicketAlt, FaClipboard, FaClock, FaCalendarAlt, FaGift, FaTags, FaFilter } from "react-icons/fa";
import "../../styles/profile/Vouchers.css";

const Vouchers = () => {
  const [copiedVoucher, setCopiedVoucher] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "active", "expired"

  // Sao chép mã vào clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2500);
  };

  // get list vouchers
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/vouchers");
        const data = await response.json();
        setVouchers(data);
        console.log("Danh sách voucher:", data);
      } catch (error) {
        console.error("Lỗi lấy danh sách voucher:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // format date to Vietnamese format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric" 
    }).format(date);
  };

  // Calculate days left until expiration
  const calculateDaysLeft = (endDate) => {
    const today = new Date();
    const expDate = new Date(endDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Filter vouchers based on selected filter
  const filteredVouchers = vouchers.filter(voucher => {
    if (filter === "all") return true;
    if (filter === "active") return voucher.state === "Còn hiệu lực";
    if (filter === "expired") return voucher.state !== "Còn hiệu lực";
    return true;
  });

  // Display a progress bar for voucher expiration
  const ExpirationProgress = ({ endDate }) => {
    const daysLeft = calculateDaysLeft(endDate);
    const totalDays = 30; // Assuming vouchers are typically valid for 30 days
    const percentage = Math.min(100, Math.max(0, (daysLeft / totalDays) * 100));
    
    let barColor = "bg-success";
    if (percentage <= 25) barColor = "bg-danger";
    else if (percentage <= 50) barColor = "bg-warning";
    
    return (
      <div className="expiration-progress">
        <div className="progress" style={{ height: "6px" }}>
          <div 
            className={`progress-bar ${barColor}`} 
            role="progressbar" 
            style={{ width: `${percentage}%` }} 
            aria-valuenow={percentage} 
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
        <div className="d-flex justify-content-between mt-1">
          <small className="text-muted">
            {daysLeft > 0 ? `Còn ${daysLeft} ngày` : "Hết hạn"}
          </small>
          <small className="text-muted">HSD: {formatDate(endDate)}</small>
        </div>
      </div>
    );
  };

  return (
    <Container className="vouchers-section py-4" >
      <Card className="shadow-sm border-0" style={{ marginTop: "-13%" }}>
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-2 d-flex align-items-center">
                <FaGift className="text-primary me-2" /> Kho Voucher
              </h4>
              <p className="text-muted small mb-2">Sử dụng các mã giảm giá để tiết kiệm khi mua sắm</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant={filter === "all" ? "primary" : "outline-primary"} 
                size="sm" 
                onClick={() => setFilter("all")}
              >
                <FaTags className="me-1" /> Tất cả
              </Button>
              <Button 
                variant={filter === "active" ? "success" : "outline-success"} 
                size="sm" 
                onClick={() => setFilter("active")}
              >
                Còn hiệu lực
              </Button>
              <Button 
                variant={filter === "expired" ? "secondary" : "outline-secondary"} 
                size="sm" 
                onClick={() => setFilter("expired")}
              >
                Hết hạn
              </Button>
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Đang tải vouchers...</p>
            </div>
          ) : filteredVouchers.length > 0 ? (
            <Row className="m-0 p-0">
              {filteredVouchers.map((voucher) => (
                <Col xs={12} md={6} lg={4} key={voucher.id} className="p-2">
                  <Card 
                    className={`voucher-card h-100 ${voucher.state !== "Còn hiệu lực" ? "expired-voucher" : ""}`}
                  >
                    <div className="voucher-ribbon"></div>
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <Badge 
                          bg={voucher.state === "Còn hiệu lực" ? "success" : "secondary"}
                          className="py-2 px-3"
                        >
                          {voucher.state === "Còn hiệu lực" ? 
                            <><FaTicketAlt className="me-1" /> {voucher.state}</> : 
                            <><FaClock className="me-1" /> Hết hạn</>
                          }
                        </Badge>
                        <h5 className="discount-amount text-danger">
                          {Intl.NumberFormat('vi-VN').format(voucher.discount)}đ
                        </h5>
                      </div>
                      
                      <h5 className="mb-2">{voucher.name}</h5>
                      
                      <p className="text-muted mb-3 small">
                        {voucher.description || "Voucher giảm giá cho đơn hàng"}
                      </p>
                      
                      <div className="voucher-code-container mb-3">
                        <div className="voucher-code p-2 bg-light rounded d-flex align-items-center justify-content-between">
                          <div className="code-display fw-bold text-primary">
                            {voucher.code || "CODEVOUCHER"}
                          </div>
                          <Button 
                            variant={voucher.state === "Còn hiệu lực" ? "outline-primary" : "outline-secondary"} 
                            size="sm" 
                            className="copy-btn"
                            onClick={() => copyToClipboard(voucher.code)}
                            disabled={voucher.state !== "Còn hiệu lực"}
                          >
                            <FaClipboard className="me-1" /> Sao chép
                          </Button>
                        </div>
                      </div>
                      
                      <ExpirationProgress endDate={voucher.end_date} />
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <FaTicketAlt className="text-muted mb-3" size={40} />
              <h5>Không có voucher nào</h5>
              <p className="text-muted">Hiện tại bạn không có voucher nào trong kho</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Hiển thị thông báo sao chép */}
      <Toast 
        className="position-fixed bottom-0 end-0 m-3 toast-custom" 
        show={copiedVoucher !== null} 
        onClose={() => setCopiedVoucher(null)}
        delay={2000} 
        autohide
      >
        <Toast.Header closeButton={false} className="bg-success text-white">
          <strong className="me-auto">Sao chép thành công</strong>
        </Toast.Header>
        <Toast.Body>
          <div className="d-flex align-items-center">
            <FaClipboard className="me-2 text-success" />
            <div>
              <span>Mã <strong>{copiedVoucher}</strong> đã được sao chép!</span>
              <p className="small mb-0 mt-1">Bạn có thể sử dụng trong phần thanh toán</p>
            </div>
          </div>
        </Toast.Body>
      </Toast>
    </Container>
  );
};

export default Vouchers;