import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Table,
  Form,
  Modal,
  Tab,
  Tabs,
  Carousel,
  Toast,
  ToastContainer,
  Alert,
  ListGroup,
} from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaShoppingCart,
  FaStar,
  FaStarHalf,
  FaCheck,
  FaTimes,
  FaTruck,
  FaExchangeAlt,
  FaHeadset,
  FaShippingFast,
  FaPercent,
  FaMedal,
} from "react-icons/fa";
import Slider from "react-slick";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Hotline from "../layout/Hotline";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import toastService from "../../utils/toastService";

const ChiTietSanPham = ({ product }) => {
  const [mainImage, setMainImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isShowroomOpen, setIsShowroomOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [showCartToast, setShowCartToast] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]); // Giỏ hàng
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy sản phẩm đã chọn từ localStorage
    const storedProduct = localStorage.getItem("selectedProduct");
    if (storedProduct) {
      const parsedProduct = JSON.parse(storedProduct);
      setSelectedProduct(parsedProduct);
      setMainImage(parsedProduct.image || "/src/images/giaynam/MWC 5705_3.jpg");
    }

    // Lấy userId từ localStorage hoặc context
    const userId = localStorage.getItem("userId");
    if (userId) {
      const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};
      setCart(storedCarts[userId] || []);
    }
  }, []);

  if (!selectedProduct) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          <h4>Không tìm thấy sản phẩm!</h4>
          <p>Vui lòng quay lại trang chủ để tiếp tục mua sắm.</p>
          <Button variant="primary" onClick={() => navigate("/home")}>
            Về trang chủ
          </Button>
        </Alert>
      </Container>
    );
  }

  // Danh sách ánh xạ từ tên màu sang mã màu HEX
  const colorMap = {
    bạc: "#C0C0C0",
    nâu: "#8B4513",
    trắng: "#e8e8e8",
    đen: "#000000",
    đỏ: "#FF0000",
    xanh: "#0000FF",
    kem: "#F5F5DC",
    vàng: "#FFFF00",
    hồng: "#FFC0CB",
    xám: "#808080",
  };

  const reviews = [
    {
      id: 1,
      name: "Nguyễn Đức Nhật",
      avatar: "https://i.imgur.com/3HufAVu.png",
      rating: 5,
      date: "26/04/2025",
      content: "Giày đẹp, chất lượng tốt, đóng gói kỹ càng. Sẽ ủng hộ thêm!",
    },
    {
      id: 2,
      name: "Dương Đeo Míc",
      avatar: "https://i.imgur.com/S7pFEEL.png",
      rating: 5,
      date: "25/04/2025",
      content: "Sản phẩm giống mô tả, mang rất êm chân, giao hàng siêu nhanh.",
    },
    {
      id: 3,
      name: "Duy Ngày Xưa",
      avatar: "https://i.imgur.com/NwrYHHv.png",
      rating: 5,
      date: "24/04/2025",
      content: "Mẫu mã đẹp, giá hợp lý. Sẽ giới thiệu bạn bè.",
    },
    {
      id: 4,
      name: "Trần Quốc Huy",
      avatar: "https://i.imgur.com/B4hImXg.png",
      rating: 5,
      date: "24/04/2025",
      content: "Hàng chất lượng, giao hàng nhanh. Rất hài lòng với sản phẩm.",
    },
  ];

  const handleWriteReview = () => {
    toastService.info("Chức năng chưa hoàn thiện !");
  };

  const handleViewCart = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Vui lòng đăng nhập để xem giỏ hàng!");
      navigate("/auth");
      return;
    }

    // Lưu giỏ hàng vào localStorage trước khi chuyển trang
    const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};
    localStorage.setItem("carts", JSON.stringify(storedCarts));
    navigate("/cart");
  };

  const addToCart = (product) => {
    if (!selectedColor || !selectedSize) {
      toastService.warning("Vui lòng chọn màu sắc và kích cỡ!");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toastService.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    if (!product || !product._id) {
      console.error("Lỗi: product hoặc product._id không hợp lệ");
      return;
    }

    // Lấy giỏ hàng từ localStorage
    const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};
    const userCart = storedCarts[userId] || [];

    // Tìm vị trí sản phẩm trong giỏ hàng
    const existingItemIndex = userCart.findIndex(
      (cartItem) =>
        cartItem.id === product._id &&
        cartItem.color === selectedColor &&
        cartItem.size === selectedSize
    );

    let updatedCart;
    if (existingItemIndex !== -1) {
      // Nếu sản phẩm đã có, tăng số lượng
      updatedCart = [...userCart];
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      // Nếu chưa có, thêm sản phẩm mới với số lượng = quantity
      updatedCart = [
        ...userCart,
        {
          ...product,
          id: product._id,
          color: selectedColor,
          size: selectedSize,
          quantity,
        },
      ];
    }

    // Cập nhật giỏ hàng vào localStorage
    storedCarts[userId] = updatedCart;
    localStorage.setItem("carts", JSON.stringify(storedCarts));

    // Cập nhật state giỏ hàng
    setCart(updatedCart);

    // Hiển thị toast thông báo thành công
    setShowCartToast(true);
  };

  const addToCart2 = () => {
    if (!selectedColor || !selectedSize) {
      toastService.warning("Vui lòng chọn màu sắc và kích cỡ!");
      return;
    }

    // Lấy userId từ localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toastService.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};
    const currentCart = storedCarts[userId] || [];

    const existingItemIndex = currentCart.findIndex(
      (cartItem) =>
        cartItem.id === selectedProduct.id &&
        cartItem.color === selectedColor &&
        cartItem.size === selectedSize
    );

    if (existingItemIndex !== -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push({
        ...selectedProduct,
        color: selectedColor,
        size: selectedSize,
        quantity,
      });
    }

    storedCarts[userId] = currentCart;
    localStorage.setItem("carts", JSON.stringify(storedCarts));
    setCart(currentCart);

    navigate("/cart");
  };

  const districtData = {
    hanoi: ["Ba Đình", "Hoàn Kiếm", "Cầu Giấy", "Đống Đa"],
    hcm: ["Quận 1", "Quận 3", "Quận 7", "Thủ Đức"],
    danang: ["Hải Châu", "Thanh Khê", "Liên Chiểu", "Ngũ Hành Sơn"],
  };

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setDistricts(districtData[province] || []);
  };

  const storeLocations = [
    {
      address: "123 Lê Lợi, Quận 1, TP.Hồ Chí Minh",
      status: "Còn hàng",
      statusClass: "text-success",
    },
    {
      address: "456 Lê Duẩn, Quận Hai Bà Trưng, Hà Nội",
      status: "Còn hàng",
      statusClass: "text-success",
    },
    {
      address: "789 Nguyễn Văn Linh, Quận Liên Chiểu, Đà Nẵng",
      status: "Sắp hết hàng",
      statusClass: "text-warning",
    },
  ];

  // Lợi ích khi mua hàng
  const benefits = [
    {
      icon: <FaMedal className="text-primary" size={24} />,
      text: "Bảo hành keo trọn đời",
    },
    {
      icon: <FaShippingFast className="text-success" size={24} />,
      text: "Miễn phí vận chuyển từ 150K",
    },
    {
      icon: <FaExchangeAlt className="text-danger" size={24} />,
      text: "Đổi trả trong vòng 7 ngày",
    },
    {
      icon: <FaHeadset className="text-info" size={24} />,
      text: "Hotline 1900.633.349",
    },
    {
      icon: <FaTruck className="text-secondary" size={24} />,
      text: "Tận tình giao hàng",
    },
    {
      icon: <FaPercent className="text-warning" size={24} />,
      text: "Ưu đãi cho thành viên",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const relatedProducts = [
    {
      id: 1,
      image: "/src/images/giaynam/MWC 5705_1.jpg",
      name: "Giày Thể Thao Nam MWC 5705",
      price: 295000,
    },
    {
      id: 2,
      image: "/src/images/giaynam/MWC 5705_2.jpg",
      name: "Giày Thể Thao Nam MWC 5705",
      price: 295000,
    },
    {
      id: 3,
      image: "/src/images/giaynam/MWC 5705_3.jpg",
      name: "Giày Thể Thao Nam MWC 5705",
      price: 295000,
    },
    {
      id: 4,
      image: "/src/images/giaynam/MWC 5705_4.jpg",
      name: "Giày Thể Thao Nam MWC 5705",
      price: 295000,
    },
  ];

  // Kiểm tra variant có stock hay không dựa trên color và size
  const isVariantAvailable = (color, size) => {
    if (!selectedProduct.variants) return false;

    const matchedVariant = selectedProduct.variants.find(
      (v) => v.color === color && v.size === size
    );

    return matchedVariant && Number(matchedVariant.stock) > 0;
  };

  // Lấy danh sách size dựa trên màu đã chọn
  const getSizesByColor = (color) => {
    if (!selectedProduct.variants || !color) return [];

    return [
      ...new Set(
        selectedProduct.variants
          .filter((variant) => variant.color === color)
          .map((variant) => variant.size)
      ),
    ];
  };

  return (
    <>
      <Header />

      {/* Toast Notification */}
      <ToastContainer
        position="top-end"
        className="p-3 mt-5"
        
        style={{ zIndex: 1056 }}
      >
        <Toast
          show={showCartToast}
          onClose={() => setShowCartToast(false)}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <FaShoppingCart className="me-2" />
            <strong className="me-auto">Giỏ hàng</strong>
            <small>Vừa xong</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            Đã thêm sản phẩm vào giỏ hàng thành công!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Container className="py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/home" className="text-decoration-none">
                Trang chủ
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/category" className="text-decoration-none">
                {selectedProduct.category}
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {selectedProduct.name}
            </li>
          </ol>
        </nav>

        <Row className="mb-5">
          {/* Product Images */}
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="product-main-image mb-3">
                  <img
                    src={mainImage}
                    alt={selectedProduct.name}
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "500px",
                      width: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                {/* Thumbnail Slider */}
                <div className="product-thumbnails px-2">
                  <Slider {...sliderSettings}>
                    {selectedProduct.imagethum?.map((img, index) => (
                      <div key={index} className="px-1">
                        <img
                          src={img}
                          alt={`${selectedProduct.name} - Ảnh ${index + 1}`}
                          className={`img-thumbnail cursor-pointer ${
                            mainImage === img ? "border-primary" : ""
                          }`}
                          onClick={() => setMainImage(img)}
                          style={{
                            height: "80px",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Product Details */}
          <Col lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-2 h5 mb-2">
                <h2 className="mb-2">{selectedProduct.name}</h2>

                {/* Ratings */}
                <div className="d-flex align-items-center mb-3">
                  <div className="text-warning me-2">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalf />
                  </div>
                  <span className="text-muted small">
                    12 đánh giá - 987 lượt thích
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <h3 className="text-danger fw-bold">
                    {selectedProduct.price.toLocaleString("vi-VN")}₫
                  </h3>
                  <p className="text-muted small mb-0">(Đã bao gồm VAT)</p>
                </div>

                <hr />

                {/* Colors */}
                <div className="mb-4">
                  <label className="form-label fw-bold mb-2">Màu sắc:</label>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      ...new Set(
                        selectedProduct.variants?.map(
                          (variant) => variant.color
                        )
                      ),
                    ].map((color, index) => {
                      const backgroundColor =
                        colorMap[color.toLowerCase()] || color;
                      return (
                        <div
                          key={index}
                          className={`color-option ${
                            selectedColor === color ? "selected" : ""
                          }`}
                          onClick={() => setSelectedColor(color)}
                          title={`Màu ${color}`}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            backgroundColor,
                            cursor: "pointer",
                            border:
                              selectedColor === color
                                ? "2px solid #000"
                                : "1px solid #ddd",
                            boxShadow:
                              selectedColor === color
                                ? "0 0 0 2px #fff, 0 0 0 4px #007bff"
                                : "none",
                            position: "relative",
                          }}
                        >
                          {selectedColor === color && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: "-8px",
                                right: "-8px",
                                backgroundColor: "#28a745",
                                color: "white",
                                borderRadius: "50%",
                                width: "15px",
                                height: "15px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px",
                              }}
                            >
                              <FaCheck />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {selectedColor && (
                    <p className="mt-2 mb-0 text-muted small">
                      Đã chọn: <span className="fw-bold">{selectedColor}</span>
                    </p>
                  )}
                </div>

                {/* Sizes */}
                <div className="mb-4">
                  <label className="form-label fw-bold mb-2">Kích thước:</label>
                  <div className="d-flex flex-wrap gap-2">
                    {getSizesByColor(selectedColor).map((size, index) => {
                      const isAvailable = isVariantAvailable(
                        selectedColor,
                        size
                      );
                      return (
                        <Button
                          key={index}
                          variant={
                            selectedSize === size
                              ? "primary"
                              : "outline-secondary"
                          }
                          className={`${!isAvailable ? "opacity-50" : ""}`}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          size="sm"
                          style={{ minWidth: "45px" }}
                        >
                          {size}
                          {!isAvailable && (
                            <FaTimes className="ms-1" size={10} />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                  {!selectedColor && (
                    <p className="text-muted small mt-2">
                      Vui lòng chọn màu sắc trước
                    </p>
                  )}
                  {selectedSize && (
                    <p className="mt-2 mb-0 text-muted small">
                      Đã chọn:{" "}
                      <span className="fw-bold">Size {selectedSize}</span>
                    </p>
                  )}
                </div>

                {/* Size Guide Button */}
                <div className="mb-4">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="text-uppercase"
                  >
                    Hướng dẫn chọn size
                  </Button>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="form-label fw-bold mb-2">Số lượng:</label>
                  <div
                    className="d-flex align-items-center"
                    style={{ maxWidth: "150px" }}
                  >
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      -
                    </Button>
                    <Form.Control
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                      className="text-center mx-2"
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Store Availability */}
                <div className="mb-4">
                  <Button
                    variant="outline-info"
                    className="d-flex align-items-center gap-2"
                    onClick={() => setIsShowroomOpen(true)}
                  >
                    <FaMapMarkerAlt /> Tìm sản phẩm tại showroom
                  </Button>
                </div>

                {/* Add to cart buttons */}
                <div className="d-grid gap-3 d-md-flex mb-4">
                  <Button
                    variant="primary"
                    className="flex-grow-1"
                    size="lg"
                    onClick={() => addToCart2()}
                  >
                    <strong>MUA NGAY</strong>
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                    size="lg"
                    onClick={() => addToCart(selectedProduct)}
                  >
                    <FaShoppingCart /> <strong>THÊM VÀO GIỎ</strong>
                  </Button>
                </div>

                {/* Benefits */}
                <h5 className="fw-bold mb-3">Quyền lợi khách hàng</h5>
                <Row className="g-3 mb-4">
                  {benefits.map((benefit, index) => (
                    <Col xs={12} md={6} key={index}>
                      <div className="d-flex align-items-center">
                        <div className="me-2">{benefit.icon}</div>
                        <div className="small">{benefit.text}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Product Information Tabs */}
        <Card className="border-0 shadow-sm mb-5">
          <Card.Body className="p-4">
            <Tabs defaultActiveKey="details" className="mb-3">
              <Tab eventKey="details" title="Chi tiết sản phẩm" className="p-3">
                <h4 className="mb-3">MÔ TẢ SẢN PHẨM: {selectedProduct.name}</h4>
                <p className="mb-4">
                  {" "}
                  Dép nam với thiết kế quai ngang chữ H hiện đại, mang đến phong
                  cách cá tính và đầy thời thượng. Được làm từ chất liệu da tổng
                  hợp cao cấp, sản phẩm không chỉ bền bỉ mà còn dễ dàng chăm
                  sóc, giữ cho đôi dép luôn mới mẻ.{" "}
                </p>{" "}
                <p className="mb-4">
                  {" "}
                  Với trọng lượng nhẹ, đôi dép mang đến sự thoải mái tối đa cho
                  đôi chân suốt cả ngày dài. Hơn nữa, màu sắc đa dạng và trẻ
                  trung của dép dễ dàng kết hợp với nhiều trang phục, từ những
                  bộ đồ công sở chỉn chu đến những set đồ thể thao năng động hay
                  thời trang đường phố.{" "}
                </p>{" "}
                <p className="mb-4">
                  {" "}
                  Dép nam quai ngang chữ H là lựa chọn hoàn hảo cho những ai yêu
                  thích phong cách năng động và trẻ trung. Bạn có thể thoải mái
                  diện đôi dép này khi đi chơi, dạo phố, thư giãn trong nhà hay
                  thậm chí mang đến văn phòng – đều rất phù hợp và sành điệu.{" "}
                </p>
                <h5 className="mb-3">CHI TIẾT SẢN PHẨM</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="fa fa-check me-2 text-success"></i> Chiều cao:
                    Khoảng 2cm
                  </li>
                  <li className="mb-2">
                    <i className="fa fa-check me-2 text-success"></i> Kiểu dáng:
                    Dép nam đế bằng, dép da nam cao cấp
                  </li>
                  <li className="mb-2">
                    <i className="fa fa-check me-2 text-success"></i> Chất liệu:
                    Da tổng hợp cao cấp
                  </li>
                  <li className="mb-2">
                    <i className="fa fa-check me-2 text-success"></i> Đế: PU xẻ
                    rãnh chống trơn trượt
                  </li>
                  <li className="mb-2">
                    <i className="fa fa-check me-2 text-success"></i> Màu sắc:
                    Xám - Đen - Nâu - Full đen
                  </li>
                  <li className="mb-2">
                    <i className="fa fa-check me-2 text-success"></i> Size: 39 -
                    40- 41 - 42 - 43
                  </li>
                  <li className="mb-2">
                    <i className="fa fa-check me-2 text-success"></i> Xuất xứ:
                    Việt Nam
                  </li>
                </ul>
                <div className="bg-light p-3 rounded">
                  <p className="mb-1">
                    <strong>Chú ý:</strong> Kích thước so sánh một cách cẩn
                    thận, vui lòng cho phép sai số 1-3 cm do đo lường thủ công.
                  </p>
                  <p className="mb-1">
                    Do màn hình hiển thị khác nhau và ánh sáng khác nhau, hình
                    ảnh có thể chênh lệch 5-10% màu sắc thật của sản phẩm.
                  </p>
                </div>
              </Tab>
              <Tab
                eventKey="specifications"
                title="Thông số kỹ thuật"
                className="p-3"
              >
                <Table striped bordered hover responsive>
                  <tbody>
                    <tr>
                      <td className="fw-bold" width="30%">
                        Thương hiệu
                      </td>
                      <td>HDND Store</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Chất liệu</td>
                      <td>Da tổng hợp cao cấp</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Kích thước</td>
                      <td>39, 40, 41, 42, 43</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Màu sắc</td>
                      <td>Xám, Đen, Nâu, Full đen</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Xuất xứ</td>
                      <td>Việt Nam</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Bảo hành</td>
                      <td>12 tháng</td>
                    </tr>
                  </tbody>
                </Table>
              </Tab>
              <Tab eventKey="reviews" title="Đánh giá (12)" className="p-3">
                <div className="mb-4">
                  <h4 className="mb-3">Đánh giá từ khách hàng</h4>
                  <div className="d-flex align-items-center mb-3">
                    <div className="text-warning me-2">
                      <FaStar size={24} />
                      <FaStar size={24} />
                      <FaStar size={24} />
                      <FaStar size={24} />
                      <FaStar size={24} />
                    </div>
                    <div className="ms-2">
                      <span className="h4 fw-bold mb-0">5</span>
                      <span className="text-muted"> / 5</span>
                    </div>
                  </div>
                  <p className="text-muted">Dựa trên 12 đánh giá</p>

                  <Button
                    variant="outline-primary"
                    className="mb-4 "
                    onClick={handleWriteReview}
                  >
                    Viết đánh giá
                  </Button>

                  <div className="review-list">
                    {reviews.map((review) => (
                      <Card
                        key={review.id}
                        className="mb-3 border-0 shadow-sm mt-2"
                      >
                        <Card.Body>
                          <div className="d-flex align-items-center mb-2">
                            <img
                              src={review.avatar}
                              alt={review.name}
                              className="rounded-circle"
                              width="40"
                              height="40"
                            />
                            <div className="ms-2 flex-grow-1">
                              <h6 className="mb-0">{review.name}</h6>
                              <p className="text-muted small mb-0">
                                {review.date}
                              </p>
                            </div>
                            <div className="text-warning">
                              {Array(review.rating)
                                .fill()
                                .map((_, i) => (
                                  <FaStar key={i} size={14} />
                                ))}
                            </div>
                          </div>
                          <p className="mb-0">{review.content}</p>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        {/* Related Products */}
        <div className="mb-5">
          <h3 className="mb-4">Có thể bạn cũng thích</h3>
          <Row className="g-4">
            {relatedProducts.map((item) => (
              <Col key={item.id} xs={6} md={4} lg={3}>
                <Card className="h-100 product-card border-0 shadow-sm">
                  <div className="ratio ratio-1x1">
                    <Card.Img
                      variant="top"
                      src={item.image}
                      className="object-fit-cover"
                      alt={item.name}
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="h6">{item.name}</Card.Title>
                    <Card.Text className="text-danger fw-bold">
                      {item.price.toLocaleString("vi-VN")}₫
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0 pb-3 text-center">
                    <Button variant="outline-primary" size="sm">
                      Xem chi tiết
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      {/* Size Guide Modal */}
      <Modal
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Hướng dẫn chọn size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <img
              src="/src/images/giaynam/tinh-size-1.jpg"
              alt="Hướng dẫn chọn size"
              className="img-fluid mb-3"
              style={{ maxHeight: "200px" }}
            />
            <h5>01. Vẽ khung bàn chân</h5>
            <p>
              Đặt bàn chân lên tờ giấy trắng, dùng bút đánh dấu theo khung bàn
              chân trên giấy
            </p>
          </div>

          <div className="text-center mb-4">
            <img
              src="/src/images/giaynam/tinh-size-2.jpg"
              alt="Đo chiều dài bàn chân"
              className="img-fluid mb-3"
              style={{ maxHeight: "200px" }}
            />
            <h5>02. Đo chiều dài bàn chân</h5>
            <p>
              Dùng thước đo chiều dài lớn nhất từ mũi chân đến gót chân trên
              khung bàn chân đã đánh dấu
            </p>
          </div>

          <div className="text-center mb-4">
            <img
              src="/src/images/giaynam/tinh-size-3.jpg"
              alt="Đo độ rộng vòng chân"
              className="img-fluid mb-3"
              style={{ maxHeight: "200px" }}
            />
            <h5>03. Đo độ rộng vòng chân</h5>
            <p>
              Lấy thước dây quấn quanh 1 vòng bàn chân từ khớp ngón chân cái đến
              khớp ngón chân út
            </p>
          </div>

          <Table striped bordered hover responsive className="mt-4">
            <thead className="table-dark">
              <tr>
                <th>Size</th>
                <th>Độ rộng (cm)</th>
                <th>Độ dài (cm)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { size: 35, width: 20.7, length: 23.1 },
                { size: 36, width: 21.1, length: 23.8 },
                { size: 37, width: 21.6, length: 24.5 },
                { size: 38, width: 22.1, length: 25.2 },
                { size: 39, width: 22.6, length: 25.8 },
              ].map((item) => (
                <tr key={item.size}>
                  <td>{item.size}</td>
                  <td>{item.width}</td>
                  <td>{item.length}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Store Locations Modal */}
      <Modal
        show={isShowroomOpen}
        onHide={() => setIsShowroomOpen(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tìm sản phẩm tại showroom</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Col md={4}>
              <div className="text-center">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="img-fluid mb-3"
                  style={{ maxHeight: "150px" }}
                />
              </div>
            </Col>
            <Col md={8}>
              <h5>{selectedProduct.name}</h5>
              <p className="text-danger fw-bold">
                {selectedProduct.price.toLocaleString("vi-VN")}₫
              </p>

              <div className="mb-3">
                <label className="form-label fw-bold">Màu sắc:</label>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    ...new Set(
                      selectedProduct.variants?.map((variant) => variant.color)
                    ),
                  ].map((color, index) => {
                    const backgroundColor =
                      colorMap[color.toLowerCase()] || color;
                    return (
                      <div
                        key={index}
                        className={`color-option ${
                          selectedColor === color ? "selected" : ""
                        }`}
                        onClick={() => setSelectedColor(color)}
                        title={`Màu ${color}`}
                        style={{
                          width: "25px",
                          height: "25px",
                          borderRadius: "50%",
                          backgroundColor,
                          cursor: "pointer",
                          border:
                            selectedColor === color
                              ? "2px solid #000"
                              : "1px solid #ddd",
                        }}
                      ></div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Kích thước:</label>
                <div className="d-flex flex-wrap gap-2">
                  {getSizesByColor(selectedColor).map((size, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedSize === size ? "primary" : "outline-secondary"
                      }
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      style={{ minWidth: "40px" }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          <hr />

          <h5 className="mb-3">Tìm cửa hàng gần bạn</h5>

          <Row className="mb-4">
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Tỉnh/Thành phố:</Form.Label>
                <Form.Select onChange={handleProvinceChange}>
                  <option value="">Chọn tỉnh/thành phố</option>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hcm">Hồ Chí Minh</option>
                  <option value="danang">Đà Nẵng</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Quận/Huyện:</Form.Label>
                <Form.Select disabled={!selectedProvince}>
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((district, index) => (
                    <option key={index} value={district.toLowerCase()}>
                      {district}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="bg-light p-3 mb-4 rounded">
            <h6>Thời gian hoạt động</h6>
            <p className="mb-1">- Thứ 2 đến thứ 6: 8h30 - 22h</p>
            <p>- Thứ 7, chủ nhật: 8h - 22h30</p>
          </div>

          <h5 className="mb-3">Danh sách cửa hàng</h5>

          <ListGroup>
            {storeLocations.map((store, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <FaMapMarkerAlt className="text-danger me-2" />
                  {store.address}
                </div>
                <Badge bg={store.status === "Còn hàng" ? "success" : "warning"}>
                  {store.status}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsShowroomOpen(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <Hotline />
      <Footer />
    </>
  );
};

ChiTietSanPham.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.string,
  }),
};

export default ChiTietSanPham;
