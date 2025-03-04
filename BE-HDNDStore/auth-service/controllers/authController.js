import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

{
  /* Register */
}
export const register = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Kiểm tra nếu user đã tồn tại
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "Số điện thoại đã được đăng ký!" });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user với các trường mặc định
    const newUser = new User({
      phone,
      password: hashedPassword,
      email: email,
      fullName: "",
      gender: "other",
      birthday: { day: "", month: "", year: "" },
      address: { city: "", district: "", ward: "", street: "" },
      avatar: "",
    });

    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại!" });
  }
};
{
  /* Login */
}
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ error: "Người dùng không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Mật khẩu không đúng!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

{
  /* Get User Profile */
}
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Loại bỏ password
    if (!user)
      return res.status(404).json({ error: "Người dùng không tồn tại" });

    res.json(user);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

{
  /* Update Profile */
}

export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, phone, gender, birthday, address, avatar } = req.body;

    // Cập nhật thông tin
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, phone, gender, birthday, address, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Lỗi khi cập nhật hồ sơ:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

{
  /* Update Password */
}

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ token (Middleware)
    const { currentPassword, newPassword } = req.body;

    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Mật khẩu hiện tại không chính xác!" });
    }

    // Mã hóa mật khẩu mới và cập nhật vào DB
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    return res.status(500).json({ error: "Lỗi server, vui lòng thử lại!" });
  }
};

{
  /* Upload Image */
}
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file được tải lên!" });
    }

    const userId = req.user.id;
    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    // Cập nhật avatar trong DB
    await User.findByIdAndUpdate(userId, { avatar: avatarPath });

    return res
      .status(200)
      .json({ message: "Cập nhật avatar thành công!", avatar: avatarPath });
  } catch (error) {
    console.error("Lỗi cập nhật avatar:", error);
    return res.status(500).json({ error: "Lỗi server, vui lòng thử lại!" });
  }
};
