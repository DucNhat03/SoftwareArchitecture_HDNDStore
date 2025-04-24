import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HotLine from "../components/layout/Hotline.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/profile/Home.css";
import { 
  FaChevronRight, 
  FaChevronLeft, 
  FaShoppingBag, 
  FaHeart, 
  FaEye, 
  FaFire, 
  FaStar, 
  FaTags,
  FaArrowRight,
  FaMapMarkerAlt,
  FaTruck,
  FaPhoneAlt,
  FaRegClock
} from "react-icons/fa";
import { Container, Row, Col, Button, Card, Badge, Spinner } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, isNew, discount }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Extract image, title and price from product object
  const img = product.image || product.img;
  const title = product.name || product.title;
  const price = product.price || "0";
  
  // Format price correctly
  const displayPrice = typeof price === "number" 
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price)
    : price;

  const handleClick = () => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    navigate("/chi-tiet-san-pham");
  };

  return (
    <Card 
      className="product-card border-0 shadow-sm h-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isNew && (
        <Badge bg="primary" className="product-badge new-badge">
          Mới
        </Badge>
      )}
      
      {discount && (
        <Badge bg="danger" className="product-badge sale-badge">
          -{discount}%
        </Badge>
      )}
      
      <div className="product-img-container">
        <Card.Img 
          variant="top" 
          src={img} 
          alt={title}
          className="product-img"
          onClick={handleClick}
        />
        
        {isHovered && (
          <div className="product-actions">
            <Button 
              variant="light" 
              className="product-action-btn"
              title="Thêm vào giỏ hàng"
            >
              <FaShoppingBag />
            </Button>
            <Button 
              variant="light" 
              className="product-action-btn"
              title="Yêu thích"
            >
              <FaHeart />
            </Button>
            <Button 
              variant="light" 
              className="product-action-btn"
              title="Xem nhanh"
              onClick={handleClick}
            >
              <FaEye />
            </Button>
          </div>
        )}
      </div>
      
      <Card.Body className="p-3">
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <FaStar 
              key={i} 
              className={i < 4 ? "rating-star filled" : "rating-star"} 
              size={12}
            />
          ))}
          <small className="ms-1 rating-count">(24)</small>
        </div>
        
        <Card.Title 
          className="product-title"
          onClick={handleClick}
        >
          {title}
        </Card.Title>
        
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="color-options">
            <span className="color-dot bg-light border"></span>
            <span className="color-dot bg-dark"></span>
            <span className="color-dot bg-primary"></span>
          </div>
          
          <div className="product-price">
            {displayPrice}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const SectionHeading = ({ title, viewAllLink }) => (
  <div className="section-heading d-flex justify-content-between align-items-center mb-4">
    <h2 className="section-title">{title}</h2>
    {viewAllLink && (
      <a href={viewAllLink} className="view-all-link">
        Xem tất cả <FaArrowRight className="ms-1" size={12} />
      </a>
    )}
  </div>
);

