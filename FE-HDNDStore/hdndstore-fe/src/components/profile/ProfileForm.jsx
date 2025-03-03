import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Image } from "react-bootstrap";
import api from "../../services/api"; // API helper
import "../../styles/profile/Profile.css";

const ProfileForm = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    birthday: { day: "", month: "", year: "" },
    address: { city: "", district: "", ward: "", street: "" },
    avatar: "",
  });

  const [image, setImage] = useState(null);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Chưa có token, vui lòng đăng nhập!");
          return;
        }

        const response = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Đảm bảo token được gửi
        });

        setUser(response.data);
        setImage(response.data.avatar || null);
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin user:",
          error.response?.data || error
        );
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileType = file.type;
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (!validTypes.includes(fileType)) {
        alert("Chỉ chấp nhận file ảnh JPEG, PNG, JPG.");
        return;
      }

      const objectURL = URL.createObjectURL(file);
      setImage(objectURL);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("birthday.")) {
      setUser((prev) => ({
        ...prev,
        birthday: {
          ...prev.birthday,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name.includes("address.")) {
      setUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value }, // từng phần của `address`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.put("/auth/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
    }
  };

  return (
    <div className="card p-4">
      <h4 className="mb-3">Hồ Sơ Của Tôi</h4>
      <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

      <Row>
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Họ và Tên</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={user.fullName || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={user.email || ""}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số Điện Thoại</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={user.phone || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giới Tính</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Nam"
                  type="radio"
                  name="gender"
                  value="male"
                  checked={user.gender === "male"}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  label="Nữ"
                  type="radio"
                  name="gender"
                  value="female"
                  checked={user.gender === "female"}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  label="Khác"
                  type="radio"
                  name="gender"
                  value="other"
                  checked={user.gender === "other"}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>

            {/* Ngày sinh */}
            <Form.Group className="mb-3">
              <Form.Label>Ngày Sinh</Form.Label>
              <Row>
                <Col>
                  <Form.Select
                    name="birthday.day"
                    value={user.birthday?.day || ""}
                    onChange={handleChange}
                  >
                    <option value="">Ngày</option>
                    {[...Array(31).keys()].map((d) => (
                      <option key={d + 1} value={d + 1}>
                        {d + 1}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select
                    name="birthday.month"
                    value={user.birthday?.month || ""}
                    onChange={handleChange}
                  >
                    <option value="">Tháng</option>
                    {[
                      "Tháng 1",
                      "Tháng 2",
                      "Tháng 3",
                      "Tháng 4",
                      "Tháng 5",
                      "Tháng 6",
                      "Tháng 7",
                      "Tháng 8",
                      "Tháng 9",
                      "Tháng 10",
                      "Tháng 11",
                      "Tháng 12",
                    ].map((m, index) => (
                      <option key={index} value={index + 1}>
                        {m}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select
                    name="birthday.year"
                    value={user.birthday?.year || ""}
                    onChange={handleChange}
                  >
                    <option value="">Năm</option>
                    {[...Array(100).keys()].map((y) => (
                      <option key={y} value={2025 - y}>
                        {2025 - y}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>

            {/* Thông tin nhận hàng */}
            <h5 className="mt-4">Thông tin nhận hàng</h5>

            <Form.Group className="mb-3">
              <Form.Label>Tỉnh/Thành Phố</Form.Label>
              <Form.Select
                name="city"
                value={user.address.city}
                onChange={(e) => handleAddressChange(e)}
              >
                <option value="">-- Chọn tỉnh --</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quận/Huyện</Form.Label>
              <Form.Select
                name="district"
                value={user.address.district}
                onChange={(e) => handleAddressChange(e)}
              >
                <option value="">-- Chọn Quận/Huyện --</option>
                <option value="Quận 1">Quận 1</option>
                <option value="Quận 2">Quận 2</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phường/Xã</Form.Label>
              <Form.Select
                name="ward"
                value={user.address.ward}
                onChange={(e) => handleAddressChange(e)}
              >
                <option value="">-- Chọn Xã/Phường --</option>
                <option value="Phường A">Phường A</option>
                <option value="Phường B">Phường B</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Địa Chỉ Cụ Thể</Form.Label>
              <Form.Control
                type="text"
                name="street"
                placeholder="Nhập địa chỉ cụ thể (Số nhà, đường)"
                value={user.address.street}
                onChange={(e) => handleAddressChange(e)}
              />
            </Form.Group>

            <Button variant="danger" type="submit">
              Lưu
            </Button>
          </Form>
        </Col>

        <Col
          md={4}
          className="text-center d-flex flex-column align-items-center"
        >
          <Image
            src={
              image ||
              "https://png.pngtree.com/png-clipart/20190920/original/pngtree-file-upload-icon-png-image_4646955.jpg"
            }
            roundedCircle
            className="avatar"
          />

          <div className="upload-btn-wrapper mt-3">
            <Button variant="outline-secondary">Chọn Ảnh</Button>
            <input
              type="file"
              accept="image/*"
              className="upload-input"
              onChange={handleImageUpload}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileForm;
