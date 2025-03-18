import { useState, useEffect } from "react";
import "../../styles/cart/ProductDetail.css";
import "../../styles/cart/Cart.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";





const CartTable = () => {
    const [cart, setCart] = useState([]);
   
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Lấy userId từ localStorage
        const userId = localStorage.getItem("userId");

        if (!userId) {
            // alert("Vui lòng đăng nhập để xem giỏ hàng!");
            return;
        }

        // Lấy danh sách giỏ hàng của tất cả user từ localStorage
        const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};

        // Lấy giỏ hàng của user hiện tại
        const userCart = storedCarts[userId] || [];

        setCart(userCart);
        setCartItems(userCart);
    }, []);

    // Cập nhật số lượng sản phẩm
    const handleQuantityChange = (id, color, size, type) => {
        const updatedCart = cartItems.map((item) =>
            item.id === id && item.color === color && item.size === size
                ? { ...item, quantity: type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
                : item
        );

        setCart(updatedCart);
        setCartItems(updatedCart);

        // Lưu giỏ hàng theo userId vào localStorage
        const userId = localStorage.getItem("userId");
        const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};
        storedCarts[userId] = updatedCart;
        localStorage.setItem("carts", JSON.stringify(storedCarts));
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = (id, color, size) => {
        const updatedCart = cartItems.filter((item) => !(item.id === id && item.color === color && item.size === size));

        setCart(updatedCart);
        setCartItems(updatedCart);

        // Lưu giỏ hàng theo userId vào localStorage
        const userId = localStorage.getItem("userId");
        const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};
        storedCarts[userId] = updatedCart;
        localStorage.setItem("carts", JSON.stringify(storedCarts));
    };
    

// Cart
    return (
        <>
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
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <div className="san-pham">
                                    <img src={item.image} alt={item.name} />
                                    <div className="thong-tin-san-pham">
                                        <p>{item.name}</p>
                                        <div className="mau-sac-kich-thuoc">
                                            <span>Màu: {item.color}</span>
                                            <span>, Kích thước: {item.size}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>{item.price.toLocaleString()} đ</td>
                            <td>
                                <div className="quantity-wrapper">
                                    <button onClick={() => handleQuantityChange(item.id, item.color, item.size, "decrease")} className="quantity-btn">-</button>
                                    <input type="number" value={item.quantity} readOnly />
                                    <button onClick={() => handleQuantityChange(item.id, item.color, item.size, "increase")} className="quantity-btn">+</button>
                                </div>
                            </td>
                            <td className="so-tien-cart">{(item.price * item.quantity).toLocaleString()} đ</td>
                            <td>
                                <span className="button-edit" onClick={() => handleRemoveItem(item.id, item.color, item.size)}>Xóa</span>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>Giỏ hàng trống</td>
                    </tr>
                )}
            </tbody>
        </table>
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
                        <p style={{ marginLeft: '290px' }}>
                            {cartItems
                                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                                .toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                        </p>
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
                        <p style={{ fontSize: '20px' ,fontWeight: 'bold' }}>Tổng cộng:</p>
                        <p style={{ fontSize: '20px', marginLeft: '290px', fontWeight: 'bold' }}>
                            {cartItems
                                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                                .toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                        </p>
                </div>
            </div>


            </div>
        </>
    );
};

