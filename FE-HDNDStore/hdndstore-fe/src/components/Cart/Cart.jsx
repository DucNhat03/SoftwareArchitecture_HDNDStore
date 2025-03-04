import { useState } from "react";
import "../ProductDetail/ProductDetail.css";
import "./Cart.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";




const CartTable = () => {
    const [quantity, setQuantity] = useState(1);
    const price = 500000;

    const handleQuantityChange = (type) => {
        setQuantity((prev) => (type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : prev));
    };

    return (
        <table className="size-table-chi-tiet">
            <thead>
                <tr>
                    <th>Sản Phẩm</th>
                    <th>Đơn Giá</th>
                    <th>Số Lượng</th>
                    <th>Số Tiền</th>
                    <th>Thao Tác</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <div className="san-pham">
                            <img src="/src/images/giaynam/MWC 5705_1.jpg" alt="" />
                            <div className="thong-tin-san-pham">
                                <p>Dép Nam MWC 7860</p>
                                <div className="mau-sac-kich-thuoc">
                                    <span>Màu: xám</span>
                                    <span>, Kích thước: 39</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>{price.toLocaleString()} đ</td>
                    <td>
                        <div className="quantity-wrapper">
                            <button onClick={() => handleQuantityChange("decrease")} className="quantity-btn">-</button>
                            <input type="number" value={quantity} readOnly />
                            <button onClick={() => handleQuantityChange("increase")} className="quantity-btn">+</button>
                        </div>
                    </td>
                    <td className="so-tien-cart">{(price * quantity).toLocaleString()} đ</td>
                    <td><button className="button-edit">Xóa</button></td>
                </tr>
            </tbody>
        </table>
    );
};

const ShippingInfo = ({ receiverInfo, setReceiverInfo }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        setReceiverInfo({ ...receiverInfo, [e.target.name]: e.target.value });
    };

return (
    
    <>
        <div className="uu-dai">
            <div className="coupon">
                <div className="coupon-item">
                    <img src="/src/images/coupon.png" alt="" />
                    <p>Mã Coupon</p>
                    <select id="voucher" name="coupon" className="select-coupon">
                        <option value="" selected >Chọn coupon</option>
                        <option value="1">5%</option>
                        <option value="2">10%</option>
                        <option value="3">15%</option>

                    </select>
                </div>

                <div className="coupon-item">
                    <img src="/src/images/coupon.png" alt="" />
                    <p>Sử dụng điểm (Điểm của bạn: 00)</p>
                    <input type="text" className="input-diem" />
                </div>


            </div>

            <div className="tong-tien-container">
                <div className="tong-tien-hang">
                    <p>Tổng tiền hàng:</p>
                    <p style={{ marginLeft: '300px' }}>500.000 đ</p>
                </div>

                <div className="giam-gia-san-pham">
                    <p>Giảm giá sản phẩm:</p>
                    <p style={{ marginLeft: '305px' }}>-00 đ</p>
                </div>

                <div className="giam-gia-coupon">
                    <p>Giảm giá coupon:</p>
                    <p style={{ marginLeft: '320px' }}>-00 đ</p>
                </div>

                <div className="phi-van-chuyen">
                    <p>Phí vận chuyển:</p>
                    <p style={{ marginLeft: '330px' }}>-00 đ</p>
                </div>

                {/* Để thêm đường kẻ ngang, sử dụng thẻ <hr /> tự đóng */}
                <hr className="short-hr" style={{ width: '500px', marginLeft: 'auto', marginRight: '0' }} />

                <div className="tong-total">
                    <p>Tổng cộng:</p>
                    <p style={{ marginLeft: '330px' }}>500.000 đ</p>
                </div>
            </div>


        </div>


        <div className="thong-tin-van-chuyen">
            <div className="title-van-chuyen">
                <p style={{ fontSize: "18px", color: "red", marginBottom: "20px" }}>THÔNG TIN VẬN CHUYỂN</p>
                <p className="thay-doi" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Hủy" : "Thay đổi thông tin nhận hàng"}
                </p>

                
            </div>
            <div className="dia-chi-nhan-hang">

                {!isEditing ? (
                    <>

                        <form>
                            <div className="form-group">
                                <div className="form-group-item">
                                    <p className="form-group-title">Người nhận: </p>
                                    <br />
                                    <p className="form-group-value">{receiverInfo.name}</p>


                                </div>
                                <br />

                            </div>
                            <div className="form-group">
                                <div className="form-group-item">
                                    <p className="form-group-title">Điện thoại: </p>
                                    <br />
                                    <p className="form-group-value">{receiverInfo.phone}</p>


                                </div>
                                <br />

                            </div>
                            <div className="form-group">
                                <div className="form-group-item">
                                    <p className="form-group-title">Địa chỉ: </p>
                                    <br />
                                    <p className="form-group-value">{receiverInfo.address}</p>


                                </div>
                                <br />

                            </div>

                        </form>



                    </>
                ) : (
                    <form>
                        <div className="form-group">
                            <label>Người nhận:</label>
                            <input
                                type="text"
                                name="name"
                                value={receiverInfo.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Điện thoại:</label>
                            <input
                                type="text"
                                name="phone"
                                value={receiverInfo.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Địa chỉ:</label>
                            <input
                                type="text"
                                name="address"
                                value={receiverInfo.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Chọn Tỉnh/Thành phố:</label>
                            <select name="province" onChange={handleInputChange}>
                                <option value="">Chọn tỉnh</option>
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="TP HCM">TP Hồ Chí Minh</option>
                                <option value="Đà Nẵng">Đà Nẵng</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Chọn Quận/Huyện:</label>
                            <select name="district" onChange={handleInputChange}>
                                <option value="">Chọn quận/huyện</option>
                                <option value="Quận 1">Quận 1</option>
                                <option value="Quận 2">Quận 2</option>
                                <option value="Quận 3">Quận 3</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Chọn Xã/Phường:</label>
                            <select name="ward" onChange={handleInputChange}>
                                <option value="">Chọn xã/phường</option>
                                <option value="Phường A">Phường A</option>
                                <option value="Phường B">Phường B</option>
                                <option value="Phường C">Phường C</option>
                            </select>
                        </div>

                            <button type="button" className="button-edit"  onClick={() => setIsEditing(false)}>
                            Lưu
                        </button>
                    </form>
                )}
            </div>
           
         
        </div>
        <div className="btn-dat-hang">
            <a href="/dat-hang-thanh-cong">Đặt hàng</a>
        </div>
        <br />
        <br />
        <hr />
        
    </>
    );
}
const ContactInfo = () => {
    return (
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
    );
};




const Cart = () => {
    const [receiverInfo, setReceiverInfo] = useState({
        name: "Trần Quốc Huy",
        phone: "0987654321",
        address: "123 Đường ABC, Quận XYZ",
        province: "",
        district: "",
        ward: "",
    });
    return (
        <div>
            <Header />
            <div className="container">
                <div className="breadcum">
                    <a href="/home">Trang chủ </a>
                    <span className="delimiter">| </span>
                    <a href="/cart">Giỏ hàng</a>
                </div>
                <CartTable />
                <ShippingInfo receiverInfo={receiverInfo} setReceiverInfo={setReceiverInfo} />
                <ContactInfo />
            </div>
            <Footer />
        </div>
    );
};

export default Cart;