import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HotLine from "../components/layout/Hotline.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/profile/Home.css";
import "../script.js";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ProductCard = ({ img, title, price }) => {
    const navigate = useNavigate();
    return (
        <div className="product-card m-0 card p-0" onClick={() => navigate(`/chi-tiet-san-pham`)} style={{ cursor: "pointer" }}>
            <a href="#">
                <img className="product-img card-img-top" src={img} alt={title} />
                <div className="card-body">
                    <p className="card-title my-1 p-1">{title}</p>
                    <p className="card-price m-0 p-0 text-center" style={{ fontWeight: 'bold', fontSize: 18 }}>{price}</p>
                    <div className="choose-color d-flex justify-content-center mt-2">
                        <div className="card-product_color bg-light active"></div>
                        <div className="card-product_color bg-primary"></div>
                        <div className="card-product_color bg-secondary"></div>
                    </div>
                </div>
            </a>
        </div>
    );
};

const productx = [
    {
        img: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/11/20/z6049942134068_18729697cfba6413c3908ecf5dfb6cba.jpg",
        title:
            "Dép Nữ MWC 8346 - Dép Nữ Quai Ngang Bản To Đính Nơ Phối Khóa Chữ Xinh Xắn, Thời Trang.",
        price: "250.000đ",
    },
    {
        img: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/04/z6092365614579_f62dc01f434003a9427af6c017ce3d3d.jpg",
        title:
            "Giày Thể Thao Nữ MWC A205 - Giày Thể Thao Nữ Đế Cao Siêu Hack Dáng, Thể Thao Nữ Kiểu Dáng Sneaker Trẻ Trung, Năng Động, Thời Trang.",
        price: "295.000đ",
    },
    {
        img: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/06/z6095835436711_180c834e94a1915d9451b05482771b7f.jpg",
        title:
            "Giày Sandal Nữ MWC E144 - Sandal Nữ 2 Quai Ngang Phối Lót Dán Thanh Lịch, Sandal Nữ Đế Đúc Siêu Bền Đẹp, Thời Trang.",
        price: "250.000đ",
    },
    {
        img: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/11/z6119144407944_24a4cb6ac285456b09483848b9b45a51.jpg",
        title:
            "Giày Sandal Nữ MWC E146 - Sandal Quai Tròn Mảnh Ngang Chéo Cách Điệu, Sandal Đế Cao 4cm Siêu Hack Dáng Năng Động, Trẻ Trung.",
        price: "250.000đ",
    },
];

// const thoiTrang = [
//     {
//       id: 1,
//       title: "Xu Hướng Balo Thời Trang Cho Học Sinh, Sinh Viên",
//       image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Post/2024/12/25/z6165278288682_7f1ea8bd61d947473ba1a1bef87cc0ca.jpg",
//       link: "https://mwc.com.vn/post/xu-huong-balo-thoi-trang-cho-hoc-sinh-sinh-vien"
//     },
//     {
//       id: 2,
//       title: "Những Mẫu Giày Cao Gót Dễ Thương Cho Nàng Diện Tết",
//       image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Post/2024/12/25/z6165262626663_3e8f076b733b9507fa43f4a83c48ad89.jpg",
//       link: "https://mwc.com.vn/post/nhung-mau-giay-cao-got-de-thuong-cho-nang"
//     },
//     {
//       id: 3,
//       title: "Top Các Mẫu Giày Thể Thao Nữ – Phong Cách & Tiện Dụng Cho Mọi Hoạt Động",
//       image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Post/2024/11/12/mwc%20(5).jpg",
//       link: "https://mwc.com.vn/post/httpsmwccomvncollectionsgiay-thoi-trang"
//     },
//     {
//       id: 4,
//       title: "Đón Mùa Lễ Hội Với Giày Búp Bê Lolita – Nàng Đã Sẵn Sàng?",
//       image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Post/2024/11/12/mwc%20(4).jpg",
//       link: "https://mwc.com.vn/post/httpsmwccomvncollectionsgiay-bup-be-moi"
//     }
// ];
const ListItem = ({ name, price, image, description }) => {
    // Định dạng giá theo VND
    const formattedPrice = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);

    return (
        <div className="col-sm-3 sale-product">
            <div className="card product-card">
                <a href="/chi-tiet-san-pham">
                    <img className="card-img-top product-img" src={image} alt={name} />
                    <div className="card-body">
                        <p className="card-title my-1 p-0">{name} - {description}</p>
                        <p className="card-price text-center m-0 p-0 fw-bold">{formattedPrice}</p>
                        <div className="choose-color d-flex justify-content-center mt-2">
                            <div className="card-product_color bg-dark"></div>
                            <div className="card-product_color bg-secondary"></div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
};


const ItemList = ({ title, items }) => {
    return (
        <div className="container-fluid">
            <p className="text-secondary my-5 text-center text-uppercase" style={{ fontSize: 18 }}>{title}</p>
            <div className="row">
                {items.map((item) => (
                    <ListItem key={item.id} {...item} />
                ))}
            </div>
            <a href="/category">
                <p className="my-4 p-0 text-center" style={{ fontSize: "18px", textDecoration: "underline" }}>
                    XEM TẤT CẢ
                </p>
            </a>
            <hr className="hr" />
        </div>
    );
};

