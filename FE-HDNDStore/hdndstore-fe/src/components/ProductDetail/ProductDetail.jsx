import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import "../../styles/cart/ProductDetail.css";
import { FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import Slider from "react-slick";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Hotline from "../layout/Hotline";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const ChiTietSanPham = ({ product }) => {
    const [mainImage, setMainImage] = useState(product?.image || "/src/images/giaynam/MWC 5705_3.jpg");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isShowroomOpen, setIsShowroomOpen] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [districts, setDistricts] = useState([]);
    const [isModalOpenGioHang, setIsModalOpenGioHang] = useState(false);

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
        const userId = localStorage.getItem("userId"); // Giả sử userId được lưu khi đăng nhập
        if (userId) {
            const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};
            setCart(storedCarts[userId] || []); // Cập nhật giỏ hàng của user hiện tại
        }
    }, []); // Chạy một lần khi trang load



    if (!selectedProduct) {
        return <p className="text-center">Không tìm thấy sản phẩm!</p>;
    }

    // Danh sách ánh xạ từ tên màu sang mã màu HEX
    const colorMap = {
        "bạc": "#C0C0C0",
        "nâu": "#8B4513",
        "trắng": "#e8e8e8",
        "đen": "#000000",
        "đỏ": "#FF0000",
        "xanh": "#0000FF",
        "kem": "#F5F5DC",
        "vàng": "#FFFF00",
        "hồng": "#FFC0CB",
        "xám": "#808080",
    };


    const handleViewCart = () => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Vui lòng đăng nhập để xem giỏ hàng!");
            navigate("/auth"); // Chuyển hướng sang trang cart
            return;
        }
        else {

            // Lưu giỏ hàng của user vào localStorage trước khi chuyển trang
            const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};
            localStorage.setItem("carts", JSON.stringify(storedCarts));

            navigate("/cart"); // Chuyển hướng sang trang cart
        }

    };




    const addToCart = (product) => {
        if (!selectedColor || !selectedSize) {
            alert("Vui lòng chọn màu sắc và kích cỡ!");
            return;
        }

        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
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
            updatedCart[existingItemIndex].quantity += 1;
        } else {
            // Nếu chưa có, thêm sản phẩm mới với số lượng = 1
            updatedCart = [...userCart, {
                ...product,
                id: product._id,
                color: selectedColor,
                size: selectedSize,
                quantity: 1
            }];
        }

        // Cập nhật giỏ hàng vào localStorage
        storedCarts[userId] = updatedCart;
        localStorage.setItem("carts", JSON.stringify(storedCarts));

        // Cập nhật state giỏ hàng
        setCart(updatedCart);

        // Mở modal giỏ hàng
        setIsModalOpenGioHang(true);
    };

    // ✅ Thêm PropTypes để xác nhận product có _id
    addToCart.propTypes = {
        product: PropTypes.shape({
            _id: PropTypes.string.isRequired, // Bắt buộc có _id là string
            name: PropTypes.string.isRequired, // Tên sản phẩm
            price: PropTypes.number.isRequired, // Giá sản phẩm
            image: PropTypes.string, // Hình ảnh (nếu có)
        }).isRequired,
    };



    const addToCart2 = () => {
        if (!selectedColor || !selectedSize) {
            alert("Vui lòng chọn màu sắc và kích cỡ!");
            return;
        }

        // Lấy userId từ localStorage
        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
            return;
        }

        // Lấy danh sách giỏ hàng của tất cả user từ localStorage
        const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};

        // Lấy giỏ hàng của user hiện tại
        const currentCart = storedCarts[userId] || [];

        // Tìm sản phẩm đã tồn tại trong giỏ hàng
        const existingItemIndex = currentCart.findIndex(
            (cartItem) =>
                cartItem.id === selectedProduct.id &&
                cartItem.color === selectedColor &&
                cartItem.size === selectedSize
        );

        if (existingItemIndex !== -1) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng lên 1
            currentCart[existingItemIndex].quantity += 1;
        } else {
            // Nếu chưa có, thêm sản phẩm mới với số lượng là 1
            currentCart.push({
                ...selectedProduct,
                color: selectedColor,
                size: selectedSize,
                quantity: 1,
            });
        }

        // Cập nhật giỏ hàng của user vào object `carts`
        storedCarts[userId] = currentCart;

        // Lưu lại toàn bộ danh sách giỏ hàng vào localStorage
        localStorage.setItem("carts", JSON.stringify(storedCarts));

        // Cập nhật state giỏ hàng của user hiện tại
        setCart(currentCart);

        // Chuyển hướng sang trang giỏ hàng
        navigate("/cart");
    };




    const images = [
        "/src/images/giaynam/MWC 5705_1.jpg",
        "/src/images/giaynam/MWC 5705_2.jpg",
        "/src/images/giaynam/MWC 5705_3.jpg",
        "/src/images/giaynam/MWC 5705_4.jpg",
        "/src/images/giaynam/MWC 5705_5.jpg",
        "/src/images/giaynam/MWC 5705_6.jpg"
    ];
    const districtData = {
        hanoi: ["Ba Đình", "Hoàn Kiếm", "Cầu Giấy", "Đống Đa"],
        hcm: ["Quận 1", "Quận 3", "Quận 7", "Thủ Đức"],
        danang: ["Hải Châu", "Thanh Khê", "Liên Chiểu", "Ngũ Hành Sơn"]
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
            statusClass: "ket-qua-tinh-trang-con-hang"
        },
        {
            address: "456 Lê Duẩn, Quận Hai Bà Trưng, Hà Nội",
            status: "Còn hàng",
            statusClass: "ket-qua-tinh-trang-con-hang"
        },
        {
            address: "789 Nguyễn Văn Linh, Quận Liên Chiểu, Đà Nẵng",
            status: "Sắp hết hàng",
            statusClass: "ket-qua-tinh-trang-het-hang"
        }
    ];

    //Lợi ích khi mua hàng
    const benefits = [
        { img: "/src/images/loi-ich-1.jpg", text: "Bảo hành keo vĩnh viễn, trọn đời" },
        { img: "/src/images/loi-ich-2.jpg", text: "Miễn phí vận chuyển toàn quốc cho đơn hàng từ 150k" },
        { img: "/src/images/loi-ich-3.jpg", text: "Đổi trả dễ dàng (trong vòng 7 ngày nếu lỗi nhà sản xuất)" },
        { img: "/src/images/loi-ich-4.jpg", text: "Hotline 1900.633.349 hỗ trợ từ 8h30-21h30" },
        { img: "/src/images/loi-ich-5.jpg", text: "Giao hàng tận nơi, nhận hàng xong thanh toán" },
        { img: "/src/images/loi-ich-6.jpg", text: "Ưu đãi tích điểm và hưởng quyền lợi thành viên từ MWC" }
    ];

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };
    //DSSP có thể bạn cũng thích

    const products = [
        {
            id: 1,
            image: "/src/images/giaynam/MWC 5705_1.jpg",
            name: "Giày Thể Thao Nam MWC 5705",
            price: "295,000₫",
        },
        {
            id: 2,
            image: "/src/images/giaynam/MWC 5705_2.jpg",
            name: "Giày Thể Thao Nam MWC 5705",
            price: "295,000₫",
        },
        {
            id: 3,
            image: "/src/images/giaynam/MWC 5705_3.jpg",
            name: "Giày Thể Thao Nam MWC 5705",
            price: "295,000₫",
        },
        {
            id: 4,
            image: "/src/images/giaynam/MWC 5705_4.jpg",
            name: "Giày Thể Thao Nam MWC 5705",
            price: "295,000₫",
        },
    ];
  


    return (
        <div >
            <Header />

            <div className="container">
                <div className="container-san-pham">
                    <div className="breadcum">
                        <a href="/home">Trang chủ</a> <span className="delimiter"></span>
                        <span> | </span>
                        <a href="/category">{selectedProduct.category}</a> <span className="delimiter"></span>
                        <span> | </span>
                        <span className="present">{selectedProduct.name}</span>
                    </div>

                    <div className="container-hinh-san-pham">
                        <div className="hinh-san-pham">
                            <div className="hinh-main">
                                <img className="main-image" src={mainImage} alt={selectedProduct.name} />
                            </div>
                            <div className="thum-san-pham">
                                <div className="slide-container-chi-tiet">
                                    <Slider {...settings}>
                                        {selectedProduct.imagethum?.map((img, index) => (
                                            <div key={index} className="card-small" onClick={() => setMainImage(img)}>
                                                <div className="image-box-small">
                                                    <img src={img} alt="Giày Nam" />
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </div>

                        </div>

                        <div className="thong-tin-san-pham">
                            <h2 className="main-name">{selectedProduct.name}</h2>
                            <div className="review-sanpham">
                                <img src="/src/images/danh-gia-sp.png" alt="Đánh giá" />
                                <span>12 đánh giá - 987 lượt thích</span>
                            </div>
                            <div className="gia-san-pham">
                                <span className="gia-cu"> {selectedProduct.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                                <p className="phi-vat">(Đã bao gồm phí VAT)</p>
                            </div>

                            <div className="mau-sac-san-pham">
                                <span className="mau-sac">Màu sắc</span>
                                <div className="so-mau-sac">
                                    {[
                                        ...new Set(selectedProduct.variants?.map(variant => variant.color)) // Lấy danh sách màu không trùng lặp
                                    ].map((color, index) => {
                                        const backgroundColor = colorMap[color.toLowerCase()] || color; // Chuyển tên màu thành mã HEX nếu có
                                        return (
                                            <span
                                                key={index}
                                                style={{ backgroundColor }}
                                                className={`mau-sac-item ${selectedColor === color ? "selected" : ""}`}
                                                title={`Màu ${color}`}
                                                onClick={() => setSelectedColor(color)}
                                            ></span>
                                        );
                                    })}
                                </div>

                            </div>
                           

                            {/* Kích thước sản phẩm */}
                            <div className="kich-thuoc-san-pham">
                                <span className="kich-thuoc">Kích thước</span>
                                <div className="so-kich-thuoc">
                                    {[
                                        ...new Set(
                                            selectedProduct.variants
                                                ?.filter(variant => variant.color === selectedColor) // Chỉ lấy size theo màu đã chọn
                                                .map(variant => variant.size)
                                        ),
                                    ].map((size, index) => {
                                        // Tìm variant theo color + size
                                        const matchedVariant = selectedProduct.variants.find(
                                            (v) => v.color === selectedColor && v.size === size
                                        );
                                        const isOutOfStock = !matchedVariant || Number(matchedVariant.stock) <= 0;
                                        console.log("Matched Variant:", matchedVariant);
                                        console.log("stock:", matchedVariant?.stock);
                                        return (
                                            <span
                                                key={index}
                                                className={`kich-thuoc-item ${selectedSize === size ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
                                                title={isOutOfStock ? "Hết hàng" : `Size ${size}`}
                                                onClick={!isOutOfStock ? () => setSelectedSize(size) : undefined}
                                                style={{
                                                    backgroundColor: isOutOfStock ? "#e0e0e0" : "#fff",
                                                    color: isOutOfStock ? "#888" : "#000",
                                                    cursor: isOutOfStock ? "not-allowed" : "pointer",
                                                    border: selectedSize === size ? "2px solid #007bff" : "1px solid #ccc",
                                                    padding: "6px 12px",
                                                    borderRadius: "4px",
                                                    margin: "4px",
                                                    display: "inline-block",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {size}
                                            </span>

                                        );
                                    })}
                                </div>
                            </div>



                            {/* Hướng dẫn chọn size */}
                            <div className="huong-dan-chon-size">
                                <button className="chon-size" onClick={() => {
                                    console.log("Mở modal");
                                    setIsModalOpen(true);
                                }}>
                                    Hướng dẫn tính size
                                </button>

                            </div>

                            {/* Modal hướng dẫn chọn size */}
                            {console.log("Modal State:", isModalOpen)}
                            {isModalOpen && (
                                <div
                                    id="modalSizeGuide"
                                    className="modal"
                                    onClick={() => {
                                        console.log("Click ra ngoài, đóng modal");
                                        setIsModalOpen(false);
                                    }}
                                >
                                    <div
                                        className="modal-content"
                                        onClick={(e) => e.stopPropagation()} // Ngăn không cho sự kiện click lan ra ngoài
                                    >
                                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                                        <h2>Hướng dẫn tính size</h2>
                                        <div className="huong-dan">
                                            <img src="/src/images/giaynam/tinh-size-1.jpg" alt="Hướng dẫn chọn size" />
                                            <h2>01. Vẽ khung bàn chân</h2>
                                            <p>Đặt bàn chân lên tờ giấy trắng, dùng bút đánh dấu theo khung bàn chân trên giấy</p>

                                            <img src="/src/images/giaynam/tinh-size-2.jpg" alt="Hướng dẫn chọn size" />
                                            <h2>02. Đo chiều dài bàn chân</h2>
                                            <p>Dùng thước đo chiều dài lớn nhất từ mũi chân đến gót chân trên khung bàn chân đã đánh dấu</p>

                                            <img src="/src/images/giaynam/tinh-size-3.jpg" alt="Hướng dẫn chọn size" />
                                            <h2>03. Đo độ rộng vòng chân</h2>
                                            <p>Lấy thước dây quấn quanh 1 vòng bàn chân từ khớp ngón chân cái đến khớp ngón chân út</p>

                                            <table className="size-table">
                                                <thead>
                                                    <tr>
                                                        <th>Size</th>
                                                        <th>Độ rộng (cm)</th>
                                                        <th>Độ dài (cm)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[{ size: 35, width: 20.7, length: 23.1 },
                                                    { size: 36, width: 21.1, length: 23.8 },
                                                    { size: 37, width: 21.6, length: 24.5 },
                                                    { size: 38, width: 22.1, length: 25.2 },
                                                    { size: 39, width: 22.6, length: 25.8 }].map((item) => (
                                                        <tr key={item.size}>
                                                            <td>{item.size}</td>
                                                            <td>{item.width}</td>
                                                            <td>{item.length}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <button className="dong-modal" onClick={() => setIsModalOpen(false)}>Đóng</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <br />
                            {/* Button mở modal tìm showroom */}
                            <span className="btn-tim-san-pham" onClick={() => setIsShowroomOpen(true)}>
                                <FaMapMarkerAlt className="location" />
                                TÌM SẢN PHẨM TẠI SHOWROOM</span>

                            {/* Modal hướng dẫn chọn size */}
                            {isSizeGuideOpen && (
                                <div className="modal" onClick={() => setIsSizeGuideOpen(false)}>
                                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                        <span className="close" onClick={() => setIsSizeGuideOpen(false)}>&times;</span>
                                        <h2>Hướng dẫn tính size</h2>
                                        <p>Đặt bàn chân lên tờ giấy trắng, dùng bút đánh dấu theo khung bàn chân trên giấy.</p>
                                        <button onClick={() => setIsSizeGuideOpen(false)}>Đóng</button>
                                    </div>
                                </div>
                            )}

                            {/* Modal tìm sản phẩm tại showroom */}
                            {isShowroomOpen && (
                                <div className="modal" onClick={() => setIsShowroomOpen(false)}>
                                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                        <span className="close" onClick={() => setIsShowroomOpen(false)}>&times;</span>
                                        <h2>TÌM SẢN PHẨM TẠI SHOWROOM</h2>
                                        <div className="thong-tin-san-pham-da-chon">
                                            <div className="hinh-san-pham-da-chon">
                                                <img src={selectedProduct.image} alt={selectedProduct.name} />
                                            </div>
                                            <div className="thong-tin-san-pham-chi-tiet">
                                                <div className="ten-giatien">
                                                    <span className="main-name-da-chon">{selectedProduct.name}</span>
                                                    <span className="gia-san-pham-da-chon">
                                                        {selectedProduct.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                                    </span>
                                                </div>

                                                <div className="mau-sac-san-pham">
                                                    <span className="mau-sac">Màu sắc</span>
                                                    <div className="so-mau-sac">
                                                        {[
                                                            ...new Set(selectedProduct.variants?.map(variant => variant.color)) // Lấy danh sách màu không trùng lặp
                                                        ].map((color, index) => {
                                                            const backgroundColor = colorMap[color.toLowerCase()] || color; // Chuyển tên màu thành mã HEX nếu có
                                                            return (
                                                                <span
                                                                    key={index}
                                                                    style={{ backgroundColor }}
                                                                    className={`mau-sac-item ${selectedColor === color ? "selected" : ""}`}
                                                                    title={`Màu ${color}`}
                                                                    onClick={() => setSelectedColor(color)}
                                                                ></span>
                                                            );
                                                        })}
                                                    </div>

                                                </div>


                                                {/* Kích thước sản phẩm */}
                                                <div className="kich-thuoc-san-pham">
                                                    <span className="kich-thuoc">Kích thước</span>
                                                    <div className="so-kich-thuoc">
                                                        {[
                                                            ...new Set(selectedProduct.variants?.map(variant => variant.size)) // Lấy danh sách size không trùng lặp
                                                        ].map((size, index) => (
                                                            <span
                                                                key={index}
                                                                className={selectedSize === size.toString() ? "selected" : ""}
                                                                onClick={() => setSelectedSize(size.toString())}
                                                            >
                                                                {size}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                            </div>



                                        </div>


                                        <div className="form-group">
                                            <label htmlFor="province">Tỉnh/Thành phố:</label>
                                            <select id="province" onChange={handleProvinceChange}>
                                                <option value="">Chọn tỉnh/thành phố</option>
                                                <option value="hanoi">Hà Nội</option>
                                                <option value="hcm">Hồ Chí Minh</option>
                                                <option value="danang">Đà Nẵng</option>
                                            </select>

                                            <label htmlFor="district">Quận/Huyện:</label>
                                            <select id="district" disabled={!selectedProvince}>
                                                <option value="">Chọn quận/huyện</option>
                                                {districts.map((district, index) => (
                                                    <option key={index} value={district.toLowerCase()}>{district}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="thoi-gian-hoat-dong">
                                            <span>Thời gian hoạt động</span>
                                            <span>- Thứ 2 đến thứ 6: 8h30 - 22h</span>
                                            <span>- Thứ 7, chủ nhật: 8h - 22h30</span>
                                        </div>
                                        <br />
                                        <div className="dia-chi-cua-hang">
                                            {storeLocations.map((store, index) => (
                                                <div key={index} className="dia-chi-item">
                                                    <span className="dia-chi">{store.address}</span>
                                                    <div className="tinh-trang-cua-hang">
                                                        <span className="tinh-trang">Tình trạng: </span>
                                                        <span className={store.statusClass}>{store.status}</span>
                                                    </div>
                                                    <br />
                                                </div>
                                            ))}
                                        </div>

                                        <button className="dong-modal" onClick={() => setIsShowroomOpen(false)}>Đóng</button>
                                    </div>
                                </div>
                            )}
                            <div className="mua">
                                <div className="btn-mua-ngay">
                                    <a href="#" onClick={() => {
                                        addToCart2();

                                    }} >MUA NGAY</a>
                                </div>
                                <div className="btn-them-vao-gio-hang">
                                    <a href="#" id="addToCartBtn" onClick={() => {
                                        addToCart(selectedProduct);

                                    }}>
                                        <FaShoppingCart style={{ marginRight: "5px" }} />
                                        THÊM VÀO GIỎ HÀNG
                                    </a>
                                </div>
                                {/* Modal Giỏ Hàng */}
                                {isModalOpenGioHang && (
                                    <div className="modal-overlaygiohang" onClick={() => setIsModalOpenGioHang(false)}>
                                        <div className="modal-contentgiohang" onClick={(e) => e.stopPropagation()}>
                                            <span className="close" onClick={() => setIsModalOpenGioHang(false)}>
                                                &times;
                                            </span>
                                            <h2>Giỏ hàng</h2>
                                            <div className="cart-scroll-container">
                                                {cart.length > 0 ? (
                                                    cart.map((item, index) => (
                                                        <div key={index} className="product-info">
                                                            <div className="img-chi-tiet">
                                                                <img src={item.image} alt={item.name} />
                                                            </div>
                                                            <div className="details">
                                                                <span>{item.name}</span>
                                                                <p>Kích cỡ: {item.size}</p>
                                                                <p>Màu sắc: {item.color}</p>
                                                                <p>
                                                                    <span className="so-luong-da-chon">{item.quantity} </span>  X {item.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                                                </p>
                                                            </div>

                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>Giỏ hàng của bạn đang trống!</p>
                                                )}
                                            </div>
                                            <div className="total">
                                                <hr />
                                                <p><strong>Tổng cộng: {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</strong></p>
                                            </div>
                                            <a onClick={handleViewCart} className="btn-add-to-cart">Xem giỏ hàng</a>
                                        </div>
                                    </div>
                                )}

                            </div>
                            <br /><br /><br />

                            <div>
                                {/* Chia lợi ích thành 2 nhóm */}
                                {[0, 3].map((startIndex, index) => (
                                    <div key={index} className="loi-ich-mua-hang">
                                        {benefits.slice(startIndex, startIndex + 3).map((benefit, i) => (
                                            <div key={i} className="loi-ich-1">
                                                <img src={benefit.img} alt="" />
                                                <span>{benefit.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <br />
                            <hr />



                        </div>


                    </div>
                    <div className="chi-tiet-san-pham">
                        <table className="size-table-chi-tiet">
                            <thead>
                                <tr>
                                    <th>CHI TIẾT SẢN PHẨM</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="mo-ta">
                                            <h4>
                                                MÔ TẢ SẢN PHẨM: Dép Nam MWC 7860 - Dép Da Nam Cao Cấp, Dép Nam Quai Ngang Chữ H
                                                Thời Trang, Cá Tính Năng Động, Trẻ Trung.
                                            </h4>

                                            <ul>
                                                <li>
                                                    Dép nam thiết kế kiểu dáng quai ngang chữ H cá tính, thời trang, dép được làm
                                                    bằng chất liệu da tổng hợp cao cấp nên có độ bền cao.
                                                </li>
                                                <li>
                                                    Dép có trọng lượng nhẹ, tạo sự thoải mái cho đôi chân hơn nữa nó còn mang đến
                                                    những gam màu hiện đại, trẻ trung dễ dàng phối với nhiều trang phục khác nhau từ
                                                    âu tới jeans hay sooc,... đều rất hợp thời trang.
                                                </li>
                                                <li>
                                                    Dép nam quai ngang chữ H thực sự là lựa chọn lý tưởng cho phong cách năng động,
                                                    trẻ trung, tràn đầy sức sống, dép phù hợp mang đi chơi, đi phố, đi trong nhà,
                                                    văn phòng,...
                                                </li>
                                            </ul>

                                            <h4>CHI TIẾT SẢN PHẨM</h4>
                                            <ul>
                                                <li>Chiều cao: Khoảng 2cm</li>
                                                <li>Kiểu dáng: Dép nam đế bằng, dép da nam cao cấp</li>
                                                <li>Chất liệu: Da tổng hợp cao cấp</li>
                                                <li>Đế: PU xẻ rãnh chống trơn trượt</li>
                                                <li>Màu sắc: Xám - Đen - Nâu - Full đen</li>
                                                <li>Size: 39 - 40- 41 - 42 - 43</li>
                                                <li>Xuất xứ: Việt Nam</li>
                                                <li>
                                                    <strong>Chú ý:</strong> Kích thước so sánh một cách cẩn thận, vui lòng cho phép
                                                    sai số 1-3 cm do đo lường thủ công.
                                                </li>
                                                <li>
                                                    Do màn hình hiển thị khác nhau và ánh sáng khác nhau, hình ảnh có thể chênh
                                                    lệch 5-10% màu sắc thật của sản phẩm.
                                                </li>
                                                <li>Cảm ơn bạn đã thông cảm.</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="co-the-ban-cung-thich">

                        <span>CÓ THỂ BẠN CŨNG THÍCH</span>
                        <br /><br />
                        <div className="co-the-ban-cung-thich-item">
                            {products.map((selectedProduct) => (

                                <div key={selectedProduct.id} className="card-sp">
                                    <div className="image-box">
                                        <img src={selectedProduct.image} alt={selectedProduct.name} />
                                    </div>
                                    <div className="thong-tin-san-pham-xem-them">
                                        <span className="ten-san-pham">{selectedProduct.name}</span>
                                        <span className="gia-san-pham">
                                            295.000 đ
                                        </span>



                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <br /><br /><hr />

                </div>
                
            </div>

            <Hotline />
            <Footer />
        </div>
    );
};

const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                width: "25px",
                height: "25px",
                right: "-40px",
                zIndex: 10,
            }}
            onClick={onClick}
        >

        </div>
    );
};

const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                width: "25px",
                height: "25px",
                left: "-40px",
                zIndex: 10,
                top: "50%"
            }}
            onClick={onClick}
        >

        </div>
    );
};
// 🛠 Thêm PropTypes để fix lỗi ESLint
SampleNextArrow.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
};

SamplePrevArrow.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
};


export default ChiTietSanPham;
