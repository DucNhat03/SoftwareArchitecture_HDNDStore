import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HotLine from "../components/layout/Hotline.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Home.css";
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
  FaRegClock,
} from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, isNew, discount }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Debug what's actually in the product object
  console.log("Product received by ProductCard:", product);

  // Extract image correctly - handle both string and array formats
  let img;
  if (
    product.image &&
    Array.isArray(product.image) &&
    product.image.length > 0
  ) {
    img = product.image[0];
  } else if (product.img) {
    img = product.img;
  } else {
    img = "https://via.placeholder.com/300x300?text=No+Image";
  }

  // Extract title and price with fallbacks
  const title = product.name || product.title || "Product Name";
  const price = product.price || 0;

  // Format price correctly
  const displayPrice =
    typeof price === "number"
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
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x300?text=Image+Error";
          }}
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
              className={
                i < (product.rating || 4) ? "rating-star filled" : "rating-star"
              }
              size={12}
            />
          ))}
          <small className="ms-1 rating-count">(24)</small>
        </div>

        <Card.Title className="product-title" onClick={handleClick}>
          {title}
        </Card.Title>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="color-options">
            {/* Show actual color options if available */}
            {product.variants &&
            Array.isArray(product.variants) &&
            product.variants.length > 0 ? (
              product.variants.slice(0, 3).map((variant, idx) => (
                <span
                  key={idx}
                  className="color-dot"
                  style={{
                    backgroundColor:
                      variant.color.toLowerCase() === "đen"
                        ? "black"
                        : variant.color.toLowerCase() === "trắng"
                        ? "white"
                        : variant.color.toLowerCase() === "xanh"
                        ? "blue"
                        : "#ddd",
                    border:
                      variant.color.toLowerCase() === "trắng"
                        ? "1px solid #ddd"
                        : "none",
                  }}
                ></span>
              ))
            ) : (
              <>
                <span className="color-dot bg-light border"></span>
                <span className="color-dot bg-dark"></span>
                <span className="color-dot bg-primary"></span>
              </>
            )}
          </div>

          <div className="product-price">{displayPrice}</div>
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
  // Add more detailed logging
  console.log(`ItemList ${title} received items:`, items);

  // Special message when items array exists but is empty
  if (Array.isArray(items) && items.length === 0) {
    return (
      <Container className="pb-4">
        <SectionHeading title={title} viewAllLink={viewAllLink} />
        <div className="text-center py-5">
          <p className="text-muted">
            Không có sản phẩm nào trong danh mục này.
          </p>
        </div>
      </Container>
    );
  }

  // Loading state when items is null/undefined
  if (!items) {
    return (
      <Container className="pb-4">
        <SectionHeading title={title} viewAllLink={viewAllLink} />
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Đang tải sản phẩm...</p>
        </div>
      </Container>
    );
  }

  return (
    <section className="product-section mb-5">
      <Container className="pb-4">
        <SectionHeading title={title} viewAllLink={viewAllLink} />
        <Row>
          {items.map((item, index) => (
            <Col
              xs={6}
              md={3}
              key={item.id || item._id || index}
              className="mb-2 mt-4"
            >
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
      image:
        "https://img.mwc.com.vn/giay-thoi-trang?w=1150&h=0&FileInput=/Resources/Product/2024/12/26/z6166903262125-de559018a1bdd8144b94c12b91a1b09abd3111d4-d9f2-4eab-addc-c91b966f57ed.jpg",
      count: 120,
      link: "/category?for=women",
    },
    {
      id: 2,
      name: "Giày Nam",
      image:
        "https://img.mwc.com.vn/giay-thoi-trang?w=1150&h=0&FileInput=/Resources/Product/2024/07/28/z5675570332315_4065b624dda274375779934cda756cdf%20(1).jpg",
      count: 85,
      link: "/category?for=men",
    },
    {
      id: 3,
      name: "Sandal & Dép",
      image:
        "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=//Upload/2022/03/z3262734596830-9d62acf46043ab931c61d7909da7f239.jpg",
      count: 64,
      link: "/category?type=sandal",
    },
    {
      id: 4,
      name: "Phụ Kiện",
      image:
        "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=//Upload/2022/02/z3215035913919-3d1e0a2a97c7e0208089d32f52f14c3a.jpg",
      count: 100,
      link: "/category?type=accessories",
    },
  ];

  return (
    <section className="featured-categories py-0 my-0">
  <Container className="pb-4">
    <SectionHeading title="Danh Mục Nổi Bật" />
    <Row>
      {categories.map((category) => (
        <Col md={3} sm={6} className="mb-4" key={category.id}>
          <a href={category.link} className="category-card-link">
            <div className="category-card h-100">
              <div className="category-image">
                <img
                  src={category.image}
                  alt={category.name}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
              <div className="category-content">
                <h3>{category.name}</h3>
                <span className="category-count">
                  {category.count} sản phẩm
                </span>
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

const StoreServices = () => {
  const services = [
    {
      icon: <FaTruck />,
      title: "Miễn Phí Vận Chuyển",
      description: "Cho đơn hàng từ 500.000đ",
    },
    {
      icon: <FaRegClock />,
      title: "Đổi Trả 30 Ngày",
      description: "Nếu sản phẩm có lỗi",
    },
    {
      icon: <FaPhoneAlt />,
      title: "Hỗ Trợ 24/7",
      description: "Hotline: 039.799.6969",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Cửa Hàng",
      description: "Hệ thống cửa hàng trên toàn quốc",
    },
  ];

  return (
    <section className="store-services " style={{ marginTop: "-4%" }}>
      <Container>
        <Row>
          {services.map((service, index) => (
            <Col md={3} sm={6} className="mb-2" key={index}>
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
      image: "https://i.imgur.com/MVgDMuf.png",
      title: "Bộ Sưu Tập Mới Nhất",
      subtitle: "Khám phá các mẫu giày thời thượng cho mùa mới",
      btnText: "Khám phá ngay",
      btnVariant: "primary",
    },
    {
      image: "https://i.imgur.com/Ivv3llR.png",
      title: "Ưu Đãi Mùa Hè",
      subtitle: "Giảm giá đến 50% cho tất cả sản phẩm mùa hè",
      btnText: "Mua ngay",
      btnVariant: "danger",
    },
    {
      image: "https://i.imgur.com/myZbGGC.png",
      title: "Phong Cách Đẳng Cấp",
      subtitle: "Nâng tầm phong cách với bộ sưu tập giày cao cấp",
      btnText: "Xem bộ sưu tập",
      btnVariant: "dark",
    },
  ];

  useEffect(() => {
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");
    const slide = sliderRef.current;

    if (!nextBtn || !prevBtn || !slide) return;

    const nextSlide = () => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
      const lists = document.querySelectorAll(".slide-item");
      slide.appendChild(lists[0]);
    };

    const prevSlide = () => {
      setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
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
          className={`slide-item ${index === activeSlide ? "active" : ""}`}
          style={{ backgroundImage: `url('${slide.image}')`}}
        >
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
            className={`slider-indicator ${
              index === activeSlide ? "active" : ""
            }`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [GiayNu, setGiayNu] = useState([]);
  const [GiayDongGia, setGiayDongGia] = useState([]);
  const [GiayNam, setGiayNam] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refactor API calls to use Promise.all for better performance
  useEffect(() => {
    setLoading(true);

    const fetchProducts = async () => {
      try {
        // Add logging to see request status
        console.log("Fetching products...");

        const [giayNuRes, giayNamRes, giayDongGiaRes] =
          await Promise.all([
            axios.get(
              "http://localhost:5002/products/all/Giày%20nữ"
            ),
            axios.get(
              "http://localhost:5002/products/all/Giày%20nam"
            ),
            axios.get(
              "http://localhost:5002/products/all/price/200000"
            ),
          ]);

        // Log the first item from each response to inspect data structure
        console.log("First item from each category:", {
          giayNu: giayNuRes.data[0],
          giayDongGia: giayDongGiaRes.data[0],
          giayNam: giayNamRes.data[0],
        });

        // Only set state if data exists
        if (giayNuRes.data && Array.isArray(giayNuRes.data)) {
          console.log("Setting cao got nu data:", giayNuRes.data.slice(0, 8));
          setGiayNu(giayNuRes.data.slice(0, 8));
        } else {
          console.warn("No cao got nu data or wrong format");
        }

        if (giayDongGiaRes.data && Array.isArray(giayDongGiaRes.data)) {
          setGiayDongGia(giayDongGiaRes.data.slice(0, 8));
        }

        if (giayNamRes.data && Array.isArray(giayNamRes.data)) {
          setGiayNam(giayNamRes.data.slice(0, 8));
        }

        // Add fallbacks if any category has no products
        if (
          (!giayNuRes.data || !giayNuRes.data.length) &&
          GiayNu.length === 0
        ) {
          console.log("Using fallback for cao got nu");
          setGiayNu([
            {
              id: 1,
              name: "Giày Cao Gót MWC Sample",
              price: 295000,
              image: [
                "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/11/20/z6049942134068_18729697cfba6413c3908ecf5dfb6cba.jpg",
              ],
              rating: 4,
              variants: [
                { size: "38", color: "Đen", stock: 10 },
                { size: "39", color: "Trắng", stock: 5 },
              ],
            },
            // Add more fallback products for testing...
          ]);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);

        // Log specific error details
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Request setup error:", error.message);
        }

        // Set fallback data for testing UI when API fails
        if (GiayNu.length === 0) {
          const fallbackProducts = [
            {
              id: 1,
              name: "Giày Cao Gót MWC Fallback",
              price: 295000,
              image: [
                "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/11/20/z6049942134068_18729697cfba6413c3908ecf5dfb6cba.jpg",
              ],
              rating: 4,
            },
            // Add more fallback products...
          ];
          setGiayNu(fallbackProducts);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <HeroSlider />
      <FeaturedCategories />
      {/* Sale Items */}
      <ItemList
        title="ĐỒNG GIÁ HẤP DẪN"
        items={GiayDongGia}
        viewAllLink="/category?sale=true"
      />
      {/* Women's Collection */}
      <ItemList
        title="GIÀY NỮ"
        items={GiayNu}
        viewAllLink="/category?for=women"
      />
      {/* Men's Collection */}
      <ItemList
        title="GIÀY NAM"
        items={GiayNam}
        viewAllLink="/category?for=men"
      />
      {/* Store Services */}
      <StoreServices />
      <HotLine />
      <Footer />
    </>
  );
};

export default Home;
