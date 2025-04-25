import { FaCheckCircle, FaShoppingCart, FaShoppingBag, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Hotline from "../layout/Hotline";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const OrderSuccess = () => {
    const navigate = useNavigate(); 

    return (
        <Card className="text-center shadow border-0 py-5 my-5">
            <Card.Body className="py-5">
                <div className="success-icon-wrapper mb-4">
                    <FaCheckCircle className="text-success" style={{ fontSize: '5rem' }} />
                </div>
                
                <h2 className="fw-bold mb-3">ĐẶT HÀNG THÀNH CÔNG!</h2>
                
                <Card.Text className="text-muted mb-5">
                    Cảm ơn bạn đã mua sắm tại HDND. <br />
                    Đơn hàng của bạn đang được xử lý và sẽ được giao trong thời gian sớm nhất.
                </Card.Text>
                
                <div className="order-reference mb-5">
                    <Card className="mx-auto" style={{ maxWidth: '400px' }}>
                        <Card.Header className="bg-light text-dark">
                            <strong>Thông tin đơn hàng</strong>
                        </Card.Header>
                        <Card.Body className="text-start">
                            <Row className="mb-2">
                                <Col xs={6} className="text-secondary">Mã đơn hàng:</Col>
                                <Col xs={6} className="fw-bold">#DH{Math.floor(Math.random() * 10000)}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col xs={6} className="text-secondary">Ngày đặt:</Col>
                                <Col xs={6}>{new Date().toLocaleDateString('vi-VN')}</Col>
                            </Row>
                            <Row>
                                <Col xs={6} className="text-secondary">Phương thức:</Col>
                                <Col xs={6}>Thanh toán khi nhận hàng</Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </div>
                
                <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                    <Button 
                        variant="primary" 
                        size="lg" 
                        className="px-4 py-3"
                        onClick={() => navigate("/home")}
                    >
                        <FaShoppingCart className="me-2" />
                        Tiếp tục mua hàng
                    </Button>
                    
                    <Button 
                        variant="outline-primary" 
                        size="lg" 
                        className="px-4 py-3"
                        onClick={() => navigate("/profile/orders")}
                    >
                        <FaShoppingBag className="me-2" />
                        Xem đơn hàng đã đặt
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

const Order = () => {    
    return (
        <>
            <Header />
            <Container className="py-4">
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="/home" className="text-decoration-none">
                                <FaHome className="me-1" style={{fontSize: '0.9rem'}} />
                                Trang chủ
                            </a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Đặt hàng thành công
                        </li>
                    </ol>
                </nav>
                <OrderSuccess />
                <div className="text-center mt-2">
                    <h5>Gặp vấn đề với đơn hàng?</h5>
                    <p className="mb-3">Liên hệ với chúng tôi qua hotline: <strong>039.799.6969</strong></p>
                </div>
            </Container>
            <Hotline />
            <Footer />
        </>
    );
};

export default Order;