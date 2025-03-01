import { useState } from "react";
import { Form, Button, Row, Col, Image } from "react-bootstrap";
import "../../styles/profile/Profile.css";

const ProfileForm = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileType = file.type;
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];

      // Kiểm tra định dạng ảnh
      if (!validTypes.includes(fileType)) {
        alert("Chỉ chấp nhận file ảnh JPEG, PNG, JPG.");
        return;
      }

      // Tạo URL blob để hiển thị ảnh
      const objectURL = URL.createObjectURL(file);
      setImage(objectURL);
    }
  };

  return (
    <div className="card p-4">
      <h4 className="mb-3">Hồ Sơ Của Tôi</h4>
      <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

      <Row>
        {/* Form nhập thông tin */}
        <Col md={8}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên Đăng Nhập</Form.Label>
              <Form.Control type="text" placeholder="Tên đăng nhập" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tên</Form.Label>
              <Form.Control type="text" placeholder="Tên" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số Điện Thoại</Form.Label>
              <Form.Control type="text" placeholder="Số điện thoại" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giới Tính</Form.Label>
              <div>
                <Form.Check inline label="Nam" type="radio" name="gender" />
                <Form.Check inline label="Nữ" type="radio" name="gender" />
                <Form.Check inline label="Khác" type="radio" name="gender" />
              </div>
            </Form.Group>

            {/* Ngày sinh */}
            <Form.Group className="mb-3">
              <Form.Label>Ngày Sinh</Form.Label>
              <Row>
                <Col>
                  <Form.Select>
                    {[...Array(31).keys()].map((d) => (
                      <option key={d + 1} value={d + 1}>{d + 1}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select>
                    {["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
                      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"].map((m, index) => (
                      <option key={index} value={index + 1}>{m}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select>
                    {[...Array(100).keys()].map((y) => (
                      <option key={y} value={2025 - y}>{2025 - y}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>

            {/* Thông tin nhận hàng */}
            <h5 className="mt-4">Thông tin nhận hàng</h5>

            <Form.Group className="mb-3">
              <Form.Label>Tỉnh/Thành Phố</Form.Label>
              <Form.Select>
                <option>-- Chọn tỉnh --</option>
                <option>Hà Nội</option>
                <option>TP. Hồ Chí Minh</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quận/Huyện</Form.Label>
              <Form.Select>
                <option>-- Chọn Quận/Huyện --</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phường/Xã</Form.Label>
              <Form.Select>
                <option>-- Chọn Xã/Phường --</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Địa Chỉ</Form.Label>
              <Form.Control type="text" placeholder="Địa chỉ" />
            </Form.Group>

            <Button variant="danger" type="submit">Lưu</Button>
          </Form>
        </Col>

        {/* Ảnh đại diện */}
        <Col md={4} className="text-center d-flex flex-column align-items-center">
          <Image src={image || "https://png.pngtree.com/png-clipart/20190920/original/pngtree-file-upload-icon-png-image_4646955.jpg"} roundedCircle className="avatar" />

          {/* Chỉnh sửa nút upload ảnh */}
          <div className="upload-btn-wrapper mt-3">
            <Button variant="outline-secondary">Chọn Ảnh</Button>
            <input type="file" accept="image/*" className="upload-input" onChange={handleImageUpload} />
          </div>

          <p className="small text-muted mt-2">Dung lượng file tối đa 1MB <br /> Định dạng: JPEG, PNG</p>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileForm;
