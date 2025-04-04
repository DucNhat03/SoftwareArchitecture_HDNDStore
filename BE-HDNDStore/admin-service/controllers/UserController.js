const User = require("../models/User");

//Tạo User
const createUser = async (req, res) => {
  try {
    const { fullName, email, phone, } = req.body;

    // Lấy ID lớn nhất và chuyển thành số
    const lastUser = await User.findOne().sort({ id: -1 });
    const newId = lastUser ? Number(lastUser.id) + 1 : 1; // Chuyển id thành số trước khi tăng

    // Tạo khách hàng mới
    const newUser = new User({ id: newId.toString(), fullName, email, phone });

    await newUser.save();

    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật thông tin User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const { fullName, email, phone, gender, address, birthday } = req.body;

    // Kiểm tra nếu không có id
    if (!id) {
      return res.status(400).json({ message: "Thiếu ID người dùng." });
    }

    // Tìm và cập nhật user dựa trên id (chuỗi)
    const updatedUser = await User.findOneAndUpdate(
      { id }, // Tìm theo id từ params
      { fullName, email, phone, gender, address, birthday },
      { new: true } // Trả về dữ liệu mới sau khi cập nhật
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng." });
    }

    res.status(200).json({ message: "Cập nhật thành công!", user: updatedUser });
  } catch (error) {
    console.error("Lỗi khi cập nhật User:", error);
    res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại." });
  }
};


// Lấy danh sách User
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const filteredUsers = users.filter(user => user.role !== 'admin'); // Lọc bỏ admin

    if (!filteredUsers || filteredUsers.length === 0) {
      return res.status(404).json({ message: "Không có khách hàng nào." });
    }

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khách hàng:", error);
    res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại sau." });
  }
};

// Xóa User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ route

    // Tìm và xóa user dựa trên id (chuỗi)
    const deletedUser = await User.findOneAndDelete({ id });

    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    res.status(200).json({ message: "Xóa người dùng thành công!", user: deletedUser });
  } catch (error) {
    console.error("Lỗi khi xóa User:", error);
    res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại." });
  }
};

// Kiểm tra sửa trùng email hoặc phone
const checkDuplicate = async (req, res) => {
  const { email, phone, id } = req.query;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
      id: { $ne: id }, // Loại trừ chính người dùng đang chỉnh sửa
    });

    if (existingUser) {
      return res.json({ duplicate: true });
    }
    res.json({ duplicate: false });
  } catch (err) {
    console.error("Lỗi kiểm tra trùng lặp:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

module.exports = { createUser, updateUser, getAllUsers, deleteUser, checkDuplicate };