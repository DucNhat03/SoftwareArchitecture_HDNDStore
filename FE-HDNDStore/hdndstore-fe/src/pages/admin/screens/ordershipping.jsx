import { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  FormControl,
  Collapse,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogContentText,
} from "@mui/material";
import {
  Dashboard,
  People,
  ShoppingCart,
  Receipt,
  BarChart,
  Settings,
  Logout,
  ExpandLess,
  ArrowBack,
  ArrowForward,
  ExpandMore,
  Event,
  Visibility,
  CheckCircle,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const drawerWidth = 260;
const ITEMS_PER_PAGE = 6;

const theme = createTheme({
  palette: {
    primary: { main: "#504c4c" },
    secondary: { main: "#FF9800" },
    success: { main: "#4CAF50" },
    error: { main: "#F44336" },
  },
});

export default function OrderShipping() {
  const [Orders, setOrders] = useState([]);
  const [status] = useState("Đang giao");
  const [Users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [openProducts, setOpenProducts] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Đang giao");
  const [cancelReason, setCancelReason] = useState("");
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/orders/status/${status}`)
      .then((response) => {
        setOrders(response.data.orders);
        console.log("Danh sách hóa đơn:", response.data);
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách hóa đơn", error));
    // Cập nhật thời gian mỗi giây
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/users/all")
      .then((response) => {
        console.log("Danh sách khách hàng:", response.data);
        setUsers(response.data);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách khách hàng:", error)
      );
  }, []);
  const [currentPage, setCurrentPage] = useState(0);
  const ordersWithUsers = Orders.map((order) => {
    const user = Users.find((user) => user._id === order.receiver);
    return {
      ...order,
      customerName: user ? user.fullName : "Không có thông tin",
    };
  });
  // Lọc đơn hàng theo từ khóa tìm kiếm
  const filteredOrders = ordersWithUsers.filter((order) => {
    const matchesSearch =
      order.statusPayment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.idHoaDon.toLowerCase().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      !selectedDate ||
      dayjs(order.orderDate).format("YYYY-MM-DD") ===
        dayjs(selectedDate).format("YYYY-MM-DD") ||
      !selectedDate ||
      dayjs(order.ngayXacNhan).format("YYYY-MM-DD") ===
        dayjs(selectedDate).format("YYYY-MM-DD");

    return matchesSearch && matchesDate;
  });

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  // Xác định danh sách hóa đơn cần hiển thị
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleProductsClick = () => {
    setOpenProducts(!openProducts);
  };
  const [openOrders, setOpenOrders] = useState(false);
  const handleOrdersClick = () => {
    setOpenOrders(!openOrders);
  };
  const handleViewOrder = (Order) => {
    setSelectedOrderDetails(Order);
    setViewOpen(true);
  };
  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
    setSelectedStatus("Đang giao"); // Mặc định chọn Xác nhận
    setCancelReason(""); // Reset lý do hủy
  };

  const getUserAddressById = (userId, usersList) => {
    const user = usersList.find((user) => user._id === userId);
    if (!user || !user.address) return "Không có địa chỉ";

    const { street, ward, district, city } = user.address;
    return `${street}, ${ward}, ${district}, ${city}`;
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setCancelReason("");
  };
  const handleUpdateStatus = async (order, newStatus, reason) => {
    try {
      let trangThaiThanhToan = order.statusPayment;
      console.log("Trạng thái thanh toán", order.statusPayment);
      if (
        order.statusPayment === "Chưa thanh toán" &&
        newStatus === "Đã giao"
      ) {
        trangThaiThanhToan = "Đã thanh toán";
      }
      console.log("Trạng thái thanh toán", trangThaiThanhToan);
      await axios.put(`http://localhost:5000/orders/update/${order.idHoaDon}`, {
        status: newStatus,
        lyDoHuy: newStatus === "Đã hủy" ? reason : "",
        ngayNhanHang: newStatus === "Đã giao" ? new Date().toISOString() : null,
        ngayHuy: newStatus === "Đã hủy" ? new Date().toISOString() : null,
        statusPayment: trangThaiThanhToan,
      });
      if (newStatus === "Đã hủy") {
        toast.error(`Đã hủy đơn hàng ${order.idHoaDon}`);
      } else {
        toast.success(`Đã xác nhận đơn hàng ${order.idHoaDon}`);
      }
      const response = await axios.get(
        `http://localhost:5000/orders/status/${status}`
      );
      setOrders(response.data.orders);
      handleClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box
        sx={{ display: "flex", backgroundColor: "#e9ecec", minHeight: "100vh" }}
      >
        <CssBaseline />

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#a7adad",
              color: "#fff",
            },
          }}
        >
          <Toolbar>
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                DuyNgayXua
              </Typography>
              <IconButton color="error" sx={{ mt: 1 }}>
                <Logout />
              </IconButton>
            </Box>
          </Toolbar>
          <List>
            {[
              { text: "Bảng điều khiển", icon: <Dashboard />, path: "/" },
              {
                text: "Quản lý khách hàng",
                icon: <People />,
                path: "/admin/users",
              },
              {
                text: "Quản lý sản phẩm",
                icon: <ShoppingCart />,
                isParent: true,
              },
              {
                text: "Quản lý đơn hàng",
                icon: <Receipt />,
                isParent: true,
              },
              { text: "Báo cáo doanh thu", icon: <BarChart />, path: "/" },
              { text: "Cài đặt hệ thống", icon: <Settings />, path: "/" },
            ].map((item, index) => (
              <div key={index}>
                {item.isParent ? (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={
                          item.text === "Quản lý sản phẩm"
                            ? handleProductsClick
                            : handleOrdersClick
                        }
                      >
                        <ListItemIcon sx={{ color: "#fff" }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                        {item.text === "Quản lý sản phẩm" ? (
                          openProducts ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )
                        ) : openOrders ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItemButton>
                    </ListItem>
                    <Collapse
                      in={
                        item.text === "Quản lý sản phẩm"
                          ? openProducts
                          : openOrders
                      }
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {item.text === "Quản lý sản phẩm" ? (
                          <>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() => navigate("/admin/products/men")}
                              >
                                <ListItemText primary="Giày nam" />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                  navigate("/admin/products/women")
                                }
                              >
                                <ListItemText primary="Giày nữ" />
                              </ListItemButton>
                            </ListItem>
                          </>
                        ) : (
                          <>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                  navigate("/admin/orders/pending")
                                }
                              >
                                <ListItemText primary="Chờ xác nhận" />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                  navigate("/admin/orders/shipping")
                                }
                              >
                                <ListItemText primary="Đang giao" />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                  navigate("/admin/orders/delivered")
                                }
                              >
                                <ListItemText primary="Đã giao" />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                  navigate("/admin/orders/canceled")
                                }
                              >
                                <ListItemText primary="Đã hủy" />
                              </ListItemButton>
                            </ListItem>
                          </>
                        )}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate(item.path)}>
                      <ListItemIcon sx={{ color: "#fff" }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                )}
              </div>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <AppBar
            position="static"
            sx={{ backgroundColor: "#a7adad", color: "#fff" }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5">
                <b>ĐƠN HÀNG ĐANG GIAO</b>
              </Typography>
              <Typography variant="body1">
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
              placeholder="🔍 Tìm kiếm đơn hàng ..."
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
              <TableHead sx={{ backgroundColor: "#a7adad" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Khách hàng
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Số lượng sản phẩm
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Ngày đặt hàng
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <IconButton
                        color="primary"
                        onClick={() => setOpenDatePicker(true)}
                        sx={{ ml: 1 }}
                      >
                        <Event /> {/* 📅 Icon Calendar */}
                      </IconButton>
                      <DatePicker
                        open={openDatePicker}
                        onClose={() => setOpenDatePicker(false)}
                        value={selectedDate}
                        onChange={(newValue) => {
                          setSelectedDate(newValue);
                          setOpenDatePicker(false);
                        }}
                        slotProps={{
                          textField: { style: { display: "none" } },
                        }} // Ẩn ô nhập liệu
                      />
                    </LocalizationProvider>
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Ngày xác nhận
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <IconButton
                        color="primary"
                        onClick={() => setOpenDatePicker(true)}
                        sx={{ ml: 1 }}
                      >
                        <Event /> {/* 📅 Icon Calendar */}
                      </IconButton>
                      <DatePicker
                        open={openDatePicker}
                        onClose={() => setOpenDatePicker(false)}
                        value={selectedDate}
                        onChange={(newValue) => {
                          setSelectedDate(newValue);
                          setOpenDatePicker(false);
                        }}
                        slotProps={{
                          textField: { style: { display: "none" } },
                        }} // Ẩn ô nhập liệu
                      />
                    </LocalizationProvider>
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Trạng thái thanh toán
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Trạng thái đơn hàng
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((Order) => (
                  <TableRow
                    key={Order.idHoaDon}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleViewOrder(Order)}
                  >
                    <TableCell>{Order.idHoaDon}</TableCell>
                    <TableCell>{Order.customerName}</TableCell>
                    <TableCell>
                      {Order.cartItems.reduce(
                        (total, item) => total + item.variants.length,
                        0
                      )}
                    </TableCell>

                    <TableCell>
                      {new Date(Order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(Order.ngayXacNhan).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{Order.statusPayment}</TableCell>
                    <TableCell>{Order.status}</TableCell>
                    <TableCell>
                      <IconButton
                        color="info"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrder(Order);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(Order);
                        }}
                      >
                        <CheckCircle />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Buttons */}
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
                disabled={startIndex + ITEMS_PER_PAGE >= filteredOrders.length}
                onClick={() => setCurrentPage(currentPage + 1)}
                sx={{ mx: 1 }}
              >
                <ArrowForward /> {/* Icon Trang Sau */}
              </IconButton>
            </div>
          </TableContainer>
        </Box>
      </Box>

      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle variant="h6">Thông tin đơn hàng</DialogTitle>
        <DialogContent>
          {selectedOrderDetails && (
            <Box>
              <Typography variant="body1">
                <b>ID đơn hàng:</b> {selectedOrderDetails.idHoaDon}
              </Typography>
              <Typography variant="body1">
                <b>Khách hàng:</b> {selectedOrderDetails.customerName}
              </Typography>
              <Typography variant="body1">
                <b>Ngày đặt hàng:</b>{" "}
                {new Date(selectedOrderDetails.orderDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <b>Ngày xác nhận:</b>{" "}
                {new Date(
                  selectedOrderDetails.ngayXacNhan
                ).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <b>Địa chỉ giao hàng:</b>{" "}
                {getUserAddressById(selectedOrderDetails.receiver, Users)}
              </Typography>
              <Typography variant="body1">
                <b>Sản phẩm:</b>{" "}
                {selectedOrderDetails.cartItems.reduce(
                  (total, item) => total + item.variants.length,
                  0
                )}
              </Typography>
              <Typography variant="body1">
                <b>Tổng tiền:</b> {selectedOrderDetails.finalAmount}đ
              </Typography>
              <Typography variant="body1">
                <b>Trạng thái thanh toán:</b>{" "}
                {selectedOrderDetails.statusPayment}
              </Typography>
              <Typography variant="body1">
                <b>Phương thức thanh toán:</b>{" "}
                {selectedOrderDetails.paymentMethod}
              </Typography>
              <Typography variant="body1">
                <b>Trạng thái đơn hàng:</b> {selectedOrderDetails.status}
              </Typography>
              <Typography variant="body1">
                <b>Ghi chú:</b> {selectedOrderDetails.note || "Không có"}
              </Typography>

              {/* Bảng hiển thị danh sách sản phẩm */}
              <TableContainer
                component={Paper}
                sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#a7adad" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                        Hình ảnh
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                        Tên sản phẩm
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                        Số lượng
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                        Size
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                        Màu sắc
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                        Đơn giá
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrderDetails.cartItems.map((item, index) =>
                      item.variants.map((variant, variantIndex) => (
                        <TableRow key={`${index}-${variantIndex}`}>
                          {/* Hình ảnh sản phẩm */}
                          <TableCell>
                            <img
                              src={
                                item.imagethum?.[0] ||
                                item.image?.[0] ||
                                "https://via.placeholder.com/50"
                              }
                              alt={item.name}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 5,
                              }}
                            />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{variant.stock}</TableCell>
                          <TableCell>{variant.size || "Không có"}</TableCell>
                          <TableCell>{variant.color || "Không có"}</TableCell>
                          <TableCell>{item.price * variant.stock}đ</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
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

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Xác nhận đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xác nhận hoặc hủy đơn hàng{" "}
            <strong>{selectedOrder?.idHoaDon}</strong> không?
          </DialogContentText>

          {/* Chọn Trạng Thái */}
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <FormControlLabel
                value="Đã giao"
                control={<Radio />}
                label="Xác nhận đã giao hàng"
              />
              <FormControlLabel
                value="Đã hủy"
                control={<Radio />}
                label="Hủy đơn hàng"
              />
            </RadioGroup>
          </FormControl>

          {/* Hiển thị TextField nếu chọn "Đã hủy" */}
          {selectedStatus === "Đã hủy" && (
            <TextField
              label="Lý do hủy đơn"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Đóng
          </Button>
          <Button
            onClick={() =>
              handleUpdateStatus(selectedOrder, selectedStatus, cancelReason)
            }
            color="primary"
            disabled={selectedStatus === "Đã hủy" && !cancelReason} // Không cho xác nhận nếu chưa nhập lý do hủy
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
