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
            <div className="product-card card" onClick={handleClick} style={{ cursor: "pointer" }}>
                <img className="product-img card-img-top" src={product.image} alt={product.name} />
                <div className="card-body">
                    <p className="card-title my-1 p-0 card-description">
                        {product.name} - {product.description}
                    </p>
                    <p className="card-price text-center fw-bold m-0 p-0">{product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
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
    const [sortOption, setSortOption] = useState("1"); // lọc giá
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12); // Mỗi trang hiển thị 12 sản phẩm

  

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


    // Hàm xử lý sắp xếp theo giá
    const sortProducts = (option) => {
        let sortedProducts = [...products];
        if (option === "2") {
            // Giá: Thấp đến cao
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (option === "3") {
            // Giá: Cao đến thấp
            sortedProducts.sort((a, b) => b.price - a.price);
        }
        return sortedProducts;
    };
    // Cập nhật sản phẩm khi lựa chọn thay đổi
    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };
    const sortedProducts = sortProducts(sortOption);

    // Xác định các sản phẩm cần hiển thị trên trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Tính số trang tổng cộng
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    // Chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Tạo danh sách các số trang cần hiển thị (ví dụ: 1, 2, 3, ...)
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    return (
        <>
            <Header />
            <div className="container-fluid home-default categoryWrapper">
                <div className="row_tittle py-4 row">
                    <h5 className="text-dark col-md-6 d-flex justify-content-start">SẢN PHẨM</h5>
                    <div className="row_title-right col-md-6 d-flex justify-content-end align-items-center">
                        <button className="btn btn-link" style={{ textDecoration: "none", color: "black" }}>
                            <i className="fa-solid fa-bars text-dark mx-2"></i> BỘ LỌC
                        </button>
                        <span className="text-dark mt-2 px-4">SẮP XẾP THEO: </span>
                        <select
                            className="form-control form-select"
                            style={{ width: "200px" }}
                            value={sortOption}
                            onChange={handleSortChange}
                        >
                            <option value="1">Tùy chọn</option>
                            <option value="2">Giá: Thấp đến cao</option>
                            <option value="3">Giá: Cao đến thấp</option>
                            <option value="4">Tên: A - Z</option>
                            <option value="5">Bán chạy nhất</option>
                        </select>

                    </div>
                </div>

                {loading && <p className="text-center">Đang tải dữ liệu...</p>}
                {error && <p className="text-center text-danger">{error}</p>}

                <div className="row mt-4">
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        !loading && <p className="text-center">Không có sản phẩm nào!</p>
                    )}
                </div>

                {/* Phân trang */}
              
                <div className="page-number d-flex justify-content-center my-2">
                    <button
                        className="btn btn-light mx-2"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft />
                    </button>

                    {/* Hiển thị các số trang */}
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            className={`btn btn-light mx-2 ${number === currentPage ? 'active' : ''}`}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </button>
                    ))}

                    <button
                        className="btn btn-light mx-2"
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
