import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Image,
  Card,
  Container,
  InputGroup,
} from "react-bootstrap";
import api from "../../services/api"; // API helper
// import "../../styles/profile/Profile.css";
import toastService from "../../utils/toastService.js";
import {
  days,
  months,
  years,
  cities,
  districts,
  wards,
} from "../../utils/data.js";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSave,
  FaUpload,
} from "react-icons/fa";

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
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

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
      setLoading(true);
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
        toastService.error("Không thể tải thông tin cá nhân");
      } finally {
        setLoading(false);
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

    setLoading(true);
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
    } finally {
      setLoading(false);
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
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.put("/auth/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toastService.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      toastService.error("Lỗi khi cập nhật hồ sơ");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Container>
      <Card
        className="shadow-sm border-0 mb-8"
        style={{ marginTop: "-14%", padding: "2rem 0" }}
      >
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex align-items-center">
            <FaUser className="text-primary me-2 fs-4" />
            <div>
              <h4 className="mb-0">Hồ Sơ Của Tôi</h4>
              <p className="text-muted small mb-0">
                Quản lý thông tin hồ sơ để bảo mật tài khoản
              </p>
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-4">
          <Row>
            <Col lg={8} className="pe-lg-5">
              <Form onSubmit={handleSubmit}>
                <Card className="mb-4">
                  <Card.Header className="bg-light py-3">
                    <h5 className="mb-0">Thông tin cá nhân</h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaUser className="me-2 text-primary" /> Họ và Tên
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={user.fullName || ""}
                            onChange={handleChange}
                            className="py-2"
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaEnvelope className="me-2 text-primary" /> Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={user.email || ""}
                            disabled
                            className="py-2 bg-light"
                          />
                          <Form.Text className="text-muted">
                            Email không thể thay đổi
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaPhone className="me-2 text-primary" /> Số Điện
                            Thoại
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            value={user.phone || ""}
                            onChange={handleChange}
                            className="py-2"
                          />
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Giới Tính</Form.Label>
                          <div className="d-flex gap-4 mt-2">
                            <Form.Check
                              type="radio"
                              label="Nam"
                              name="gender"
                              value="male"
                              id="gender-male"
                              checked={user.gender === "male"}
                              onChange={handleChange}
                              className="form-check-inline"
                            />
                            <Form.Check
                              type="radio"
                              label="Nữ"
                              name="gender"
                              value="female"
                              id="gender-female"
                              checked={user.gender === "female"}
                              onChange={handleChange}
                              className="form-check-inline"
                            />
                            <Form.Check
                              type="radio"
                              label="Khác"
                              name="gender"
                              value="other"
                              id="gender-other"
                              checked={user.gender === "other"}
                              onChange={handleChange}
                              className="form-check-inline"
                            />
                          </div>
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group className="mb-0" style={{ width: "100%" }}>
                          <Form.Label>
                            <FaCalendarAlt className="me-2 text-primary" /> Ngày
                            Sinh
                          </Form.Label>

                          {/* Dòng 1: Ngày + Tháng */}
                          <Row className="g-2">
                            <Col md={6}>
                              <Form.Select
                                name="birthday.day"
                                value={user.birthday?.day || ""}
                                onChange={handleChange}
                                className="py-2"
                              >
                                <option value="">Ngày</option>
                                {days.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </Form.Select>
                            </Col>
                            <Col md={6}>
                              <Form.Select
                                name="birthday.month"
                                value={user.birthday?.month || ""}
                                onChange={handleChange}
                                className="py-2"
                              >
                                <option value="">Tháng</option>
                                {months.map((m, index) => (
                                  <option key={index} value={index + 1}>
                                    {m}
                                  </option>
                                ))}
                              </Form.Select>
                            </Col>
                          </Row>

                          {/* Dòng 2: Năm */}
                          <Row className="g-2 mt-2">
                            <Col md={12}>
                              <Form.Select
                                name="birthday.year"
                                value={user.birthday?.year || ""}
                                onChange={handleChange}
                                className="py-2"
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
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="mb-4">
                  <Card.Header className="bg-light py-3">
                    <h5 className="mb-0">
                      <FaMapMarkerAlt className="me-2 text-primary" /> Thông tin
                      nhận hàng
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tỉnh/Thành Phố</Form.Label>
                          <Form.Select
                            name="city"
                            value={user.address.city}
                            onChange={(e) => handleAddressChange(e)}
                            className="py-2"
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

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Quận/Huyện</Form.Label>
                          <Form.Select
                            name="district"
                            value={user.address.district}
                            onChange={(e) => handleAddressChange(e)}
                            className="py-2"
                            disabled={!user.address.city}
                          >
                            <option value="">-- Chọn Quận/Huyện --</option>
                            {availableDistricts.map((district) => (
                              <option key={district} value={district}>
                                {district}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phường/Xã</Form.Label>
                          <Form.Select
                            name="ward"
                            value={user.address.ward}
                            onChange={(e) => handleAddressChange(e)}
                            className="py-2"
                            disabled={!user.address.district}
                          >
                            <option value="">-- Chọn Xã/Phường --</option>
                            {availableWards.map((ward) => (
                              <option key={ward} value={ward}>
                                {ward}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Địa Chỉ Cụ Thể</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <FaMapMarkerAlt />
                            </InputGroup.Text>
                            <Form.Control
                              type="text"
                              name="street"
                              placeholder="Nhập địa chỉ cụ thể (Số nhà, đường)"
                              value={user.address.street}
                              onChange={(e) => handleAddressChange(e)}
                              className="py-2"
                            />
                          </InputGroup>
                          <Form.Text className="text-muted">
                            Ví dụ: Số 123, Đường Nguyễn Văn A
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="d-grid mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="py-2"
                    disabled={saveLoading}
                  >
                    {saveLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <FaSave className="me-2" /> Lưu thông tin
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Col>

            <Col lg={4}>
              <Card
                className="text-center shadow-sm "
                style={{ marginTop: "-50%" }}
              >
                <Card.Body className="d-flex flex-column justify-content-center py-5">
                  <div className="position-relative mx-auto mb-4">
                    {loading && (
                      <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center bg-white bg-opacity-75">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    )}
                    <Image
                      src={
                        image ||
                        "https://secure.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                      }
                      roundedCircle
                      className="profile-avatar shadow-sm border border-3 border-light"
                      style={{
                        width: "180px",
                        height: "180px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="upload-btn-wrapper">
                    <Button
                      variant="outline-primary"
                      className="px-6 d-flex align-items-center justify-content-center mx-auto"
                    >
                      <FaUpload className="me-2" /> Thay đổi ảnh đại diện
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      className="upload-input"
                      onChange={handleImageUpload}
                    />
                  </div>

                  <div className="mt-3 text-muted small">
                    Định dạng hỗ trợ: JPG, PNG. Dung lượng tối đa 2MB
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfileForm;
