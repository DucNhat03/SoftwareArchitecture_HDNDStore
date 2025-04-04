import { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import SideBar from '../../../components/layout/admin-sideBar';
const ITEMS_PER_PAGE = 6;


const theme = createTheme({
  palette: {
    primary: { main: "#504c4c" },
    secondary: { main: "#FF9800" },
    success: { main: "#4CAF50" },
    error: { main: "#F44336" },
  },
});

export default function User() { 
  const [Users, setUsers] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    address: { city: "", district: "", ward: "", street: "" },
    birthday: { day: "", month: "", year: "" },
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [UserToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderOfUser, setOrderOfUser] = useState([]);
  const [page, setPage] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/users/all")
      .then((response) => {
        setUsers(response.data);
        console.log("Danh sách khách hàng:", response.data);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách khách hàng:", error)
      );
    console.log(Users);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:5000/orders/all")
      .then((response) => {
        setOrders(response.data.orders);
        console.log("Danh sách hóa đơn:", response.data.orders);
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách hóa đơn:", error));
  }, []);

  const [currentPage, setCurrentPage] = useState(0);

  // Reset currentPage về 0 khi searchTerm thay đổi
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  // Lọc đơn hàng theo từ khóa tìm kiếm
  const filteredUsers = Users.slice()
    .reverse()
    .filter(
      (User) =>
        User.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        User.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        User.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        User.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        User.address.district
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        User.address.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
        User.address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        User.gender.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Xác định danh sách hóa đơn cần hiển thị
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // const handleDeleteConfirm = (User) => {
  //   setUserToDelete(User);
  //   setDeleteOpen(true);
  // };

  const handleDeleteUser = () => {
    axios
      .delete(`http://localhost:5000/users/delete/${UserToDelete.id}`)
      .then(() => {
        setUsers(Users.filter((c) => c.id !== UserToDelete.id));
        toast.success("Xóa thành công!");
        setDeleteOpen(false);
        setUserToDelete(null);
      })
      .catch((error) => console.error("Lỗi khi xóa khách hàng:", error));
  };
  const handleViewUser = (User) => {
    setSelectedUserDetails(User);
    console.log("Chi tiết khách hàng:", selectedUserDetails);
    console.log("Danh sách hóa đơn:", orders);
    setOrderOfUser(
      orders.filter((order) => order.receiver === selectedUserDetails._id)
    );
    setViewOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setAddOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = () => {
    if (!selectedUser) return;

    // Kiểm tra email và số điện thoại trùng lặp
    axios
      .get(`http://localhost:5000/users/check-duplicate`, {
        params: {
          email: selectedUser.email,
          phone: selectedUser.phone,
          id: selectedUser.id,
        },
      })
      .then((res) => {
        if (res.data.duplicate) {
          toast.error("Email hoặc số điện thoại đã tồn tại!");
          return;
        }

        // Nếu không trùng, tiến hành cập nhật
        axios
          .put(
            `http://localhost:5000/users/update/${selectedUser.id}`,
            selectedUser
          )
          .then(() => axios.get("http://localhost:5000/users/all")) // Lấy danh sách mới
          .then((response) => {
            toast.success("Cập nhật thành công!");
            setUsers(response.data); // Cập nhật danh sách khách hàng
            handleClose();
          })
          .catch((error) =>
            console.error("Lỗi khi cập nhật khách hàng:", error)
          );
      })
      .catch((error) => console.error("Lỗi khi kiểm tra trùng lặp:", error));
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("token"); // Xóa token khỏi localStorage
  //   localStorage.removeItem("userId"); // Xóa User khỏi localStorage
  //   navigate("/auth"); 
  // };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box
        sx={{ display: "flex", backgroundColor: "#e9ecec", minHeight: "100vh" }}
      >
        <CssBaseline />

        <SideBar />

        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <AppBar
            position="static"
            sx={{ backgroundColor: "#2A3F54", color: "#fff" }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5">
                <b>QUẢN LÝ KHÁCH HÀNG</b>
              </Typography>
              <Typography variant="body1" style={{ color: "#fff" }}>
                {currentTime.toLocaleDateString()} -{" "}
                {currentTime.toLocaleTimeString()}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 2 }}
          >
            <TextField
              variant="outlined"
              placeholder="🔍 Tìm kiếm khách hàng ..."
              size="small"
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                width: "300px",
                boxShadow: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#888",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#504c4c",
                  },
                },
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: 3,
              mt: 3,
              backgroundColor: "#f0f0f0",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#2A3F54" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    fullName
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Gender
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Birthday
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Phone
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Address
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((User) => (
                  <TableRow
                    key={User.id}
                    hover
                    sx={{ cursor: "pointer" }} // 🟢 Biến hàng thành nút
                    onClick={() => handleViewUser(User)} // 🟢 Nhấn vào hàng để xem sản phẩm
                  >
                    <TableCell>{User.id}</TableCell>
                    <TableCell>{User.fullName}</TableCell>
                    <TableCell>{User.gender}</TableCell>
                    <TableCell>
                      {User.birthday?.day &&
                      User.birthday?.month &&
                      User.birthday?.year
                        ? `${User.birthday.day}/${User.birthday.month}/${User.birthday.year}`
                        : ""}
                    </TableCell>
                    <TableCell>{User.phone}</TableCell>
                    <TableCell>{User.email}</TableCell>
                    <TableCell>
                      {User.address?.street ||
                      User.address?.ward ||
                      User.address?.district ||
                      User.address?.city
                        ? `${User.address.street || ""} ${
                            User.address.ward || ""
                          } ${User.address.district || ""} ${
                            User.address.city || ""
                          }`
                        : ""}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="info"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewUser(User);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      {/* <IconButton
                        color="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(User);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConfirm(User);
                        }}
                      >
                        <Delete />
                      </IconButton> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "10px 0",
              }}
            >
              <IconButton
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
                sx={{ mx: 1 }}
              >
                <ArrowBack /> {/* Icon Trang Trước */}
              </IconButton>

              <IconButton
                disabled={startIndex + ITEMS_PER_PAGE >= filteredUsers.length}
                onClick={() => setCurrentPage(currentPage + 1)}
                sx={{ mx: 1 }}
              >
                <ArrowForward /> {/* Icon Trang Sau */}
              </IconButton>
            </div>
          </TableContainer>
        </Box>
      </Box>

      <Dialog open={editOpen || addOpen} onClose={handleClose}>
        <DialogTitle>
          {selectedUser ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name"
            fullWidth
            value={selectedUser ? selectedUser.fullName : newUser.fullName}
            onChange={(e) => {
              selectedUser
                ? setSelectedUser({ ...selectedUser, fullName: e.target.value })
                : setNewUser({ ...newUser, fullName: e.target.value });
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Gender</InputLabel>
            <Select
              value={selectedUser ? selectedUser.gender : newUser.gender}
              onChange={(e) => {
                selectedUser
                  ? setSelectedUser({ ...selectedUser, gender: e.target.value })
                  : setNewUser({ ...newUser, gender: e.target.value });
              }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Orther">Orther</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={selectedUser ? selectedUser.phone : newUser.phone}
            onChange={(e) => {
              selectedUser
                ? setSelectedUser({ ...selectedUser, phone: e.target.value })
                : setNewUser({ ...newUser, phone: e.target.value });
            }}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={selectedUser ? selectedUser.email : newUser.email}
            onChange={(e) => {
              selectedUser
                ? setSelectedUser({ ...selectedUser, email: e.target.value })
                : setNewUser({ ...newUser, email: e.target.value });
            }}
          />
          <TextField
            margin="dense"
            label="Birthday"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={
              selectedUser
                ? `${
                    selectedUser.birthday.year
                  }-${selectedUser.birthday.month.padStart(
                    2,
                    "0"
                  )}-${selectedUser.birthday.day.padStart(2, "0")}`
                : `${newUser.birthday.year}-${newUser.birthday.month.padStart(
                    2,
                    "0"
                  )}-${newUser.birthday.day.padStart(2, "0")}`
            }
            onChange={(e) => {
              const [year, month, day] = e.target.value.split("-");
              if (selectedUser) {
                setSelectedUser({
                  ...selectedUser,
                  birthday: { day, month, year },
                });
              } else {
                setNewUser({
                  ...newUser,
                  birthday: { day, month, year },
                });
              }
            }}
          />
          <TextField
            margin="dense"
            label="City"
            fullWidth
            value={
              selectedUser ? selectedUser.address.city : newUser.address.city
            }
            onChange={(e) => {
              selectedUser
                ? setSelectedUser({
                    ...selectedUser,
                    address: { ...selectedUser.address, city: e.target.value },
                  })
                : setNewUser({
                    ...newUser,
                    address: { ...newUser.address, city: e.target.value },
                  });
            }}
          />

          <TextField
            margin="dense"
            label="District"
            fullWidth
            value={
              selectedUser
                ? selectedUser.address.district
                : newUser.address.district
            }
            onChange={(e) => {
              selectedUser
                ? setSelectedUser({
                    ...selectedUser,
                    address: {
                      ...selectedUser.address,
                      district: e.target.value,
                    },
                  })
                : setNewUser({
                    ...newUser,
                    address: { ...newUser.address, district: e.target.value },
                  });
            }}
          />

          <TextField
            margin="dense"
            label="Ward"
            fullWidth
            value={
              selectedUser ? selectedUser.address.ward : newUser.address.ward
            }
            onChange={(e) => {
              selectedUser
                ? setSelectedUser({
                    ...selectedUser,
                    address: { ...selectedUser.address, ward: e.target.value },
                  })
                : setNewUser({
                    ...newUser,
                    address: { ...newUser.address, ward: e.target.value },
                  });
            }}
          />

          <TextField
            margin="dense"
            label="Street"
            fullWidth
            value={
              selectedUser
                ? selectedUser.address.street
                : newUser.address.street
            }
            onChange={(e) => {
              selectedUser
                ? setSelectedUser({
                    ...selectedUser,
                    address: {
                      ...selectedUser.address,
                      street: e.target.value,
                    },
                  })
                : setNewUser({
                    ...newUser,
                    address: { ...newUser.address, street: e.target.value },
                  });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Hủy
          </Button>
          <Button onClick={handleSaveUser} color="primary">
            {selectedUser ? "Lưu" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa khách hàng <b>{UserToDelete?.fullName}</b>{" "}
            không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteUser} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        maxWidth="md" // Điều chỉnh kích thước, có thể là "sm", "md", "lg", "xl"
        fullWidth
      >
        <DialogTitle>Thông tin khách hàng</DialogTitle>
        <DialogContent>
          {selectedUserDetails && (
            <Box>
              <Typography>
                <b>FullName:</b> {selectedUserDetails.fullName}
              </Typography>
              <Typography>
                <b>SĐT:</b> {selectedUserDetails.phone}
              </Typography>
              <Typography>
                <b>Email:</b> {selectedUserDetails.email}
              </Typography>
              <Typography>
                <b>Address:</b>{" "}
                {selectedUserDetails.address
                  ? `${selectedUserDetails.address.street} ${selectedUserDetails.address.ward} ${selectedUserDetails.address.district} ${selectedUserDetails.address.city}`
                  : "Chưa cập nhật"}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Ordered:
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#2A3F54" }}>
                    <TableRow>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Mã ĐH
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Sản phẩm
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Ngày đặt hàng
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Ngày nhận hàng
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        PT Thanh Toán
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        TT Thanh Toán
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Trạng Thái
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Tổng Tiền
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderOfUser.length > 0 ? (
                      orderOfUser.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>{order.idHoaDon}</TableCell>
                          <TableCell>
                            {order.cartItems.map((item) => (
                              <div key={item._id}>
                                {item.name} -{" "}
                                {item.variants
                                  .map(
                                    (v) => `${v.color}/${v.size} SL: ${v.stock}`
                                  )
                                  .join(", ")}{" "}
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {order.ngayNhanHang
                              ? new Date(
                                  order.ngayNhanHang
                                ).toLocaleDateString()
                              : "Chưa nhận hàng"}
                          </TableCell>
                          <TableCell>{order.paymentMethod}</TableCell>
                          <TableCell>{order.statusPayment}</TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell>{order.finalAmount} đ</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Không có hóa đơn nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5]}
                  component="div"
                  count={orderOfUser.length}
                  rowsPerPage={ITEMS_PER_PAGE}
                  page={page}
                  onPageChange={handleChangePage}
                />
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
