import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HotLine from "../components/layout/Hotline.jsx";
import "../styles/profile/Category.css";
import { FaChevronLeft,FaChevronRight } from "react-icons/fa";

const products = Array(5).fill([
    {
        id: 1,
        name: "Giày Cao Gót Nữ MWC G161",
        description:
            "Giày Cao Gót Quai Mảnh Đính Đá Sang Chảnh, Đế Nhọn Cao 11cm, Mũi Vuông Sành Điệu.",
        price: "275.000đ",
        image:
            "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/13/z6220378285399_c12f0b2aa29b067901a90cc03d1b14b9.jpg",
        colors: ["bg-dark", "bg-secondary"],
    },
    {
        id: 2,
        name: "Giày Cao Gót Nữ MWC G164",
        description:
            "Giày Cao Gót Quai Mảnh Đính Đá Sang Chảnh, Đế Nhọn Cao 11cm, Mũi Vuông Sành Điệu.",
        price: "295.000đ",
        image:
            "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/01/z6185919858955_2b00d999af4b1e163704045bd65c3025.jpg",
        colors: ["bg-dark", "bg-secondary"],
    },
    {
        id: 3,
        name: "Dép Nữ MWC 8515",
        description:
            "Dép Xỏ Ngón Nữ Đi Học, Đi Làm, Đi Chơi Siêu Bền Đẹp, Dép Đế Cao Quai Mảnh Ngang Chéo Thanh Lịch, Thời Trang.",
        price: "250.000đ",
        image:
            "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/13/z6223159839690_de0e855848b2ec2f4689480387c8a54f.jpg",
        colors: ["bg-dark", "bg-secondary"],
    },
    {
        id: 4,
        name: "BALO MWC 1170",
        description:
            "Balo Unisex Thời Trang Chống Sốc, Chống Nước, Nhiều Ngăn Siêu Tiện Lợi Dùng Đựng Laptop, Mang Đi Học, Đi Chơi.",
        price: "195.000đ",
        image:
            "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/08/23/batch_z5757937583045_7ef9e3b8d900e32c3952edd2300bdb64.jpg",
        colors: ["bg-dark"],
    }
]).flat().map((product, index) => ({ ...product, id: index + 1 }));

const ProductCard = ({ product }) => {
    return (
        <div className="col-sm-3 sale-product">
            <div className="product-card card">
                <a href="#">
                    <img className="product-img card-img-top" src={product.image} alt={product.name} />
                    <div className="card-body">
                        <p className="card-title my-1 p-0 card-description">{product.name} - {product.description}</p>
                        <p className="card-price text-center fw-bold m-0 p-0">{product.price}</p>
                        <div className="choose-color d-flex justify-content-center mt-2">
                            {product.colors.map((color, index) => (
                                <div key={index} className={`card-product_color ${color}`}></div>
                            ))}
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
};

const ProductList = () => {
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
                        <select className="form-control form-select" style={{ width: "200px" }}>
                            <option value="1">Tùy chọn</option>
                            <option value="2">Giá: Thấp đến cao</option>
                            <option value="3">Giá: Cao đến thấp</option>
                            <option value="4">Tên: A - Z</option>
                            <option value="5">Bán chạy nhất</option>
                        </select>
                    </div>
                </div>
                <div className="row mt-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="page-number d-flex justify-content-center my-2">
                    <button className="btn btn-light mx-2"><FaChevronLeft /></button>
                    <button className="btn btn-light mx-2 active">1</button>
                    <button className="btn btn-light mx-2">2</button>
                    <button className="btn btn-light mx-2"><FaChevronRight /></button>

                </div>
            </div>
            <HotLine />
            <Footer />
        </>
    );
};

export default ProductList;
