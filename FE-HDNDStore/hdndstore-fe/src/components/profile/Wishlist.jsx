import { useState } from "react";
import { Card, Button, Container, Row, Col, Image } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import "../../styles/profile/Wishlist.css";

const Wishlist = () => {
  // Danh sách sản phẩm yêu thích (Dữ liệu mẫu)
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Giày Sandal Cao Gót MWC - 3618",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=//Upload/2022/11/z3887704998065-46a941e0bf1833ff5a664f8b26e7ca68.jpg",
      price: "195.000 đ",
      colors: ["#E8D7C0", "#D3D3D3", "#000000"],
      liked: true,
    },
    {
      id: 2,
      name: "Giày Cao Gót MWC 3540 - Kiểu Dáng Đẹp",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/08/25/z5764935017055_04baabc788c15f2be8a997aee91746e6.jpg",
      price: "195.000 đ",
      colors: ["#000000", "#D3D3D3"],
      liked: true,
    },
    {
      id: 3,
      name: "Giày Sandal Cao Gót MWC 3547 - Quai Chéo",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=//Upload/2022/11/z3887704998065-46a941e0bf1833ff5a664f8b26e7ca68.jpg",
      price: "150.000 đ",
      colors: ["#000000", "#D3D3D3", "#E8D7C0"],
      liked: true,
    },
    {
        id: 4,
        name: "Giày Cao Gót MWC 3540 - Kiểu Dáng Đẹp",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/08/25/z5764935017055_04baabc788c15f2be8a997aee91746e6.jpg",
        price: "195.000 đ",
        colors: ["#000000", "#D3D3D3"],
        liked: true,
      },
      {
        id: 5,
        name: "Giày Sandal Cao Gót MWC 3547 - Quai Chéo",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=//Upload/2022/11/z3887704998065-46a941e0bf1833ff5a664f8b26e7ca68.jpg",
        price: "150.000 đ",
        colors: ["#000000", "#D3D3D3", "#E8D7C0"],
        liked: true,
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

  return (
    <Container className="wishlist-container card p-4">
      <Row>
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <Col md={4} key={item.id} className="mb-3">
              <Card className="wishlist-card">
                <div className="wishlist-image">
                  <Image src={item.image} fluid />
                  <FaHeart
                    className={`wishlist-heart ${item.liked ? "active" : ""}`}
                    onClick={() => toggleLike(item.id)}
                  />
                </div>
                <Card.Body className="text-center">
                  <div className="color-options">
                    {item.colors.map((color, index) => (
                      <span
                        key={index}
                        className="color-dot"
                        style={{ backgroundColor: color }}
                      ></span>
                    ))}
                  </div>
                  <Card.Title className="wishlist-title">{item.name}</Card.Title>
                  <Card.Text className="wishlist-price">{item.price}</Card.Text>
                  <Button variant="dark" size="sm">Thêm vào giỏ</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center">
            <p>Danh sách yêu thích của bạn đang trống!</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Wishlist;
