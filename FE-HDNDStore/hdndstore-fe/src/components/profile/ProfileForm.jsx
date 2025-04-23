import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Image } from "react-bootstrap";
import api from "../../services/api"; // API helper
import "../../styles/profile/Profile.css";
import toastService from "../../utils/toastService.js";
import {
  days,
  months,
  years,
  cities,
  districts,
  wards,
} from "../../utils/data.js";

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
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);

  const [image, setImage] = useState(null);
  useEffect(() => {
    // Khi thành phố thay đổi, cập nhật danh sách quận/huyện
    if (user.address.city) {
      setAvailableDistricts(districts[user.address.city] || []);
      setUser((prev) => ({
        ...prev,
        address: { ...prev.address, district: "", ward: "" }, // Reset district và ward khi city thay đổi
      }));
    } else {
      setAvailableDistricts([]);
    }
  }, [user.address.city]);

  useEffect(() => {
    // Khi quận/huyện thay đổi, cập nhật danh sách phường/xã
    if (user.address.district) {
      setAvailableWards(wards[user.address.district] || []);
      setUser((prev) => ({
        ...prev,
        address: { ...prev.address, ward: "" }, // Reset ward khi district thay đổi
      }));
    } else {
      setAvailableWards([]);
    }
  }, [user.address.district]);
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
          headers: { Authorization: `Bearer ${token}` }, //Đảm bảo token được gửi
        });

        setUser(response.data);
        // Sử dụng URL Cloudinary trực tiếp, không cần thêm tiền tố
        setImage(response.data.avatar || null);
        console.log("Avatar URL:", response.data.avatar);
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin user:",
          error.response?.data || error
        );
      }
    };

    fetchUserData();
  }, []);

  // Xử lý tải ảnh lên
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type;
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(fileType)) {
      toastService.error("Chỉ chấp nhận file ảnh JPEG, PNG, JPG.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/auth/upload-avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Sử dụng URL Cloudinary trực tiếp, không cần thêm tiền tố
      setImage(response.data.avatar);
      toastService.success("Cập nhật avatar thành công!");
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error.response?.data || error);
      toastService.error("Lỗi khi cập nhật avatar!");
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
      address: { ...prev.address, [name]: value }, 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.put("/auth/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      {
        /*alert("Cập nhật hồ sơ thành công!");*/
      }
      toastService.info("Cập nhật hồ sơ thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      toastService.warning("Lỗi khi cập nhật hồ sơ");
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
              <Row className="g-3">
                {" "}
                <Col >
                  <Form.Select
                    name="birthday.day"
                    value={user.birthday?.day || ""}
                    onChange={handleChange}
                  >
                    <option value="">Ngày</option>
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col >
                  <Form.Select
                    name="birthday.month"
                    value={user.birthday?.month || ""}
                    onChange={handleChange}
                  >
                    <option value="">Tháng</option>
                    {months.map((m, index) => (
                      <option key={index} value={index + 1}>
                        {m}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col >
                  <Form.Select
                    name="birthday.year"
                    value={user.birthday?.year || ""}
                    onChange={handleChange}
                  >
                    <option value="">Năm</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
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
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
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
                {availableDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
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
                {availableWards.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
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
