import { useState } from "react";
import { Card, Button, Container, Row, Col, Badge, Spinner } from "react-bootstrap";
import { FaHeart, FaShoppingCart, FaRegSadTear, FaSearch, FaTrashAlt, FaEye } from "react-icons/fa";
import "../../styles/profile/Wishlist.css";

const Wishlist = () => {
  const [loading, setLoading] = useState(false);
  
  // Danh sách sản phẩm yêu thích (Dữ liệu mẫu)
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Giày Sandal Cao Gót MWC - 3618",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=//Upload/2022/11/z3887704998065-46a941e0bf1833ff5a664f8b26e7ca68.jpg",
      price: 195000,
      colors: ["#E8D7C0", "#D3D3D3", "#000000"],
      liked: true,
      category: "Giày cao gót",
      inStock: true,
    },
    {
      id: 2,
      name: "Giày Cao Gót MWC 3540 - Kiểu Dáng Đẹp",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/08/25/z5764935017055_04baabc788c15f2be8a997aee91746e6.jpg",
      price: 195000,
      colors: ["#000000", "#D3D3D3"],
      liked: true,
      category: "Giày cao gót",
      inStock: true,
    },
    {
      id: 3,
      name: "Giày Sandal Cao Gót MWC 3547 - Quai Chéo",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=//Upload/2022/11/z3887704998065-46a941e0bf1833ff5a664f8b26e7ca68.jpg",
      price: 150000,
      colors: ["#000000", "#D3D3D3", "#E8D7C0"],
      liked: true,
      category: "Giày sandal",
      inStock: false,
    },
    {
      id: 4,
      name: "Giày Cao Gót MWC 3540 - Kiểu Dáng Đẹp",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/08/25/z5764935017055_04baabc788c15f2be8a997aee91746e6.jpg",
      price: 195000,
      colors: ["#000000", "#D3D3D3"],
      liked: true,
      category: "Giày cao gót",
      inStock: true,
    },
    {
      id: 5,
      name: "Giày Sandal Cao Gót MWC 3547 - Quai Chéo",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=//Upload/2022/11/z3887704998065-46a941e0bf1833ff5a664f8b26e7ca68.jpg",
      price: 150000,
      colors: ["#000000", "#D3D3D3", "#E8D7C0"],
      liked: true,
      category: "Giày sandal",
      inStock: true,
    },
  ]);

  // Xử lý click bỏ yêu thích
  const toggleLike = (id) => {
    setWishlist((prevWishlist) =>
      prevWishlist.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    );
  };

  // Xóa sản phẩm khỏi wishlist
  const removeFromWishlist = (id) => {
    setWishlist((prevWishlist) => 
      prevWishlist.filter(item => item.id !== id)
    );
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price).replace('₫', 'đ');
  };

  return (
    <Container className="wishlist-section py-4">
      <Card className="shadow-sm border-0" style={{ marginTop: "-14%" }}>
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 d-flex align-items-center">
                <FaHeart className="text-danger me-2" /> Sản phẩm yêu thích
              </h4>
              <p className="text-muted small mb-0">Danh sách các sản phẩm bạn đã lưu để mua sau</p>
            </div>
            <span className="badge bg-primary rounded-pill">
              {wishlist.length} sản phẩm
            </span>
          </div>
        </Card.Header>

        <Card.Body className="p-3">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Đang tải sản phẩm yêu thích...</p>
            </div>
          ) : wishlist.length > 0 ? (
            <Row className="g-3">
              {wishlist.map((item) => (
                <Col lg={4} md={6} key={item.id}>
                  <Card className="product-card h-100 border-0 shadow-sm">
                    <div className="product-card-header position-relative">
                      <span 
                        className="favorite-btn position-absolute"
                        onClick={() => toggleLike(item.id)}
                      >
                        <FaHeart className="text-danger" />
                      </span>
                      
                      <span 
                        className="remove-btn position-absolute"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <FaTrashAlt />
                      </span>
                      
                      <div className="product-img-container">
                        <Card.Img 
                          variant="top" 
                          src={item.image} 
                          className="product-img" 
                        />
                        <div className="product-img-overlay">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="quick-view-btn"
                            style={{marginLeft: '40px'}}
                          >
                            <FaEye /> Xem nhanh
                          </Button>
                        </div>
                      </div>
                      
                      <Badge 
                        bg={item.inStock ? "success" : "danger"} 
                        className="stock-status position-absolute"
                      >
                        {item.inStock ? "Còn hàng" : "Hết hàng"}
                      </Badge>
                    </div>
                    
                    <Card.Body className="pt-3">
                      <div className="category-label mb-1">
                        <small className="text-muted">{item.category}</small>
                      </div>
                      <Card.Title className="product-title mb-2">
                        {item.name.length > 40 
                          ? `${item.name.substring(0, 40)}...` 
                          : item.name}
                      </Card.Title>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="color-options">
                          {item.colors.map((color, index) => (
                            <span
                              key={index}
                              className="color-dot"
                              style={{ backgroundColor: color }}
                              title={`Màu ${index + 1}`}
                            ></span>
                          ))}
                          {item.colors.length > 0 && (
                            <small className="text-muted ms-2">
                              {item.colors.length} màu
                            </small>
                          )}
                        </div>
                        <Card.Text className="product-price mb-0">
                          {formatPrice(item.price)}
                        </Card.Text>
                      </div>
                      <div className="d-grid">
                        <Button 
                          variant="primary" 
                          className="add-to-cart-btn"
                          disabled={!item.inStock}
                        >
                          <FaShoppingCart className="me-2" />
                          {item.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5 empty-wishlist">
              <FaRegSadTear size={50} className="text-muted mb-3" />
              <h5>Danh sách yêu thích trống</h5>
              <p className="text-muted mb-4">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích</p>
              <Button variant="outline-primary">
                <FaSearch className="me-2" /> Khám phá sản phẩm
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Wishlist;