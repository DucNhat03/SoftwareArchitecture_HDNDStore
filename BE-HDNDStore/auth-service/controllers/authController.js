import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import sendOtpEmail from "../services/emailService.js";

// Khởi tạo client Google OAuth
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

{
  /* Register */
}
export const register = async (req, res) => {
  try {
    const { email, phone, password, role } = req.body;

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
      role,
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

    const token = jwt.sign(
      { id: user._id, role: user.role }, // 🛑 Lưu role vào token
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

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

{
  /* Login with google */
}
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token không hợp lệ!" });

    {
      /* token */
    }

    console.log("Received Token from FE:", token);

    {
      /*Verify ID Token với Google*/
    }
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    {
      /*Kiểm tra dữ liệu trả về từ Google*/
    }
    console.log("Decoded Google Payload:", payload);

    const { email, name, picture } = payload;

    // Kiểm tra user đã tồn tại chưa
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        fullName: name,
        avatar: picture,
        password: "",
        role: "user",
      });
      await user.save();
    }

    // Tạo JWT token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token: accessToken, user });
  } catch (error) {
    console.error("Lỗi đăng nhập Google:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại!" });
  }
};
{
  /*Get access tu product
  Hàm tìm user theo ID*/
}

const findUserById = async (userId) => {
  return await User.findById(new mongoose.Types.ObjectId(userId));
};

// API lấy thông tin user theo ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra userId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "User ID không hợp lệ!" });
    }

    // Chuyển thành ObjectId
    const user = await findUserById(new mongoose.Types.ObjectId(userId));

    if (!user) {
      return res.status(404).json({ error: "User không tồn tại!" });
    }

    // Trả về thông tin user (ẩn mật khẩu)
    res.status(200).json({
      userId: user._id,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      gender: user.gender,
      birthday: user.birthday,
      address: user.address,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Lỗi lấy user:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại!" });
  }
};

{/*Update user by ID*/}
export const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, phone, address, avatar } = req.body;

    // Kiểm tra userId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "User ID không hợp lệ!" });
    }

    // Tìm và cập nhật user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, phone, address, avatar },
      { new: true } // Trả về dữ liệu sau khi cập nhật
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User không tồn tại!" });
    }

    res.status(200).json({
      message: "Cập nhật thành công!",
      user: {
        userId: updatedUser._id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        fullName: updatedUser.fullName,
        gender: updatedUser.gender,
        birthday: updatedUser.birthday,
        address: updatedUser.address,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error("Lỗi cập nhật user:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại!" });
  }
};


{/* send otp */}
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Email không tồn tại!" });
    }

    // Tạo mã OTP
    const otp = otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false });
    const otpExpiry = Date.now() + 5 * 60 * 1000; // Hết hạn sau 5 phút

    // Lưu OTP vào database
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    const name = user.fullName

    // Gửi OTP qua email sang template 
    await sendOtpEmail(email, name, otp);

    res.status(200).json({ message: "Mã OTP đã được gửi qua email!" });
  } catch (error) {
    console.error("Lỗi gửi OTP:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại!" });
  }
};

{/* verify otp */}
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email không tồn tại!" });

    // Kiểm tra OTP
    if (user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ error: "Mã OTP không hợp lệ hoặc đã hết hạn!" });
    }

    // OTP hợp lệ → Cho phép đặt lại mật khẩu
    user.isOtpVerified = true;
    user.otp = null; // Xóa OTP sau khi xác minh
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "OTP hợp lệ, tiếp tục đặt lại mật khẩu." });
  } catch (error) {
    console.error("Lỗi xác thực OTP:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại!" });
  }
};


{/* reset password sau khi nhap ma otp */}
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Email không tồn tại!" });
    }

    // Kiểm tra xem OTP đã được xác minh chưa
    if (!user.isOtpVerified) {
      return res.status(400).json({ error: "Bạn chưa xác minh OTP!" });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Xóa trạng thái OTP đã xác minh
    user.isOtpVerified = false;
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại!" });
  }
};