const ShippingInfo = ({ carts = [] }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [receiverInfo, setReceiverInfo] = useState({
        fullName: "",
        phone: "",
        address: {
            city: "",
            district: "",
            ward: "",
            street: "", 
        },
    });
    // const [receiverInfo, setReceiverInfo] = useState(null);

    const [error, setError] = useState(null);

    // Lấy userId từ localStorage
    const userId = localStorage.getItem("userId")?.replace(/"/g, "").trim();
    

    // Hàm lấy thông tin vận chuyển
    const fetchReceiverInfo = async () => {
        if (!userId) {
            setError("Không tìm thấy userId. Vui lòng đăng nhập lại.");
            return;
        }

        try {
           
            const response = await fetch(`http://localhost:5001/api/users/${userId}`);
            const data = await response.json();
            console.log("data dia chi:", data);

            if (response.ok && data) {
                setReceiverInfo({
                    fullName: data.fullName,
                    phone: data.phone,
                    address: {
                        street: data.address?.street || "",
                        ward: data.address?.ward || "",
                        district: data.address?.district || "",
                        city: data.address?.city || ""
                    },
                });
                setError(null);
            } else {
                setReceiverInfo(null);
                setError("Không tìm thấy thông tin vận chuyển.");
            }
        } catch (error) {
            setError("Có lỗi xảy ra khi lấy thông tin vận chuyển.");
            setReceiverInfo(null);
        }
    };

    // Gọi API khi component được mount
    useEffect(() => {
        fetchReceiverInfo();
    }, []);

    

    const handleSaveReceiverInfo = () => {
        if (!userId) {
            setError("Không tìm thấy userId. Vui lòng đăng nhập lại.");
            return;
        }

        // Lưu tạm địa chỉ vào state
        setReceiverInfo({
            fullName: receiverInfo.fullName,
            phone: receiverInfo.phone,
            address: {
                city: receiverInfo.address?.city || "",
                district: receiverInfo.address?.district || "",
                ward: receiverInfo.address?.ward || "",
                street: receiverInfo.address?.street || "",
            },
        });

        setIsEditing(false);
        setError(null);
        console.log("Đã lưu địa chỉ tạm thời:", receiverInfo);
    };




    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Nếu là field của address (city, district, ward, street)
        if (["city", "district", "ward", "street"].includes(name)) {
            setReceiverInfo((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value,
                },
            }));
        } else {
            setReceiverInfo((prev) => ({
                ...prev,
                [name]: value, // Nếu là fullName hoặc phone
            }));
        }
    };

    const saveCartForUser = (userId, cart) => {
        console.log("userId saveCartForUser:", userId);
        if (!userId) return;

        userId = `"${userId.replace(/"/g, "")}"`; // Thêm dấu `"` vào userId

        let carts = JSON.parse(localStorage.getItem("carts")) || {};

        console.log("Trước khi cập nhật localStorage:", carts);

        if (!cart || cart.length === 0) {
            console.log(`Xóa giỏ hàng của user: ${userId}`);
            delete carts[userId]; // Xóa giỏ hàng của user khỏi object carts
        } else {
            carts[userId] = cart;
        }

        localStorage.setItem("carts", JSON.stringify(carts)); // Cập nhật lại localStorage

        console.log("✅ Sau khi cập nhật localStorage:", JSON.parse(localStorage.getItem("carts")));
    };




    const getCartForUser = (userId) => {
        try {
            if (!userId) {
                userId = localStorage.getItem("userId");
                if (!userId) {
                    console.warn("⚠️ Không tìm thấy userId trong localStorage!");
                    return [];
                }
            }

            console.log("userId sau khi lấy:", userId);

            const storedCartsRaw = localStorage.getItem("carts");
            console.log("Dữ liệu raw từ localStorage:", storedCartsRaw);

            if (!storedCartsRaw) {
                console.warn("Không tìm thấy giỏ hàng trong localStorage!");
                return [];
            }

            let storedCarts;
            try {
                storedCarts = JSON.parse(storedCartsRaw);
            } catch (error) {
                console.error("Lỗi khi parse JSON giỏ hàng:", error);
                return [];
            }

            console.log("Dữ liệu carts từ localStorage:", storedCarts);
          

            if (!storedCarts.hasOwnProperty(userId)) {
                console.warn(`Không tìm thấy giỏ hàng của userId: ${userId}`);
                return [];
            }

            console.log("Giỏ hàng lấy được:", storedCarts[userId]);

            return Array.isArray(storedCarts[userId]) ? storedCarts[userId] : [];
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            return [];
        }
    };


    const handleOrder = async () => {
        try {
            console.log("Giỏ hàng lưu:", localStorage.getItem("carts"));

            let userId = localStorage.getItem("userId");

            if (!userId || userId === "null" || userId === "undefined") {
                alert("Vui lòng đăng nhập để đặt hàng!");
                return;
            }
            if (!receiverInfo) {
                setError("Vui lòng nhập thông tin vận chuyển trước khi đặt hàng.");
                return;
            }

            let carts = getCartForUser(userId);

            if (!Array.isArray(carts) || carts.length === 0) {
                alert("Giỏ hàng trống! Vui lòng thêm sản phẩm vào giỏ trước khi đặt hàng.");
                return;
            }

            // 🔹 Định dạng giỏ hàng trước khi gửi lên server
            const formattedCart = Object.values(
                carts.reduce((acc, item) => {
                    if (!acc[item._id]) {
                        acc[item._id] = {
                            _id: item._id,
                            name: item.name,
                            price: item.price,
                            quantity: 0, // Sẽ tính sau
                            image: Array.isArray(item.image) ? item.image : [item.image],
                            category: item.category,
                            description: item.description,
                            subcategories: Array.isArray(item.subcategories) ? item.subcategories : [item.subcategories],
                            rating: item.rating,
                            imagethum: Array.isArray(item.imagethum) ? item.imagethum : [item.imagethum],
                            variants: [] // Danh sách biến thể (color, size, stock)
                        };
                    }

                    let existingVariant = acc[item._id].variants.find(v => v.color === item.color && v.size === item.size);

                    if (existingVariant) {
                        existingVariant.stock += item.quantity || 1;
                    } else {
                        acc[item._id].variants.push({ color: item.color, size: item.size, stock: item.quantity || 1 });
                    }

                    // Cập nhật tổng số lượng của sản phẩm
                    acc[item._id].quantity += item.quantity || 1;

                    return acc;
                }, {})
            );

            console.log("Giỏ hàng sau khi xử lý:", formattedCart);

            userId = userId.replace(/"/g, "");
            const orderData = {
                receiver: userId,
                cartItems: formattedCart,
                shippingAddress: {
                    fullName: receiverInfo.fullName,
                    phone: receiverInfo.phone,
                    address: {
                        city: receiverInfo.address?.city || "",
                        district: receiverInfo.address?.district || "",
                        ward: receiverInfo.address?.ward || "",
                        street: receiverInfo.address?.street || "",
                    }
                }
            };

            console.log("orderData gửi lên:", orderData);

            // Gửi yêu cầu đặt hàng
            const response = await fetch("http://localhost:5002/api/dat-hang", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                let errorMessage = "Lỗi không xác định từ server!";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (err) {
                    console.error("Lỗi khi parse JSON từ response:", err);
                }
                throw new Error(errorMessage);
            }

            toast.success("Đặt hàng thành công!", {
                position: "top-right",
            });
            // Chờ 2 giây rồi chuyển trang
            setTimeout(() => {
                saveCartForUser(userId, []); // Xóa giỏ hàng sau khi đặt hàng
                window.location.href = "/dat-hang-thanh-cong";
            }, 2000);

        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            alert("Lỗi server, vui lòng thử lại! " + error.message);
        }
    };




    

return (
    
    <>
       


        <div className="thong-tin-van-chuyen">
            <div className="title-van-chuyen">
                <p style={{ fontSize: "18px", color: "red", marginBottom: "20px" }}>THÔNG TIN VẬN CHUYỂN</p>
                <p className="thay-doi" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Hủy" : "Thay đổi thông tin nhận hàng"}
                </p>

                
            </div>
            <div className="dia-chi-nhan-hang">
                {!isEditing ? (
                    <form>
                        <div className="form-group">
                            <div className="form-group-item">
                                <p className="form-group-title">Người nhận: </p>
                                <p className="form-group-value">{receiverInfo?.fullName || "Chưa có thông tin"}</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-group-item">
                                <p className="form-group-title">Điện thoại: </p>
                                <p className="form-group-value">{receiverInfo?.phone || "Chưa có thông tin"}</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-group-item">
                                <p className="form-group-title">Địa chỉ: </p>
                                <p className="form-group-value">
                                    <p className="form-group-value">
                                        {receiverInfo?.address?.street || "Chưa có số nhà, đường"},
                                        {receiverInfo?.address?.ward || "Chưa có xã/phường"},
                                        {receiverInfo?.address?.district || "Chưa có quận/huyện"},
                                        {receiverInfo?.address?.city || "Chưa có tỉnh/thành phố"}
                                    </p>


                                </p>
                            </div>
                        </div>
                    </form>
                ) : (
                    <form>
                        <div className="form-group">
                            <label>Người nhận:</label>
                            <input
                                type="text"
                                name="fullName"
                                value={receiverInfo?.fullName || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Điện thoại:</label>
                            <input
                                type="text"
                                name="phone"
                                value={receiverInfo?.phone || ""}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Địa chỉ:</label>
                            <input
                                type="text"
                                name="street"
                                placeholder="Nhập số nhà, đường..."
                                value={receiverInfo?.address?.street || ""}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Chọn Tỉnh/Thành phố:</label>
                                <select name="city" value={receiverInfo?.address?.city || ""} onChange={handleInputChange}>
                                <option value="">Chọn tỉnh</option>
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="TP HCM">TP Hồ Chí Minh</option>
                                <option value="Đà Nẵng">Đà Nẵng</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Chọn Quận/Huyện:</label>
                            <select name="district" value={receiverInfo?.address?.district || ""} onChange={handleInputChange}>
                                <option value="">Chọn quận/huyện</option>
                                <option value="Quận 1">Quận 1</option>
                                <option value="Quận 2">Quận 2</option>
                                <option value="Quận 3">Quận 3</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Chọn Xã/Phường:</label>
                            <select name="ward" value={receiverInfo?.address?.ward || ""} onChange={handleInputChange}>
                                <option value="">Chọn xã/phường</option>
                                <option value="Phường A">Phường A</option>
                                <option value="Phường B">Phường B</option>
                                <option value="Phường C">Phường C</option>
                            </select>
                        </div>

                        <button type="button" className="button-edit" onClick={handleSaveReceiverInfo}>
                            Lưu
                        </button>
                    </form>
                )}
            </div>

         
        </div>
        <div className="btn-dat-hang">
            <a onClick={handleOrder}
            >Đặt hàng</a>
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

    // Lấy cart từ localStorage khi component mount
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCart(JSON.parse(storedCart)); // Chuyển JSON thành object
        }
    }, []);
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
                <ShippingInfo cart={cart} />
                <ContactInfo />
            </div>
            <Footer />
        </div>
    );
};

export default Cart;