import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HotLine from "../components/layout/Hotline.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/profile/Home.css";
import "../script.js";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useEffect } from "react";

const products = [
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

const ProductCard = ({ img, title, price }) => {
    return (
        <div className="product-card m-0 card p-0">
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

const giayCaoGotNu = [
    {
        id: 1,
        name: "Giày Cao Gót Nữ MWC G161 - Giày Cao Gót Quai Mảnh Đính Đá Sang Chảnh, Giày Cao Gót Đế Nhọn Cao 11cm, Mũi Vuông Phong Cách Sành Điệu, Thời Trang.",
        price: "275.000đ",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/13/z6220378285399_c12f0b2aa29b067901a90cc03d1b14b9.jpg",
    },
    {
        id: 2,
        name: "Giày Cao Gót Nữ MWC G164 - Giày Cao Gót Quai Mảnh Đính Đá Sang Chảnh, Giày Cao Gót Đế Nhọn Cao 11cm, Mũi Vuông Phong Cách Sành Điệu, Thời Trang.",
        price: "295.000đ",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/01/z6185919858955_2b00d999af4b1e163704045bd65c3025.jpg",
    },
    {
        id: 3,
        name: "Giày Cao Gót Nữ MWC G105 - Giày Cao Gót Quai Mảnh Đính Đá Sang Chảnh, Giày Cao Gót Đế Nhọn Cao 11cm, Mũi Vuông Phong Cách Sành Điệu, Thời Trang.",
        price: "275.000đ",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/12/z6218099513656_8211b7dddbc5ec5ef3508888382aecc2.jpg",
    },
    {
        id: 4,
        name: "Giày Cao Gót Nữ MWC G174 - Giày Cao Gót Quai Mảnh Đính Đá Sang Chảnh, Giày Cao Gót Đế Nhọn Cao 11cm, Mũi Vuông Phong Cách Sành Điệu, Thời Trang.",
        price: "180.000đ",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/13/z6220373137274_91eea60908b7b8b14ada20b6fc4d6a0d.jpg",
    },
];

const sandal = [
    {
        id: 1,
        name: "Dép Nữ MWC 8515 - Dép Xỏ Ngón Nữ Đi Học, Đi Làm, Đi Chơi Siêu Bền Đẹp, Dép Đế Cao Quai Mảnh Ngang Chéo Thanh Lịch, Thời Trang.",
        price: "250.000đ",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/13/z6223159839690_de0e855848b2ec2f4689480387c8a54f.jpg"
    },
    {
        id: 2,
        name: "Dép Nữ MWC 8518 - Dép Nữ Quai Da Mềm Siêu Êm Nhẹ, Dép Nữ Đế Bằng Đúc Nguyên Khối Đẹp, Hottrend Thời Trang.",
        price: "250.000đ",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/13/z6222873569065_52abab2bf1f5f139531cd1a79bf828e1.jpg"
    },
    {
        id: 3,
        name: "Giày Sandal Nữ MWC E159 - Giày Sandal Nữ 2 Quai Ngang Dán Lót Cài Siêu Bền Đẹp, Sandal Nữ Đế Bánh Mì Hack Dáng Hotrend Thời Trang.",
        price: "250.000đ",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/13/z6223362236442_555876b206a375136497a3cabc1c6a8c.jpg"
    },
    {
        id: 4,
        name: "Giày Sandal Nữ MWC E161 - Sandal Nữ Phối Nơ Xinh Xắn Đi Học, Đi Chơi Siêu Bền Đẹp, Sandal Nữ Đế Đúc Nguyên Khối Thanh Lịch, Thời Trang.",
        price: "250.000đ",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/12/z6217529144027_ae6dff2ef0f5dce042583f95a19d3642.jpg"
    }
];

const balo = [
    {
        id: 1,
        name: "BALO MWC 1170 - Balo Unisex Thời Trang Chống Sốc, Chống Nước, Nhiều Ngăn Siêu Tiện Lợi Dùng Đựng Laptop, Mang Đi Học, Đi Chơi",
        price: "195.000đ",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/08/23/batch_z5757937583045_7ef9e3b8d900e32c3952edd2300bdb64.jpg"
    },
    {
        id: 2,
        name: "BALO MWC 1220 - Balo Unisex Thời Trang Chống Sốc, Chống Nước, Nhiều Ngăn Siêu Tiện Lợi Dùng Đựng Laptop, Mang Đi Học, Đi Chơi.",
        price: "275.000đ",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/09/26/batch-z5868397268538-1964ac528fe8e7f1c484b526bd8b623a34c45e65-04e4-4ec5-8f4e-aacdd6dce779.jpg"
    },
    {
        id: 3,
        name: "BALO MWC 1225 - Balo Unisex Thời Trang Chống Sốc, Chống Nước, Nhiều Ngăn Siêu Tiện Lợi Dùng Đựng Laptop, Mang Đi Học, Đi Chơi.",
        price: "195.000đ",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/04/08/z5327955819021_b81db9eead06487aa7eb7c7e6c5b54ac.jpg"
    },
    {
        id: 4,
        name: "BALO MWC 1232 - Balo Unisex Thời Trang Chống Sốc, Chống Nước, Nhiều Ngăn Siêu Tiện Lợi Dùng Đựng Laptop, Mang Đi Học, Đi Chơi.",
        price: "275.000đ",
        image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/08/17/batch_z5739453978691_f81bcc99dc0d15bc121d82e24d7919b9.jpg"
    }
];

const sandalNam = [
    {
      id: 1,
      name: "Giày Sandal Nam MWC 7095",
      description: "Sandal Da Nam Cao Cấp Phối Nút Cài Quai Hậu Siêu Bền Đẹp, Sandal Nam Kiểu Dáng Streetwear Thanh Lịch, Thời Trang.",
      price: 250000,
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/29/z6173990969313_e5824f90486e646d91d2292b3cb5d321.jpg",
      colors: ["black", "gray"]
    },
    {
      id: 2,
      name: "Dép Nam MWC 7909",
      description: "Dép Da Nam Quai Ngang Bản To Siêu Bền Đẹp, Dép Nam Đế Doctor Cá Tính, Thời trang.",
      price: 235000,
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/25/z6159317247789_901e4ddf4024528b9c178a4c298e374b.jpg",
      colors: ["black", "gray"]
    },
    {
      id: 3,
      name: "Giày Sandal Nam MWC 7094",
      description: "Sandal Nam Da Cao Cấp Siêu Bền Đẹp, Sandal Nam Đế Bằng Êm Mềm, Năng Động Trẻ Trung, Thời Trang.",
      price: 250000,
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/08/z6204320424525_6c04eced0175a3a4364b18774d999eaf.jpg",
      colors: ["black"]
    },
    {
      id: 4,
      name: "Dép Nam MWC 7901",
      description: "Dép Nam Quai Ngang Chữ H Thời Trang, Dép Nam Đế Bằng Kiểu Dáng Năng Động,Trẻ Trung.",
      price: 195000,
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/05/z6099275614170_a3d7d21d70edbbe0a6ced139877f3cf1.jpg",
      colors: ["black", "gray"]
    }
];
  
const giayNam = [
    {
      id: 1,
      name: "Giày Thể Thao Nam MWC 5725",
      description: "Giày Thể Thao Nam Đi Học, Đi Chơi, Leo Núi Siêu Bền Đẹp, Năng Động Trẻ Trung, Thời trang.",
      price: 375000,
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/09/22/z5855751664980_b7b60d41a0e3763d075a447d060d8b06.jpg",
      colors: ["black", "white"]
    },
    {
      id: 2,
      name: "Giày Thể Thao Nam MWC 5745",
      description: "Giày Da Thể Thao Nam Dáng Sneaker Cổ Thấp Siêu Bền Đẹp, Giày Thể Thao Nam Đi Học, Đi Chơi, Dã Ngoại Năng Động, Trẻ Trung, Thời Trang.",
      price: 345000,
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2024/12/25/z6159312751250_99c814555a9b9fa7836da69c31d23816.jpg",
      colors: ["white"]
    },
    {
      id: 3,
      name: "Giày Thể Thao Nam MWC 5751",
      description: "Giày Thể Thao Nam Đi Học, Đi Chơi, Leo Núi, Chạy Bộ Siêu Bền Đẹp, Năng Động Trẻ Trung, Thời trang.",
      price: 375000,
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/08/z6204307298836_6961e0fd73dd985b1c0f5cdfc7745d1f.jpg",
      colors: ["black", "gray", "white"]
    },
    {
      id: 4,
      name: "Giày Thể Thao Nam MWC 5752",
      description: "Giày Thể Thao Nam Đi Học, Đi Chơi, Leo Núi, Chạy Bộ Siêu Bền Đẹp, Năng Động Trẻ Trung, Thời trang.",
      price: 375000,
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Product/2025/01/08/z6204310380108_33ae4184f1c49fb816231fdcd6e4d21b.jpg",
      colors: ["black"]
    }
];

const thoiTrang = [
    {
      id: 1,
      title: "Xu Hướng Balo Thời Trang Cho Học Sinh, Sinh Viên",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Post/2024/12/25/z6165278288682_7f1ea8bd61d947473ba1a1bef87cc0ca.jpg",
      link: "https://mwc.com.vn/post/xu-huong-balo-thoi-trang-cho-hoc-sinh-sinh-vien"
    },
    {
      id: 2,
      title: "Những Mẫu Giày Cao Gót Dễ Thương Cho Nàng Diện Tết",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Post/2024/12/25/z6165262626663_3e8f076b733b9507fa43f4a83c48ad89.jpg",
      link: "https://mwc.com.vn/post/nhung-mau-giay-cao-got-de-thuong-cho-nang"
    },
    {
      id: 3,
      title: "Top Các Mẫu Giày Thể Thao Nữ – Phong Cách & Tiện Dụng Cho Mọi Hoạt Động",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Post/2024/11/12/mwc%20(5).jpg",
      link: "https://mwc.com.vn/post/httpsmwccomvncollectionsgiay-thoi-trang"
    },
    {
      id: 4,
      title: "Đón Mùa Lễ Hội Với Giày Búp Bê Lolita – Nàng Đã Sẵn Sàng?",
      image: "https://img.mwc.com.vn/giay-thoi-trang?w=640&h=640&FileInput=/Resources/Post/2024/11/12/mwc%20(4).jpg",
      link: "https://mwc.com.vn/post/httpsmwccomvncollectionsgiay-bup-be-moi"
    }
];
  
const ListItem = ({ name, price, image }) => {
    return (
        <div className="col-sm-3 sale-product">
            <div className="card product-card">
                <a href="#">
                    <img className="card-img-top product-img" src={image} alt={name} />
                    <div className="card-body">
                        <p className="card-title my-1 p-0">{name}</p>
                        <p className="card-price text-center m-0 p-0 fw-bold">{price}</p>
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

// Component ItemList dùng để hiển thị danh sách sản phẩm
const ItemList = ({ title, items }) => {
    return (
        <div className="container-fluid">
            <p className="text-secondary my-5 text-center text-uppercase" style={{ fontSize: 18 }}>{title}</p>
            <div className="row">
                {items.map((item) => (
                    <ListItem key={item.id} {...item} />
                ))}
            </div>
            <a href="#">
                <p className="my-4 p-0 text-center" style={{ fontSize: "18px", textDecoration: "underline" }}>
                    XEM TẤT CẢ
                </p>
            </a>
            <hr className="hr" />
        </div>
    );
};



const Home = () => {

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
                    <div className="home_background-item"
                        style={{ backgroundImage: "url('https://img.mwc.com.vn/giay-thoi-trang?w=1920&h=0&FileInput=/Resources/Silde/2025/03/01/banner%20collection.jpg')" }}
                    ></div>
                    <div className="home_background-item"
                        style={{ backgroundImage: "url('https://img.mwc.com.vn/giay-thoi-trang?w=1920&h=0&FileInput=/Resources/Silde/2025/02/19/banner%20web_TET.jpg')" }}
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
                            <a href="#">
                                <img
                                    className="sale-img"
                                    src="https://img.mwc.com.vn/giay-thoi-trang?w=1150&h=1550&FileInput=/Resources/Silde/2024/12/25/IMG_5218.JPG"
                                    alt="Sản phẩm bán chạy"
                                />
                            </a>
                        </div>

                        {/* Các sản phẩm nhỏ */}
                        <div className="col-sm-6 col-md-3">
                            <ProductCard {...products[0]} />
                            <div className="mt-4">
                                <ProductCard {...products[1]} />
                            </div>
                        </div>

                        <div className="col-sm-6 col-md-3">
                            <ProductCard {...products[2]} />
                            <div className="mt-4">
                                <ProductCard {...products[3]} />
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

                <ItemList title="Giày cao gót nữ" items={giayCaoGotNu} />
                <ItemList title="Dép và Sandal nữnữ" items={sandal} />
                <ItemList title="Balo Thời TRang" items={balo} />
                <ItemList title="Sandal Nam" items={sandalNam} />
                <ItemList title="giày nam" items={giayNam} />
                <ItemList title="Thời trang" items={thoiTrang} />

            </div>
            <HotLine />
            <Footer />

        </>
    );
};

export default Home;