const Home = () => {
    const [caoGotNu, setcaoGotNu] = useState([]);
    const [giayLuoi, setGiayLuoi] = useState([]);
    const [Balo, setBalo] = useState([]);
    const [SandalNam, setSandalNam] = useState([]);
    const [GiayNam, setGiayNam] = useState([]);

    // Gọi API để lấy danh sách sản phẩm
    useEffect(() => {
        axios
            .get("http://localhost:5002/products/all/category?subcategories=Gi%C3%A0y%20cao%20g%C3%B3t")
            .then((response) => {
                const firstFourProducts = response.data.slice(0, 4);
                setcaoGotNu(firstFourProducts);
            })
            .catch((error) => {
                console.error("Lỗi khi tải sản phẩm:", error);
            });
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:5002/products/all/category?subcategories=Gi%C3%A0y%20l%C6%B0%E1%BB%9Di")
            .then((response) => {
                setGiayLuoi(response.data);
            })
            .catch((error) => {
                console.error("Lỗi khi tải sản phẩm:", error);
            });
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:5002/products/all/category?category=Balo")
            .then((response) => {
                setBalo(response.data);
                console.log("Danh sách sản phẩm:", Balo);
            })
            .catch((error) => {
                console.error("Lỗi khi tải sản phẩm:", error);
            });
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:5002/products/all/category?category=SandalDep%20Nam")
            .then((response) => {
                setSandalNam(response.data);
                console.log("Danh sách sản phẩm:", SandalNam);
            })
            .catch((error) => {
                console.error("Lỗi khi tải sản phẩm:", error);
            });
    }, []);


    useEffect(() => {
        axios
            .get("http://localhost:5002/products/all/category?subcategories=Gi%C3%A0y%20th%E1%BB%83%20thao")
            .then((response) => {
                const first4product = response.data.slice(0,4);
                setGiayNam(first4product);
            })
            .catch((error) => {
                console.error("Lỗi khi tải sản phẩm:", error);
            });
    }, []);

    useEffect(() => {
        const nextBtn = document.getElementById("next");
        const prevBtn = document.getElementById("prev");
        const slide = document.getElementById("slide");

        if (!nextBtn || !prevBtn || !slide) return;

        const nextSlide = () => {
            let lists = document.querySelectorAll(".home_background-item");
            slide.appendChild(lists[0]);
        };

        const prevSlide = () => {
            let lists = document.querySelectorAll(".home_background-item");
            slide.prepend(lists[lists.length - 1]);
        };

        const autoSlide = setInterval(nextSlide, 3000);

        nextBtn.addEventListener("click", nextSlide);
        prevBtn.addEventListener("click", prevSlide);

        return () => {
            nextBtn.removeEventListener("click", nextSlide);
            prevBtn.removeEventListener("click", prevSlide);
            clearInterval(autoSlide);
        };
    }, []);

    return (
        <>
            <Header />
            <div className="homeWrapper">

                {/* slide */}
                <div className="home_background" id="slide">
                    <div className="home_background-item mt-2"
                        style={ { backgroundImage: "url('https://template.canva.com/EAGQcDd9WBA/1/0/1600w-XVVBw3rXV6M.jpg')"}}
                    ></div>
                    <div className="home_background-item mt-3"
                        style={{ backgroundImage: "url('https://template.canva.com/EAGSffnYLDY/1/0/1600w-N7CmXFik4kY.jpg')" }}
                    ></div>
                    <div className="home_background-item"
                        style={{ backgroundImage: "url('https://template.canva.com/EAFWISeesDo/2/0/1600w-1QmT0v_Fh4k.jpg')" }}
                    ></div>

                    <button className="btn-slide prev" id="prev"><FaChevronLeft /> </button>
                    <button className="btn-slide next" id="next"> <FaChevronRight /> </button>
                </div>

                {/* Sản phẩm mới */}
                <div className="home_sale container-fluid">
                    <a href="#">
                        <p className="home_sale-title my-4 text-center text-dark">Sản phẩm bán chạy</p>
                    </a>

                    <div className="row">
                        {/* Ảnh lớn */}
                        <div className="col-sm-12 col-md-6">
                            <a href="/category">
                                <img
                                    className="sale-img"
                                    src="https://img.mwc.com.vn/giay-thoi-trang?w=1150&h=1550&FileInput=/Resources/Silde/2024/12/25/IMG_5218.JPG"
                                    alt="Sản phẩm bán chạy"
                                />
                            </a>
                        </div>

                        {/* Các sản phẩm nhỏ */}
                        <div className="col-sm-6 col-md-3">
                            <ProductCard {...productx[0]} />
                            <div className="mt-4">
                                <ProductCard {...productx[1]} />
                            </div>
                        </div>

                        <div className="col-sm-6 col-md-3">
                            <ProductCard {...productx[2]} />
                            <div className="mt-4">
                                <ProductCard {...productx[3]} />
                            </div>
                        </div>
                    </div>

                    <a href="#">
                        <p
                            className="home_sale-title my-4 p-0 text-center text-dark"
                            style={{ fontSize: "18px", textDecoration: "underline" }}
                        >
                            XEM TẤT CẢ
                        </p>
                    </a>
                    <hr className="hr" />
                </div>

                <ItemList title="Giày cao gót nữ" items={caoGotNu} />
                {/* <ItemList title="Dép và Sandal nữ" items={SandalNu} />
                <ItemList title="Balo Thời TRang" items={Balo} /> */}
                <ItemList title="Loafer" items={giayLuoi} />
                <ItemList title="giày thể thao" items={GiayNam} />
                {/* <ItemList title="Thời trang" items={thoiTrang} /> */}

            </div>
            <HotLine />
            <Footer />

        </>
    );
};

export default Home;