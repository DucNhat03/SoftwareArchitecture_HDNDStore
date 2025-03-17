import { useEffect, useState } from "react";
import { ListGroup, Container, Button, Badge, Toast } from "react-bootstrap";
import { FaTicketAlt, FaClipboard } from "react-icons/fa";
import "../../styles/profile/Vouchers.css";

// const vouchers = [
//   { id: 1, code: "SALE10", discount: "Giảm 10%", expiry: "31/03/2025", used: false },
//   { id: 2, code: "FREESHIP", discount: "Miễn phí vận chuyển", expiry: "15/04/2025", used: false },
//   { id: 3, code: "VIP20", discount: "Giảm 20% cho khách VIP", expiry: "30/06/2025", used: true },
//   { id: 4, code: "SALE10", discount: "Giảm 10%", expiry: "31/03/2025", used: true },
//   { id: 5, code: "FREESHIP", discount: "Miễn phí vận chuyển", expiry: "15/04/2025", used: false },
//   { id: 6, code: "VIP20", discount: "Giảm 20% cho khách VIP", expiry: "30/06/2025", used: false },
// ];


{/*
   {
        "_id": "67d6f5878e1db52e49abb363",
        "name": "SUMMER25",
        "discount": 25000,
        "start_date": "2025-06-01T00:00:00.000Z",
        "end_date": "2025-06-30T23:59:59.000Z",
        "code": "SUMMER25",
        "state": "Chưa hiệu lực",
        "quantity": 100
    }
    
*/}

const Vouchers = () => {
  const [copiedVoucher, setCopiedVoucher] = useState(null);


  const [vouchers, setVouchers] = useState([]);

  // Sao chép mã vào clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2500);
  };


  // get list vouchers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vouchers");
        const data = await response.json();
        setVouchers(data);
        console.log("Danh sách voucher:", data);
      } catch (error) {
        console.error("Lỗi lấy danh sách voucher:", error);
      }
    };
    fetchData();
  }, []);

  // format date
  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };


  return (
    <Container className="vouchers-container card p-4">
      <h4 className="mb-3">Kho Voucher</h4>
      <p>Danh sách các mã giảm giá của bạn</p>
      <hr />

      <ListGroup>
        {vouchers.length > 0 ? (
          vouchers.map((voucher) => (
            
            <ListGroup.Item key={voucher.id} className={`voucher-item ${voucher.state !== "Còn hiệu lực" ? "used" : ""}`}>
              <FaTicketAlt className="voucher-icon" />
              <div className="voucher-content">
                <p className="mb-1">
                  <strong>{voucher.name}</strong>
                </p>
                <small className="text-muted">Hết hạn: {formatDate(voucher.end_date)}</small>
              </div>
              <Badge bg={voucher.state === "Còn hiệu lực" ? "success" : "secondary"}>
                {voucher.state}
              </Badge>
              {voucher.state && (
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