const ItemList = ({ title, items, viewAllLink }) => {
  if (!items || items.length === 0) {
    return (
      <Container className="py-4">
        <SectionHeading title={title} viewAllLink={viewAllLink} />
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Đang tải sản phẩm...</p>
        </div>
      </Container>
    );
  }

  return (
    <section className="product-section py-5">
      <Container>
        <SectionHeading title={title} viewAllLink={viewAllLink} />
        <Row>
          {items.map((item, index) => (
            <Col xs={6} md={3} key={item.id || index} className="mb-4">
              <ProductCard 
                product={item} 
                isNew={index % 3 === 0}
                discount={index % 4 === 0 ? 15 : null}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

const FeaturedCategories = () => {
  const categories = [
    {
      id: 1,
      name: "Giày Nữ",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/11/20/z6049942134068_18729697cfba6413c3908ecf5dfb6cba.jpg",
      count: 120,
      link: "/category?for=women"
    },
    {
      id: 2,
      name: "Giày Nam",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/04/z6092365614579_f62dc01f434003a9427af6c017ce3d3d.jpg",
      count: 85,
      link: "/category?for=men"
    },
    {
      id: 3,
      name: "Sandal & Dép",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/11/z6119144407944_24a4cb6ac285456b09483848b9b45a51.jpg",
      count: 64,
      link: "/category?type=sandal"
    },
    {
      id: 4,
      name: "Phụ Kiện",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/06/z6095835436711_180c834e94a1915d9451b05482771b7f.jpg",
      count: 38,
      link: "/category?type=accessories"
    }
  ];

  return (
    <section className="featured-categories py-5">
      <Container>
        <SectionHeading title="Danh Mục Nổi Bật" />
        <Row>
          {categories.map(category => (
            <Col md={3} sm={6} className="mb-4" key={category.id}>
              <a href={category.link} className="category-card-link">
                <div className="category-card">
                  <div className="category-image">
                    <img src={category.image} alt={category.name} />
                  </div>
                  <div className="category-content">
                    <h3>{category.name}</h3>
                    <span className="category-count">{category.count} sản phẩm</span>
                    <Button variant="outline-light" size="sm" className="mt-2">
                      Khám phá
                    </Button>
                  </div>
                </div>
              </a>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

const PromoBanner = () => (
  <section className="promo-banner py-5">
    <Container>
      <Row className="align-items-center">
        <Col md={6} className="mb-4 mb-md-0">
          <div className="promo-content">
            <Badge bg="danger" className="mb-3">
              <FaTags className="me-1" /> Hot Sale
            </Badge>
            <h2 className="mb-3">Giảm Giá Lên Đến 50%</h2>
            <p className="mb-4">
              Khám phá bộ sưu tập giày dép mới nhất với nhiều mẫu mã đa dạng và phong cách. 
              Cơ hội tuyệt vời để sở hữu những sản phẩm chất lượng với giá ưu đãi.
            </p>
            <Button variant="primary" size="lg">Mua ngay</Button>
          </div>
        </Col>
        <Col md={6}>
          <img 
            src="https://img.mwc.com.vn/giay-thoi-trang?w=1150&h=1550&FileInput=/Resources/Silde/2024/12/25/IMG_5218.JPG" 
            className="img-fluid rounded" 
            alt="Promotion"
          />
        </Col>
      </Row>
    </Container>
  </section>
);

const StoreServices = () => {
  const services = [
    {
      icon: <FaTruck />,
      title: "Miễn Phí Vận Chuyển",
      description: "Cho đơn hàng từ 500.000đ"
    },
    {
      icon: <FaRegClock />,
      title: "Đổi Trả 30 Ngày",
      description: "Nếu sản phẩm có lỗi"
    },
    {
      icon: <FaPhoneAlt />,
      title: "Hỗ Trợ 24/7",
      description: "Hotline: 1900 8765"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Cửa Hàng",
      description: "Hệ thống cửa hàng trên toàn quốc"
    }
  ];

  return (
    <section className="store-services py-5 bg-light">
      <Container>
        <Row>
          {services.map((service, index) => (
            <Col md={3} sm={6} className="mb-4" key={index}>
              <div className="service-item text-center">
                <div className="service-icon">{service.icon}</div>
                <h4 className="service-title">{service.title}</h4>
                <p className="service-description">{service.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

const HeroSlider = () => {
  const sliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 3;

  const slides = [
    {
      image: "https://template.canva.com/EAGQcDd9WBA/1/0/1600w-XVVBw3rXV6M.jpg",
      title: "Bộ Sưu Tập Mới Nhất",
      subtitle: "Khám phá các mẫu giày thời thượng cho mùa mới",
      btnText: "Khám phá ngay",
      btnVariant: "primary"
    },
    {
      image: "https://template.canva.com/EAGSffnYLDY/1/0/1600w-N7CmXFik4kY.jpg",
      title: "Ưu Đãi Mùa Hè",
      subtitle: "Giảm giá đến 50% cho tất cả sản phẩm mùa hè",
      btnText: "Mua ngay",
      btnVariant: "danger"
    },
    {
      image: "https://template.canva.com/EAFWISeesDo/2/0/1600w-1QmT0v_Fh4k.jpg",
      title: "Phong Cách Đẳng Cấp",
      subtitle: "Nâng tầm phong cách với bộ sưu tập giày cao cấp",
      btnText: "Xem bộ sưu tập",
      btnVariant: "dark"
    }
  ];

  useEffect(() => {
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");
    const slide = sliderRef.current;

    if (!nextBtn || !prevBtn || !slide) return;

    const nextSlide = () => {
      setActiveSlide(prev => (prev + 1) % totalSlides);
      const lists = document.querySelectorAll(".slide-item");
      slide.appendChild(lists[0]);
    };

    const prevSlide = () => {
      setActiveSlide(prev => (prev - 1 + totalSlides) % totalSlides);
      const lists = document.querySelectorAll(".slide-item");
      slide.prepend(lists[lists.length - 1]);
    };

    const autoSlide = setInterval(nextSlide, 5000);

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    return () => {
      nextBtn.removeEventListener("click", nextSlide);
      prevBtn.removeEventListener("click", prevSlide);
      clearInterval(autoSlide);
    };
  }, []);

  return (
    <div className="hero-slider" ref={sliderRef}>
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`slide-item ${index === activeSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        >
          <div className="slide-content">
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <Button variant={slide.btnVariant} size="lg" className="hero-btn">
              {slide.btnText}
            </Button>
          </div>
        </div>
      ))}

      <button className="slider-control prev" id="prev">
        <FaChevronLeft /> 
      </button>
      <button className="slider-control next" id="next">
        <FaChevronRight /> 
      </button>

      <div className="slider-indicators">
        {slides.map((_, index) => (
          <div 
            key={index}
            className={`slider-indicator ${index === activeSlide ? 'active' : ''}`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [caoGotNu, setcaoGotNu] = useState([]);
  const [giayLuoi, setGiayLuoi] = useState([]);
  const [Balo, setBalo] = useState([]);
  const [SandalNam, setSandalNam] = useState([]);
  const [GiayNam, setGiayNam] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refactor API calls to use Promise.all for better performance
  useEffect(() => {
    setLoading(true);
    
    const fetchProducts = async () => {
      try {
        const [caoGotNuRes, giayLuoiRes, baloRes, sandalNamRes, giayNamRes] = await Promise.all([
          axios.get("http://localhost:5002/products/all/category?subcategories=Gi%C3%A0y%20cao%20g%C3%B3t"),
          axios.get("http://localhost:5002/products/all/category?subcategories=Gi%C3%A0y%20l%C6%B0%E1%BB%9Di"),
          axios.get("http://localhost:5002/products/all/category?category=Balo"),
          axios.get("http://localhost:5002/products/all/category?category=SandalDep%20Nam"),
          axios.get("http://localhost:5002/products/all/category?subcategories=Gi%C3%A0y%20th%E1%BB%83%20thao")
        ]);
        
        setcaoGotNu(caoGotNuRes.data.slice(0, 8));
        setGiayLuoi(giayLuoiRes.data.slice(0, 8));
        setBalo(baloRes.data);
        setSandalNam(sandalNamRes.data);
        setGiayNam(giayNamRes.data.slice(0, 8));
        
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Featured products for bestseller section
  const featuredProducts = [
    {
      img: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/11/20/z6049942134068_18729697cfba6413c3908ecf5dfb6cba.jpg",
      title: "Dép Nữ MWC 8346 - Đính Nơ Phối Khóa Chữ Xinh Xắn",
      price: "250.000đ",
      isNew: true
    },
    {
      img: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/04/z6092365614579_f62dc01f434003a9427af6c017ce3d3d.jpg",
      title: "Giày Thể Thao Nữ MWC A205 - Đế Cao Siêu Hack Dáng",
      price: "295.000đ",
      isNew: false,
      discount: 15
    },
    {
      img: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/06/z6095835436711_180c834e94a1915d9451b05482771b7f.jpg",
      title: "Giày Sandal Nữ MWC E144 - 2 Quai Ngang Phối Lót Dán",
      price: "250.000đ",
      isNew: false
    },
    {
      img: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/11/z6119144407944_24a4cb6ac285456b09483848b9b45a51.jpg",
      title: "Sandal Nữ MWC E146 - Quai Tròn Mảnh Ngang Chéo Cách Điệu",
      price: "250.000đ",
      isNew: true,
      discount: 10
    }
  ];

  return (
    <>
      <Header />
      
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Featured Categories */}
      <FeaturedCategories />
      
      {/* Best Sellers Section */}
      <section className="bestsellers-section py-5">
        <Container>
          <div className="section-header text-center mb-4">
            <Badge bg="danger" className="mb-2">
              <FaFire className="me-1" /> HOT
            </Badge>
            <h2 className="bestsellers-title">Sản Phẩm Bán Chạy</h2>
            <p className="text-muted">Những sản phẩm được yêu thích nhất của chúng tôi</p>
          </div>
          
          <Row className="gx-4 gy-4">
            <Col md={6} className="mb-4">
              <div className="featured-banner">
                <img
                  className="img-fluid w-100 h-100"
                  src="https://img.mwc.com.vn/giay-thoi-trang?w=1150&h=1550&FileInput=/Resources/Silde/2024/12/25/IMG_5218.JPG"
                  alt="Featured Collection"
                />
                <div className="featured-overlay">
                  <h3>Bộ Sưu Tập Mới</h3>
                  <p>Phong cách mới cho mùa này</p>
                  <Button variant="light">Xem ngay</Button>
                </div>
              </div>
            </Col>
            
            <Col md={6}>
              <Row>
                {featuredProducts.map((product, index) => (
                  <Col sm={6} key={index} className="mb-4">
                    <ProductCard 
                      product={product} 
                      isNew={product.isNew}
                      discount={product.discount}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Women's Collection */}
      <ItemList 
        title="GIÀY NỮ" 
        items={caoGotNu}
        viewAllLink="/category?for=women" 
      />
      
      {/* Promo Banner */}
      <PromoBanner />
      
      {/* Men's Collection */}
      <ItemList 
        title="GIÀY NAM" 
        items={giayLuoi}
        viewAllLink="/category?for=men" 
      />
      
      {/* Store Services */}
      <StoreServices />
      
      {/* Sale Items */}
      <ItemList 
        title="ĐỒNG GIÁ HẤP DẪN" 
        items={GiayNam}
        viewAllLink="/category?sale=true" 
      />
      
      {/* Instagram Gallery */}
      <section className="instagram-section py-5">
        <Container>
          <div className="text-center mb-4">
            <h3 className="instagram-title">@HDND_STORE</h3>
            <p>Theo dõi chúng tôi trên Instagram</p>
          </div>
          
          <Row className="g-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Col md={2} xs={4} key={i} className="instagram-item-wrapper">
                <a href="#" className="instagram-item">
                  <img 
                    src={`https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/${i+10}/${i*3}.jpg`} 
                    alt="Instagram" 
                    className="img-fluid"
                  />
                  <div className="instagram-overlay">
                    <FaHeart />
                  </div>
                </a>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      <HotLine />
      <Footer />
    </>
  );
};

export default Home;