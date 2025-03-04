import { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/cart/ProductDetail.css";
import { FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import Slider from "react-slick";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const ChiTietSanPham = () => {
    const [mainImage, setMainImage] = useState("/src/images/giaynam/MWC 5705_3.jpg");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#F5F5DC");
    const [selectedSize, setSelectedSize] = useState("37");
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isShowroomOpen, setIsShowroomOpen] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [districts, setDistricts] = useState([]);
    const [isModalOpenGioHang, setIsModalOpenGioHang] = useState(false);



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
                        <a href="/chi-tiet-san-pham">Dép Nam</a> <span className="delimiter"></span>
                        <span> | </span>
                        <span className="present">Giày Nam MWC 5705</span>
                    </div>

                    <div className="container-hinh-san-pham">
                        <div className="hinh-san-pham">
                            <div className="hinh-main">
                                <img className="main-image" src={mainImage} alt="Giày Nam" />
                            </div>
                            <div className="thum-san-pham">
                                <div className="slide-container-chi-tiet">
                                    <Slider {...settings}>
                                        {images.map((img, index) => (
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
                            <h2 className="main-name">Giày Thể Thao Nam MWC 5705 - Giày Sneaker Cổ Thấp</h2>
                            <div className="review-sanpham">
                                <img src="/src/images/danh-gia-sp.png" alt="Đánh giá" />
                                <span>12 đánh giá - 987 lượt thích</span>
                            </div>
                            <div className="gia-san-pham">
                                <span className="gia-cu">295,000₫</span>
                                <p className="phi-vat">(Đã bao gồm phí VAT)</p>
                            </div>

                            <div className="mau-sac-san-pham">
                                <span className="mau-sac">Màu sắc</span>
                                <div className="so-mau-sac">
                                    <span
                                        style={{ backgroundColor: "#F5F5DC" }}
                                        className={`mau-sac-item ${selectedColor === "#F5F5DC" ? "selected" : ""}`}
                                        title="Màu Be"
                                        onClick={() => setSelectedColor("#F5F5DC")}
                                    ></span>
                                    <span
                                        style={{ backgroundColor: "black" }}
                                        className={`mau-sac-item ${selectedColor === "black" ? "selected" : ""}`}
                                        title="Màu đen"
                                        onClick={() => setSelectedColor("black")}
                                    ></span>
                                </div>
                            </div>

                            {/* Kích thước sản phẩm */}
                            <div className="kich-thuoc-san-pham">
                                <span className="kich-thuoc">Kích thước</span>
                                <div className="so-kich-thuoc">
                                    {[37, 38, 39, 40, 41, 42, 43].map((size) => (
                                        <span
                                            key={size}
                                            className={selectedSize === size.toString() ? "selected" : ""}
                                            onClick={() => setSelectedSize(size.toString())}
                                        >
                                            {size}
                                        </span>
                                    ))}
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
                                                <img src="/src/images/giaynam/MWC 5705_4.jpg" alt="Sản phẩm" />
                                            </div>
                                            <div className="thong-tin-san-pham-chi-tiet">
                                                <div className="ten-giatien">
                                                    <span className="main-name-da-chon">Giày Thể Thao Nam MWC 5705</span>
                                                    <span className="gia-san-pham-da-chon">295,000₫</span>
                                                </div>

                                                <div className="mau-sac-san-pham">

                                                    <div className="so-mau-sac">
                                                        <span
                                                            style={{ backgroundColor: "#F5F5DC" }}
                                                            className={`mau-sac-item ${selectedColor === "#F5F5DC" ? "selected" : ""}`}
                                                            title="Màu Be"
                                                            onClick={() => setSelectedColor("#F5F5DC")}
                                                        ></span>
                                                        <span
                                                            style={{ backgroundColor: "black" }}
                                                            className={`mau-sac-item ${selectedColor === "black" ? "selected" : ""}`}
                                                            title="Màu đen"
                                                            onClick={() => setSelectedColor("black")}
                                                        ></span>
                                                    </div>
                                                </div>

                                                {/* Kích thước sản phẩm */}
                                                <div className="kich-thuoc-san-pham">

                                                    <div className="so-kich-thuoc">
                                                        {[37, 38, 39, 40, 41, 42, 43].map((size) => (
                                                            <span
                                                                key={size}
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
                                    <a href="./cart">MUA NGAY</a>
                                </div>
                                <div className="btn-them-vao-gio-hang">
                                    <a href="#" id="addToCartBtn" onClick={() => setIsModalOpenGioHang(true)}>
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
                                            <div className="product-info">
                                                <div className="img-chi-tiet">
                                                    <img src="/src/images/giaynam/MWC 5705_3.jpg" alt="Product Image" />
                                                </div>
                                                <div className="details">
                                                    <span>Giày Thể Thao Nam MWC 5705 - Giày Thể Thao Nam Dáng Sneaker Cổ Thấp</span>
                                                    <p>Kích cỡ: 38</p>
                                                    <p>Màu sắc: Be</p>
                                                    <p>Giá: 500,000 VNĐ</p>
                                                </div>
                                            </div>
                                            <div className="so-luong-sp-gio-hang">
                                                <label>Số lượng:</label>
                                                <input type="number" min="1" defaultValue="1" />
                                            </div>
                                            <div className="total">
                                                <hr />
                                                <p><strong>Tổng cộng: 500,000 VNĐ</strong></p>
                                            </div>
                                            <a href="./cart" className="btn-add-to-cart">Xem giỏ hàng</a>
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
                            {products.map((product) => (
                                <div key={product.id} className="card">
                                    <div className="image-box">
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className="thong-tin-san-pham-xem-them">
                                        <span className="ten-san-pham">{product.name}</span>
                                        <span className="gia-san-pham">{product.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <br /><br /><hr />

                    <div className="thong-tin-lien-he">
                        {/* Thông tin liên hệ */}
                        <div className="thong-tin-lien-he-item">
                            <p className="thong-tin-lien-he-item-1">
                                GỌI MUA HÀNG ONLINE (08:00 - 21:00 mỗi ngày)
                            </p>
                            <p className="thong-tin-lien-he-item-2">1900.633.349</p>
                            <p className="thong-tin-lien-he-item-3">
                                Tất cả các ngày trong tuần (Trừ tết Âm Lịch)
                            </p>
                            <br />
                            <p className="thong-tin-lien-he-item-1">GÓP Ý & KHIẾU NẠI (08:30 - 20:30)</p>
                            <p className="thong-tin-lien-he-item-2">1900.633.349</p>
                            <p className="thong-tin-lien-he-item-3">
                                Tất cả các ngày trong tuần (Trừ tết Âm Lịch)
                            </p>
                        </div>

                        {/* Thông tin */}
                        <div className="thong-tin-lien-he-item-tt">
                            <p className="thong-tin-lien-he-item-1">THÔNG TIN</p>
                            <ul>
                                <li><a href="#">Giới thiệu về MWC</a></li>
                                <li><a href="#">Thông tin Website thương mại điện tử</a></li>
                                <li><a href="#">Than Phiền Góp Ý</a></li>
                                <li><a href="#">Chính sách và quy định</a></li>
                            </ul>
                        </div>

                        {/* FAQ */}
                        <div className="thong-tin-lien-he-item-faq">
                            <p className="thong-tin-lien-he-item-1">FAQ</p>
                            <ul>
                                <li><a href="#">Vận chuyển</a></li>
                                <li><a href="#">Chính sách đổi trả</a></li>
                                <li><a href="#">Chính sách đổi trả bảo hành</a></li>
                            </ul>
                            <div className="logo-truyen-thong">
                                <img
                                    style={{ marginLeft: "-15px", marginTop: "10px", height: "45px" }}
                                    src="/src/images/logo-truyen-thong.png"
                                    alt="Logo Truyền Thông"
                                />
                            </div>
                        </div>
                    </div>
               


                </div>


            </div>


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
