import { useState, useEffect } from "react";
import "../../styles/cart/ProductDetail.css";
import "../../styles/cart/Cart.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Hotline from "../layout/Hotline";
import { Container, Row, Col, Table, Button, Form, Card, Badge, InputGroup } from 'react-bootstrap';
import {
    cities,
    districts,
    wards,
} from "../../utils/data.js";



const CartTable = ({ setDis }) => {
    const [cart, setCart] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    setDis(selectedDiscount);
    
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/vouchers");
                const validVouchers = response.data.filter(voucher => voucher.state === "Còn hiệu lực");
                setVouchers(validVouchers);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách voucher:", error);
            }
        };

        fetchVouchers();
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            return;
        }

        const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};
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
        const userId = localStorage.getItem("userId");
        const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};
        storedCarts[userId] = updatedCart;
        localStorage.setItem("carts", JSON.stringify(storedCarts));
    };

    const formatVND = (amount) => {
        return amount.toLocaleString("vi-VN");
    };

    useEffect(() => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newTotal = subtotal - selectedDiscount + 20000;

        setTotalAmount(newTotal);
    }, [cartItems, selectedDiscount]);

    // Xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = (id, color, size) => {
        const updatedCart = cartItems.filter((item) => !(item.id === id && item.color === color && item.size === size));

        setCart(updatedCart);
        setCartItems(updatedCart);
        const userId = localStorage.getItem("userId");
        const storedCarts = JSON.parse(localStorage.getItem("carts")) || {};
        storedCarts[userId] = updatedCart;
        localStorage.setItem("carts", JSON.stringify(storedCarts));
    };
    
    // Cart
    return (
        <>
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-dark text-white">
                    <h5 className="mt-2 mb-2 py-2">Giỏ hàng của bạn</h5>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th className="py-3">Sản Phẩm</th>
                                <th className="py-3 text-center">Đơn Giá</th>
                                <th className="py-3 text-center">Số Lượng</th>
                                <th className="py-3 text-center">Số Tiền</th>
                                <th className="py-3 text-center">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="rounded me-3"
                                                    style={{width: '80px', height: '80px', objectFit: 'cover'}}
                                                />
                                                <div>
                                                    <h6 className="mb-1">{item.name}</h6>
                                                    <div>
                                                        <Badge bg="light" text="dark" className="me-2">Màu: {item.color}</Badge>
                                                        <Badge bg="light" text="dark">Kích thước: {item.size}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center align-middle">{item.price.toLocaleString()} đ</td>
                                        <td className="text-center align-middle">
                                            <InputGroup size="sm" style={{width: '120px'}} className="mx-auto">
                                                <Button 
                                                    variant="outline-secondary" 
                                                    onClick={() => handleQuantityChange(item.id, item.color, item.size, "decrease")}
                                                >
                                                    -
                                                </Button>
                                                <Form.Control 
                                                    type="number" 
                                                    value={item.quantity} 
                                                    readOnly 
                                                    className="text-center"
                                                />
                                                <Button 
                                                    variant="outline-secondary" 
                                                    onClick={() => handleQuantityChange(item.id, item.color, item.size, "increase")}
                                                >
                                                    +
                                                </Button>
                                            </InputGroup>
                                        </td>
                                        <td className="text-center align-middle fw-bold text-danger">{(item.price * item.quantity).toLocaleString()} đ</td>
                                        <td className="text-center align-middle">
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleRemoveItem(item.id, item.color, item.size)}
                                            >
                                                <i className="bi bi-trash"></i> Xóa
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        <i className="bi bi-cart-x fs-1 d-block mb-3"></i>
                                        Giỏ hàng trống
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Row className="mb-5">
                <Col lg={6} className="mb-4 mb-lg-0 mt-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="bg-dark text-white">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-ticket-perforated fs-4 me-2 text-primary"></i>
                                <h5 className="mb-0 py-2">Voucher</h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-0">
                                <Form.Label>Chọn voucher</Form.Label>
                                <Form.Select 
                                    onChange={(e) => setSelectedDiscount(Number(e.target.value))}
                                    className="form-select-lg"
                                >
                                    <option value="0">Chọn Voucher</option>
                                    {vouchers.map((voucher) => (
                                        <option key={voucher.id} value={voucher.discount}>
                                            {voucher.name} 
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className="shadow-sm mt-0 h-100">
                        <Card.Header className="bg-dark text-white">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-calculator fs-4 me-2 text-primary"></i>
                                <h5 className="mb-0 py-2">Tổng đơn hàng</h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Tổng tiền hàng:</span>
                                <span>
                                    {cartItems
                                        .reduce((sum, item) => sum + item.price * item.quantity, 0)
                                        .toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                </span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <span>Giảm giá:</span>
                                <span className="text-success">- {formatVND(selectedDiscount)}đ</span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <span>Phí vận chuyển:</span>
                                <span>{formatVND(20000)}đ</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Tổng cộng:</h5>
                                <h4 className="text-danger mb-0">
                                    {(
                                        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
                                        - selectedDiscount  
                                        + 20000 
                                    ).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                </h4>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

const ShippingInfo = ({ carts = [], dis }) => {
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
    const [error, setError] = useState(null);
    const discount = dis;

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

            if (response.ok && data) {
                setReceiverInfo({
                    email: data.email,
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
        if (!userId) return;

        userId = `"${userId.replace(/"/g, "")}"`; // Thêm dấu `"` vào userId
        let carts = JSON.parse(localStorage.getItem("carts")) || {};

        if (!cart || cart.length === 0) {
            delete carts[userId]; // Xóa giỏ hàng của user khỏi object carts
        } else {
            carts[userId] = cart;
        }

        localStorage.setItem("carts", JSON.stringify(carts)); // Cập nhật lại localStorage
    };

    const getCartForUser = (userId) => {
        try {
            if (!userId) {
                userId = localStorage.getItem("userId");
                if (!userId) {
                    return [];
                }
            }

            const storedCartsRaw = localStorage.getItem("carts");

            if (!storedCartsRaw) {
                return [];
            }

            let storedCarts;
            try {
                storedCarts = JSON.parse(storedCartsRaw);
            } catch (error) {
                return [];
            }

            if (!storedCarts.hasOwnProperty(userId)) {
                return [];
            }

            return Array.isArray(storedCarts[userId]) ? storedCarts[userId] : [];
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            return [];
        }
    };

    const handleOrder = async (discount) => {
        try {
            let userId = localStorage.getItem("userId");

            if (!userId || userId === "null" || userId === "undefined") {
                toast.error("Vui lòng đăng nhập để đặt hàng!");
                return;
            }
            
            if (!receiverInfo) {
                setError("Vui lòng nhập thông tin vận chuyển trước khi đặt hàng.");
                toast.error("Vui lòng nhập thông tin vận chuyển trước khi đặt hàng.");
                return;
            }

            let carts = getCartForUser(userId);

            if (!Array.isArray(carts) || carts.length === 0) {
                toast.error("Giỏ hàng trống! Vui lòng thêm sản phẩm vào giỏ trước khi đặt hàng.");
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
                            quantity: 0,
                            image: Array.isArray(item.image) ? item.image : [item.image],
                            category: item.category,
                            description: item.description,
                            subcategories: Array.isArray(item.subcategories) ? item.subcategories : [item.subcategories],
                            rating: item.rating,
                            imagethum: Array.isArray(item.imagethum) ? item.imagethum : [item.imagethum],
                            variants: []
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

            userId = userId.replace(/"/g, "");
            const orderData = {
                receiver: userId,
                cartItems: formattedCart,
                discount: discount, 
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

            // Đặt hàng thành công, tạo hóa đơn PDF
            const orderDetails = await response.json(); // Giả sử response trả về chi tiết đơn hàng
          
            // Gọi API tạo hóa đơn PDF
            const invoiceResponse = await fetch("http://localhost:5002/api/generate-invoice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderDetails }), // Truyền orderDetails vào backend để tạo hóa đơn
            });

            if (!invoiceResponse.ok) {
                throw new Error("Lỗi khi tạo hóa đơn PDF");
            }

            const invoiceData = await invoiceResponse.json(); // Giả sử trả về URL file PDF hoặc thông tin hóa đơn

            // Gửi email với hóa đơn PDF
            const emailResponse = await fetch("http://localhost:5002/api/send-invoice-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: receiverInfo.email, invoiceUrl: invoiceData.pdfUrl }), // Truyền email và URL file PDF
            });

            if (!emailResponse.ok) {
                throw new Error("Lỗi khi gửi email");
            }

            toast.success("Đặt hàng thành công và hóa đơn đã được gửi qua email!", {
                position: "top-right",
            });
          
            
            // Chờ 2 giây rồi chuyển trang
            setTimeout(() => {
                saveCartForUser(userId, []); // Xóa giỏ hàng sau khi đặt hàng
                window.location.href = "/dat-hang-thanh-cong";
            }, 2000);

        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            toast.error("Lỗi server, vui lòng thử lại! " + error.message);
        }
    };

    return (
        <>
            <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-truck fs-4 me-2 text-primary"></i>
                            <h5 className="mb-0 py-2">THÔNG TIN VẬN CHUYỂN</h5>
                        </div>
                        <Button 
                            variant={isEditing ? "outline-secondary" : "outline-primary"} 
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? <><i className="bi bi-x-lg"></i> Hủy</> : 
                            <><i className="bi bi-pencil"></i> Thay đổi thông tin nhận hàng</>}
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    {!isEditing ? (
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Người nhận:</Form.Label>
                                    <p className="mb-0">{receiverInfo?.fullName || "Chưa có thông tin"}</p>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Điện thoại:</Form.Label>
                                    <p className="mb-0">{receiverInfo?.phone || "Chưa có thông tin"}</p>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Địa chỉ:</Form.Label>
                                    <p className="mb-0">
                                        {receiverInfo?.address?.street ? `${receiverInfo?.address?.street}, ` : "Chưa có số nhà, đường, "}
                                        {receiverInfo?.address?.ward ? `${receiverInfo?.address?.ward}, ` : "Chưa có xã/phường, "}
                                        {receiverInfo?.address?.district ? `${receiverInfo?.address?.district}, ` : "Chưa có quận/huyện, "}
                                        {receiverInfo?.address?.city || "Chưa có tỉnh/thành phố"}
                                    </p>
                                </Form.Group>
                            </Col>
                        </Row>
                    ) : (
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Người nhận:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fullName"
                                            value={receiverInfo?.fullName || ""}
                                            onChange={handleInputChange}
                                            placeholder="Nhập tên người nhận"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Điện thoại:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            value={receiverInfo?.phone || ""}
                                            onChange={handleInputChange}
                                            placeholder="Nhập số điện thoại"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Địa chỉ:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="street"
                                            placeholder="Nhập số nhà, đường..."
                                            value={receiverInfo?.address?.street || ""}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tỉnh/Thành phố:</Form.Label>
                                            <Form.Select
                                                name="city"
                                                value={receiverInfo?.address?.city || ""}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">-- Chọn tỉnh --</option>
                                                {cities.map((city) => (
                                                    <option key={city} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                </Col>
                                <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Quận/Huyện:</Form.Label>
                                            <Form.Select
                                                name="district"
                                                value={receiverInfo?.address?.district || ""}
                                                onChange={handleInputChange}
                                                disabled={!receiverInfo?.address?.city} // Chưa chọn tỉnh thì disable dropdown này
                                            >
                                                <option value="">-- Chọn quận/huyện --</option>
                                                {districts[receiverInfo?.address?.city]?.map((district) => (
                                                    <option key={district} value={district}>
                                                        {district}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                </Col>
                                <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Xã/Phường:</Form.Label>
                                            <Form.Select
                                                name="ward"
                                                value={receiverInfo?.address?.ward || ""}
                                                onChange={handleInputChange}
                                                disabled={
                                                    !receiverInfo?.address?.city || !receiverInfo?.address?.district
                                                }
                                            >
                                                <option value="">-- Chọn xã/phường --</option>
                                                {wards[receiverInfo?.address?.district]?.map((ward) => (
                                                    <option key={ward} value={ward}>
                                                        {ward}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>


                                </Col>
                                <Col md={12} className="mt-2">
                                    <Button 
                                        variant="primary" 
                                        onClick={handleSaveReceiverInfo}
                                        className="px-4"
                                    >
                                        <i className="bi bi-save me-2"></i>
                                        Lưu thông tin
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Card.Body>
            </Card>

            <div className="d-flex justify-content-center mb-5">
                <Button 
                    variant="primary" 
                    size="lg" 
                    className="px-5 py-3 shadow"
                    onClick={() => handleOrder(discount)}
                >
                    <i className="bi bi-bag-check me-2"></i>
                    Đặt hàng
                </Button>
            </div>
        </>
    );
};

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [dis, setDis] = useState(0);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCart(JSON.parse(storedCart)); 
        }
    }, []);
    
    return (
        <div>
            <Header />
            <Container className="py-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home" className="text-decoration-none">Trang chủ</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Giỏ hàng</li>
                    </ol>
                </nav>
                
                <h2 className="mb-4 fw-bold">Giỏ hàng</h2>
                
                <CartTable setDis={setDis} />
                <ShippingInfo cart={cart} dis={dis} />
            </Container>
            <Hotline />
            <Footer />
        </div>
    );
};

export default Cart;