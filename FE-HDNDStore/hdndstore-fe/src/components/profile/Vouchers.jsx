import { useState } from "react";
import { ListGroup, Container, Button, Badge, Toast } from "react-bootstrap";
import { FaTicketAlt, FaClipboard } from "react-icons/fa";
import "../../styles/profile/Vouchers.css";

const vouchers = [
  { id: 1, code: "SALE10", discount: "Giảm 10%", expiry: "31/03/2025", used: false },
  { id: 2, code: "FREESHIP", discount: "Miễn phí vận chuyển", expiry: "15/04/2025", used: false },
  { id: 3, code: "VIP20", discount: "Giảm 20% cho khách VIP", expiry: "30/06/2025", used: true },
];

const Vouchers = () => {
  const [copiedVoucher, setCopiedVoucher] = useState(null);

  // Sao chép mã vào clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2000);
  };

  return (
    <Container className="vouchers-container card p-4">
      <h4 className="mb-3">Kho Voucher</h4>
      <p>Danh sách các mã giảm giá của bạn</p>
      <hr />

      <ListGroup>
        {vouchers.length > 0 ? (
          vouchers.map((voucher) => (
            <ListGroup.Item key={voucher.id} className={`voucher-item ${voucher.used ? "used" : ""}`}>
              <FaTicketAlt className="voucher-icon" />
              <div className="voucher-content">
                <p className="mb-1">
                  <strong>{voucher.discount}</strong>
                </p>
                <small className="text-muted">Hết hạn: {voucher.expiry}</small>
              </div>
              <Badge bg={voucher.used ? "secondary" : "success"}>
                {voucher.used ? "Đã sử dụng" : "Còn hiệu lực"}
              </Badge>
              {!voucher.used && (
                <Button variant="outline-primary" className="copy-btn" onClick={() => copyToClipboard(voucher.code)}>
                  <FaClipboard /> Sao chép
                </Button>
              )}
            </ListGroup.Item>
          ))
        ) : (
          <p className="text-center text-muted">Không có voucher nào</p>
        )}
      </ListGroup>

      {/* Hiển thị thông báo sao chép */}
      {copiedVoucher && (
        <Toast className="position-fixed bottom-0 end-0 m-3" show={true} delay={2000} autohide>
          <Toast.Body>
            🎉 Mã <strong>{copiedVoucher}</strong> đã được sao chép vào clipboard!
          </Toast.Body>
        </Toast>
      )}
    </Container>
  );
};

export default Vouchers;
