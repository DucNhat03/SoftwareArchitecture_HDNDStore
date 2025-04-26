import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HotLine from "../components/layout/Hotline.jsx";
import "../styles/profile/Category.css";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaFilter, 
  FaHeart, 
  FaShoppingBag, 
  FaEye, 
  FaTh, 
  FaList, 
  FaSearch,
  FaStar,
  FaSortAmountDown,
  FaSyncAlt,
  FaRegSadTear
} from "react-icons/fa";
import { Card, Container, Row, Col, Button, Form, Badge, Spinner, Offcanvas, Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    navigate("/chi-tiet-san-pham");
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  
  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
      <Card 
        className="product-card h-100 border-0 shadow-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {product.isNew && (
          <Badge bg="primary" className="product-badge new-badge">Mới</Badge>
        )}
        
        {product.discount && (
          <Badge bg="danger" className="product-badge sale-badge">
            -{product.discount}%
          </Badge>
        )}
        
        <div className="product-img-container">
          <Card.Img 
            variant="top" 
            src={product.image} 
            alt={product.name}
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
                title="Thêm vào yêu thích"
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
          <div className="d-flex align-items-center mb-2">
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i}
                  className={i < (product.rating || 4) ? "text-warning" : "text-muted"} 
                  size={12}
                />
              ))}
            </div>
            <small className="ms-2 text-muted">({product.reviewCount || 24})</small>
          </div>
          
          <Card.Title 
            className="product-title mb-2"
            onClick={handleClick}
          >
            {product.name}
          </Card.Title>
          
          <p className="product-description text-muted small mb-2">
            {product.description && product.description.length > 60
              ? `${product.description.substring(0, 60)}...`
              : product.description}
          </p>
          
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <div className="color-options">
              {product.colors?.map((color, index) => (
                <span 
                  key={index} 
                  className="color-dot" 
                  style={{ backgroundColor: color }}
                  title={`Color ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="product-price-container">
              {product.originalPrice && (
                <small className="original-price text-muted text-decoration-line-through me-2">
                  {formatPrice(product.originalPrice)}
                </small>
              )}
              <span className="product-price">{formatPrice(product.price)}</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    priceRange: [0, 2000000],
    categories: [],
    colors: [],
    sizes: [],
    brands: []
  });
  
  // Categories for filter
  const categories = [
    { id: 1, name: "Dép nữ" },
    { id: 2, name: "Giày cao gót" },
    { id: 3, name: "Giày thể thao" },
    { id: 4, name: "Dép nam" },
    { id: 5, name: "Giày lười" },
    { id: 6, name: "Balo" }
  ];
  
  // Colors for filter
  const colors = {
    "Bạc": "#C0C0C0",
    "Nâu": "#8B4513",
    "Trắng": "#e8e8e8",
    "Đen": "#000000",
    "Đỏ": "#FF0000",
    "Xanh": "#0000FF",
    "Kem": "#F5F5DC",
    "Vàng": "#FFFF00",
    "Hồng": "#FFC0CB",
    "Xám": "#808080",
  };
  
  // Sizes for filter
  const sizes = ["35", "36", "37", "38", "39", "40", "41", "42", "43"];
  
  // Brands for filter
  const brands = ["MWC", "Nike", "Adidas", "Vans", "Converse"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5002/products/all");
        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu sản phẩm!");
        }
        const data = await response.json();
        
        // Add some additional properties for demo purposes
        const enhancedData = data.map(product => ({
          ...product,
          rating: Math.floor(Math.random() * 5) + 3,
          reviewCount: Math.floor(Math.random() * 100) + 10,
          isNew: Math.random() > 0.7,
          discount: Math.random() > 0.8 ? Math.floor(Math.random() * 30) + 10 : null,
          originalPrice: Math.random() > 0.8 ? product.price * 1.2 : null,
          colors: product.colors || ["#000000", "#FFFFFF"]
        }));
        
        setProducts(enhancedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const getFilteredAndSortedProducts = () => {
    // 1. Lọc sản phẩm theo khoảng giá và các filter khác
    const filtered = products.filter((product) => {
      const [min, max] = filterOptions.priceRange;
      const inPriceRange = product.price >= min && product.price <= max;

      const inCategory =
        filterOptions.categories.length === 0 ||
        filterOptions.categories.includes(product.subcategories);
    
      const inColor =
        filterOptions.colors.length === 0 ||
        product.variants.some((v) => filterOptions.colors.includes(v.color));
    

      const inSize =
        filterOptions.sizes.length === 0 ||
        product.variants.some((v) => filterOptions.sizes.includes(v.size));


      return inPriceRange && inCategory && inColor && inSize;
    });

    // 2. Sắp xếp sản phẩm đã lọc
    let sorted = [...filtered];
    if (sortOption === "2") {
      sorted.sort((a, b) => a.price - b.price); // Giá tăng dần
    } else if (sortOption === "3") {
      sorted.sort((a, b) => b.price - a.price); // Giá giảm dần
    } else if (sortOption === "4") {
      sorted.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1)); // Mới nhất
    } else if (sortOption === "5") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Đánh giá cao
    }

    return sorted;
  };


  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };



  
  const sortedProducts = getFilteredAndSortedProducts();

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  // Generate page numbers with ellipsis for large number of pages
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let pageNumbers = [];
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end page numbers to show
      let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
      
      // Adjust start page if end page is at the limit
      if (endPage === totalPages - 1) {
        startPage = Math.max(2, endPage - (maxPagesToShow - 3));
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }
      
      // Add page numbers between start and end
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const handleResetFilters = () => {
    setFilterOptions({
      priceRange: [0, 2000000],
      categories: [],
      colors: [],
      sizes: [],
      brands: []
    });
  };
  
  const handleFilterChange = (type, value) => {
    setFilterOptions(prev => {
      if (type === 'priceRange') {
        return { ...prev, priceRange: value };
      } else {
        // For arrays (categories, colors, sizes, brands)
        const currentValues = [...prev[type]];
        const valueIndex = currentValues.indexOf(value);
        
        if (valueIndex === -1) {
          currentValues.push(value);
        } else {
          currentValues.splice(valueIndex, 1);
        }
        
        return { ...prev, [type]: currentValues };
      }
    });
  };
  
  const formatPriceRange = (range) => {
    return range.map(price => 
      new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        maximumFractionDigits: 0 
      }).format(price)
    ).join(' - ');
  };



  return (
    <>
      <Header />
      
      <Container fluid className="category-page py-4" style={{ marginTop: '-1%' }}>
        <Container className="px-4">
          <Breadcrumb>
            <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item active>Danh mục sản phẩm</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
        <Container>
          <Row className="mb-0" style={{ marginTop: '-63%' }}>
            {/* Page Title */}
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="category-title mb-1">Sản Phẩm</h2>
                  <p className="text-muted">
                    {loading ? 'Đang tải sản phẩm...' : `Hiển thị ${currentProducts.length} trong số ${products.length} sản phẩm`}
                  </p>
                </div>
                
                <div className="view-options d-flex gap-3 align-items-center">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
                    size="sm"
                    className="view-btn"
                    onClick={() => setViewMode('grid')}
                  >
                    <FaTh />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
                    size="sm"
                    className="view-btn"
                    onClick={() => setViewMode('list')}
                  >
                    <FaList />
                  </Button>
                  
                  <Button 
                    variant="outline-primary"
                    onClick={() => setShowFilters(true)}
                    className="d-md-none filter-btn"
                  >
                    <FaFilter className="me-2" /> Lọc
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          
          <Row>
            {/* Sidebar Filters (Desktop) */}
            <Col md={3} className="d-none d-md-block mt-3">
              <Card className="filter-sidebar shadow-sm border-0 mb-4">
                <Card.Header className="bg-white py-3 border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FaFilter className="me-2" /> Lọc Sản Phẩm
                    </h5>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={handleResetFilters}
                    >
                      <FaSyncAlt className="me-1" /> Đặt lại
                    </Button>
                  </div>
                </Card.Header>
                
                <Card.Body>
                  {/* Price Range Filter */}
                  <div className="filter-section mb-4">
                    <h6 className="filter-title">Khoảng Giá</h6>
                    <div className="price-range-container">
                      <div className="price-range-display mb-2 small">
                        {formatPriceRange(filterOptions.priceRange)}
                      </div>
                      <Form.Range
                        min={0}
                        max={2000000}
                        step={50000}
                        value={filterOptions.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                      />
                    </div>
                  </div>
                  
                  {/* Category Filter */}
                  <div className="filter-section mb-4">
                    <h6 className="filter-title">Danh Mục</h6>
                    {categories.map(category => (
                     
                      <Form.Check
                        key={category.id}
                        type="checkbox"
                        id={`category-${category.id}`}
                        label={category.name}
                        className="mb-2"
                        checked={filterOptions.categories.includes(category.name)}
                        onChange={() => handleFilterChange('categories', category.name)}
                      />
                    ))}
                  </div>
                  
                  {/* Color Filter */}
                  <div className="filter-section mb-4">
                    <h6 className="filter-title">Màu Sắc</h6>
                    <div className="color-filter d-flex flex-wrap gap-2 mt-2">
                      {Object.entries(colors).map(([colorName, colorHex], index) => (
                        <div
                          key={index}
                          className={`color-filter-option ${filterOptions.colors.includes(colorName) ? 'selected' : ''
                            }`}
                          style={{ backgroundColor: colorHex }}
                          onClick={() => handleFilterChange('colors', colorName)}
                          title={colorName}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Size Filter */}
                  <div className="filter-section mb-4">
                    <h6 className="filter-title">Kích Thước</h6>
                    <div className="size-filter d-flex flex-wrap gap-2 mt-2">
                      {sizes.map((size, index) => (
                        <div
                          key={index}
                          className={`size-filter-option ${
                            filterOptions.sizes.includes(size) ? 'selected' : ''
                          }`}
                          onClick={() => handleFilterChange('sizes', size)}
                        >
                          {size}
                        </div>
                      ))}
                    </div>
                  </div>
        
                </Card.Body>
              </Card>
              
              {/* Featured Product */}
              <Card className="featured-product-card shadow-sm border-0 overflow-hidden">
                <Card.Body className="p-0">
                  <div className="featured-product-img">
                    <img 
                      src="https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/04/z6092365614579_f62dc01f434003a9427af6c017ce3d3d.jpg" 
                      className="img-fluid"
                      alt="Featured Product"
                    />
                    <Badge bg="danger" className="featured-badge">HOT</Badge>
                  </div>
                  <div className="p-3">
                    <h6 className="mb-2">Sản Phẩm Nổi Bật</h6>
                    <p className="small mb-2">Giày Thể Thao Nữ MWC A205 - Giày Thể Thao Đế Cao</p>
                    <div className="fw-bold text-danger">295.000₫</div>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="mt-2 w-100"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            {/* Product Grid */}
            <Col md={9}>
              {/* Sorting Options */}
              <div className="sorting-bar p-3 bg-light rounded mb-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <FaSortAmountDown className="text-primary me-2" />
                  <span className="d-none d-sm-inline">Sắp xếp theo:</span>
                </div>
                <Form.Select
                  value={sortOption}
                  onChange={handleSortChange}
                  style={{ width: "auto" }}
                  className="ms-2"
                >
                  <option value="1">Mặc định</option>
                  <option value="2">Giá: Thấp đến cao</option>
                  <option value="3">Giá: Cao đến thấp</option>
                  <option value="4">Mới nhất</option>
                  <option value="5">Đánh giá cao</option>
                </Form.Select>
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Đang tải sản phẩm...</p>
                </div>
              )}
              
              {/* Error State */}
              {error && (
                <div className="text-center py-5">
                  <FaRegSadTear size={40} className="text-muted mb-3" />
                  <h5>Đã xảy ra lỗi</h5>
                  <p className="text-danger">{error}</p>
                  <Button variant="primary" onClick={() => window.location.reload()}>
                    <FaSyncAlt className="me-2" /> Thử lại
                  </Button>
                </div>
              )}
              
              {/* Empty State */}
              {!loading && !error && currentProducts.length === 0 && (
                <div className="text-center py-5">
                  <FaSearch size={40} className="text-muted mb-3" />
                  <h5>Không tìm thấy sản phẩm</h5>
                  <p className="text-muted mb-4">Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn</p>
                  <Button variant="outline-primary" onClick={handleResetFilters}>
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
              
              {/* Products */}
              {!loading && !error && currentProducts.length > 0 && (
                <Row className={viewMode === 'list' ? 'list-view' : ''}>
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Row>
              )}
              
              {/* Pagination */}
              {!loading && !error && totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <Button 
                        variant="light"
                        className="page-link" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <FaChevronLeft size={12} />
                      </Button>
                    </li>
                    
                    {getPageNumbers().map((number, index) => (
                      <li 
                        key={index}
                        className={`page-item ${number === currentPage ? 'active' : ''} ${number === '...' ? 'disabled' : ''}`}
                      >
                        <Button 
                          variant={number === currentPage ? "primary" : "light"}
                          className="page-link"
                          onClick={number !== '...' ? () => handlePageChange(number) : undefined}
                          disabled={number === '...'}
                        >
                          {number}
                        </Button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <Button 
                        variant="light"
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <FaChevronRight size={12} />
                      </Button>
                    </li>
                  </ul>
                </nav>
              )}
            </Col>
          </Row>
        </Container>
      </Container>
      
      {/* Mobile Filter Offcanvas */}
      <Offcanvas 
        show={showFilters} 
        onHide={() => setShowFilters(false)}
        placement="start"
        className="filters-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <FaFilter className="me-2" /> Lọc Sản Phẩm
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex justify-content-end mb-3">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={handleResetFilters}
            >
              <FaSyncAlt className="me-1" /> Đặt lại bộ lọc
            </Button>
          </div>
          
          {/* Price Range Filter */}
          <div className="filter-section mb-4">
            <h6 className="filter-title">Khoảng Giá</h6>
            <div className="price-range-container">
              <div className="price-range-display mb-2 small">
                {formatPriceRange(filterOptions.priceRange)}
              </div>
              <Form.Range
                min={0}
                max={2000000}
                step={50000}
                value={filterOptions.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="filter-section mb-4">
            <h6 className="filter-title">Danh Mục</h6>
            {categories.map(category => (
              <Form.Check
                key={category.id}
                type="checkbox"
                id={`category-mobile-${category.id}`}
                label={category.name}
                className="mb-2"
                checked={filterOptions.categories.includes(category.id)}
                onChange={() => handleFilterChange('categories', category.id)}
              />
            ))}
          </div>
          
          {/* Color Filter */}
          <div className="filter-section mb-4">
            <h6 className="filter-title">Màu Sắc</h6>
            <div className="color-filter d-flex flex-wrap gap-2 mt-2">
              {Object.entries(colors).map(([colorName, colorHex], index) => (
                <div
                  key={index}
                  className={`color-filter-option ${filterOptions.colors.includes(colorName) ? 'selected' : ''
                    }`}
                  style={{ backgroundColor: colorHex }}
                  onClick={() => handleFilterChange('colors', colorName)}
                  title={colorName}
                />
              ))}
            </div>
          </div>

          
          {/* Size Filter */}
          <div className="filter-section mb-4">
            <h6 className="filter-title">Kích Thước</h6>
            <div className="size-filter d-flex flex-wrap gap-2 mt-2">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className={`size-filter-option ${
                    filterOptions.sizes.includes(size) ? 'selected' : ''
                  }`}
                  onClick={() => handleFilterChange('sizes', size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
          
          {/* Brand Filter */}
          <div className="filter-section mb-4">
            <h6 className="filter-title">Thương Hiệu</h6>
            {brands.map((brand, index) => (
              <Form.Check
                key={index}
                type="checkbox"
                id={`brand-mobile-${index}`}
                label={brand}
                className="mb-2"
                checked={filterOptions.brands.includes(brand)}
                onChange={() => handleFilterChange('brands', brand)}
              />
            ))}
          </div>
          
          <div className="d-grid mt-4">
            <Button variant="primary" onClick={() => setShowFilters(false)}>
              Xác nhận
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      
      <HotLine />
      <Footer />
    </>
  );
};

export default ProductList;