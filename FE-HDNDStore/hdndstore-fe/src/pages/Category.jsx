import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HotLine from "../components/layout/Hotline.jsx";
import "../styles/profile/Category.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const handleClick = () => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "/chi-tiet-san-pham";
  };
  return (
    <div className="col-sm-3 sale-product">
      <div
        className="product-card card"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <img
          className="product-img card-img-top"
          src={product.image}
          alt={product.name}
        />
        <div className="card-body">
          <p className="card-title my-1 p-0 card-description">
            {product.name} - {product.description}
          </p>
          <p className="card-price text-center fw-bold m-0 p-0">
            {product.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
          <div className="choose-color d-flex justify-content-center mt-2">
            {product.colors?.map((color, index) => (
              <div key={index} className={`card-product_color ${color}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5002/products/all");
        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu sản phẩm!");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sortProducts = (option) => {
    let sortedProducts = [...products];
    if (option === "2") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (option === "3") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    return sortedProducts;
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };
  const sortedProducts = sortProducts(sortOption);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );


  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <>
      <Header />
      <div
        className="container-fluid home-default categoryWrapper"
        style={{ padding: "4% 5%" }}
      >
        <div className="row_tittle py-3 row align-items-center justify-content-between">
          <div className="col-md-6 d-flex align-items-center">
            <h5 className="text-dark mb-0">SẢN PHẨM</h5>
          </div>
          <div className="col-md-6 d-flex justify-content-end align-items-center gap-3">
            <button
              className="btn btn-link p-0"
              style={{ textDecoration: "none", color: "black" }}
            >
              <i className="fa-solid fa-bars text-dark mx-2"></i> BỘ LỌC
            </button>
            <select
              className="form-control form-select"
              style={{ width: "200px" }}
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="1">Tùy chọn</option>
              <option value="2">Giá: Thấp đến cao</option>
              <option value="3">Giá: Cao đến thấp</option>
            </select>
          </div>
        </div>

        {loading && <p className="text-center">Đang tải dữ liệu...</p>}
        {error && <p className="text-center text-danger">{error}</p>}

        <div className="row mt-4">
          {currentProducts.length > 0
            ? currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            : !loading && <p className="text-center">Không có sản phẩm nào!</p>}
        </div>

        {/* Phân trang */}
        <div className="page-number d-flex justify-content-center my-4">
          <button
            className="btn btn-light mx-1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              className={`btn btn-light mx-1 ${
                number === currentPage ? "active" : ""
              }`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}

          <button
            className="btn btn-light mx-1"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <HotLine />
      <Footer />
    </>
  );
};

export default ProductList;
