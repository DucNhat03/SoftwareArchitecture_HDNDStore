import { useState, useEffect} from "react";
import {
  Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, AppBar, Toolbar, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { Dashboard, People, AccountCircle, ShoppingCart, Receipt, BarChart, Settings, Edit, Delete, Logout, AddCircle } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import giay from "../../../assets/images/giay01.jpg";
import { Visibility } from "@mui/icons-material";

const drawerWidth = 260;

const theme = createTheme({
  palette: {
    primary: { main: "#504c4c" },
    secondary: { main: "#FF9800" },
    success: { main: "#4CAF50" },
    error: { main: "#F44336" },
  },
});

const initialOrders = [
  {id:1, idSanPham: 1, idKhachHang: 1, soLuong: 1, gia: 1000000, ngayDat: "2021-12-12", trangThai: "Chờ xác nhận", diaChiGiao: "123 Điện Biên Phủ, Quận 1, TP.HCM", ghiChu: "Giao hàng giờ hành chính" },
];

export default function Order() {
  const [Orders, setOrders] = useState(initialOrders);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({ name: "", price: 0, quantity: 0, color: "", description: "", image: "" });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [OrderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editStatusOpen, setEditStatusOpen] = useState(false);
const [selectedStatusOrder, setSelectedStatusOrder] = useState(null);
const [newStatus, setNewStatus] = useState("");
const [viewOpen, setViewOpen] = useState(false);
const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);
  return () => clearInterval(timer);
}, []);


  const handleDeleteConfirm = (Order) => {
  setOrderToDelete(Order);
  setDeleteOpen(true);
};
const handleViewOrder = (Order) => {
    setSelectedOrderDetails(Order);
    setViewOpen(true);
  };

const handleDeleteOrder = () => {
  setOrders(Orders.filter(acc => acc.id !== OrderToDelete.id));
  setDeleteOpen(false);
  setOrderToDelete(null);
};


  const handleEdit = (Order) => {
    setSelectedOrder(Order);
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setAddOpen(false);
    setSelectedOrder(null);
  };
  const handleEditStatus = (Order) => {
    setSelectedStatusOrder(Order);
    
    // Xác định danh sách trạng thái hợp lệ
    let validStatuses = [];
    if (Order.trangThai === "Chờ xác nhận") {
      validStatuses = ["Đang vận chuyển", "Đã hủy"];
    } else if (Order.trangThai === "Đang vận chuyển") {
      validStatuses = ["Đã giao"];
    }
  
    setNewStatus(validStatuses[0] || ""); // Mặc định chọn trạng thái đầu tiên
    setEditStatusOpen(true);
  };
  const handleSaveStatus = () => {
    setOrders(Orders.map(order =>
      order.id === selectedStatusOrder.id ? { ...order, trangThai: newStatus } : order
    ));
    setEditStatusOpen(false);
  };
    

  const handleSaveOrder = () => {
    if (selectedOrder) {
      setOrders(Orders.map(acc => acc.id === selectedOrder.id ? { ...selectedOrder } : acc));
    } else {
      setOrders([...Orders, { id: Orders.length + 1, ...newOrder }]);
    }
    handleClose();
  };
  

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", backgroundColor: "#e9ecec", minHeight: "100vh" }}>
        
        <CssBaseline />

        <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, backgroundColor: "#a7adad", color: "#fff" } }}>
          <Toolbar>
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>DuyNgayXua</Typography>
              <IconButton color="error" sx={{ mt: 1 }}>
                <Logout />
              </IconButton>
            </Box>
          </Toolbar>
          <List>
            {[
              { text: "Bảng điều khiển", icon: <Dashboard />, path: "/" },
              { text: "Quản lý khách hàng", icon: <People />, path: "/customers" },
              { text: "Quản lý tài khoản", icon: <AccountCircle />, path: "/accounts" },
              { text: "Quản lý sản phẩm", icon: <ShoppingCart />, path: "/products" },
              { text: "Quản lý đơn hàng", icon: <Receipt />, path: "/orders" },
              { text: "Báo cáo doanh thu", icon: <BarChart />, path: "/" },
              { text: "Cài đặt hệ thống", icon: <Settings />, path: "/" },
            ].map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <AppBar position="static" sx={{ backgroundColor: "#a7adad", color: "#fff" }}>
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography variant="h6">Quản lý đơn hàng</Typography>
    <Typography variant="body1">
      {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
    </Typography>
  </Toolbar>
</AppBar>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 2 }}>
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

          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, mt: 3, backgroundColor: "#f0f0f0" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#a7adad" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Mã sản phẩm</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Mã khách hàng</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Số lượng</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Đơn giá</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Ngày đặt</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Trạng thái</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {Orders
  .filter(Order => 
    Order.trangThai.toLowerCase().includes(searchTerm.toLowerCase()) ||    
    (!isNaN(searchTerm) && Order.id.toString().includes(searchTerm))
  )
  .map((Order) => (
    <TableRow key={Order.id} hover>
      <TableCell>{Order.id}</TableCell>
      <TableCell>{Order.idSanPham}</TableCell>
        <TableCell>{Order.idKhachHang}</TableCell>
        <TableCell>{Order.soLuong}</TableCell>
      <TableCell>{Order.gia.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</TableCell>
        <TableCell>{Order.ngayDat}</TableCell>
        <TableCell>{Order.trangThai}</TableCell>  
        <TableCell>
            <IconButton color="info" onClick={() => handleViewOrder(Order)}>
                  <Visibility />
                  </IconButton>
  <IconButton color="primary" onClick={() => handleEditStatus(Order)}>
    <Edit />
  </IconButton>
</TableCell>
    </TableRow>
))}

                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <IconButton color="success" onClick={() => setAddOpen(true)}><AddCircle /></IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Dialog open={editOpen || addOpen} onClose={handleClose}>
  <DialogTitle>{selectedOrder ? "Chỉnh sửa sản phẩm" : "Thêm đơn hàng"}</DialogTitle>
  <DialogContent>
    <TextField 
      margin="dense" 
      label="Id sản phẩm"
      fullWidth 
      value={selectedOrder ? selectedOrder.idSanPham : newOrder.idSanPham} 
      onChange={(e) => {
        selectedOrder 
          ? setSelectedOrder({ ...selectedOrder, idSanPham: e.target.value }) 
          : setNewOrder({ ...newOrder, idSanPham: e.target.value });
      }} 
    />
     <TextField 
      margin="dense" 
      label="Id khách hàng"
      fullWidth 
      value={selectedOrder ? selectedOrder.idKhachHang: newOrder.idKhachHang} 
      onChange={(e) => {
        selectedOrder 
          ? setSelectedOrder({ ...selectedOrder, idKhachHang: e.target.value }) 
          : setNewOrder({ ...newOrder, idKhachHang: e.target.value });
      }} 
    />
    <TextField 
      margin="dense" 
      label="Giá (VND)" 
      fullWidth 
      value={selectedOrder ? selectedOrder.price : newOrder.price} 
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, ""); // Chỉ giữ số
        selectedOrder 
          ? setSelectedOrder({ ...selectedOrder, price: value }) 
          : setNewOrder({ ...newOrder, price: value });
      }}
    />
    <Typography variant="body2">
      Giá hiển thị: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(selectedOrder ? selectedOrder.price : newOrder.price)}
    </Typography>

    <TextField 
      margin="dense" 
      label="Số lượng" 
      fullWidth 
      value={selectedOrder ? selectedOrder.quantity : newOrder.quantity} 
      onChange={(e) => {
        selectedOrder 
          ? setSelectedOrder({ ...selectedOrder, quantity: e.target.value }) 
          : setNewOrder({ ...newOrder, quantity: e.target.value });
      }} 
    />
    <TextField 
  margin="dense" 
  label="Ngày đặt hàng" 
  fullWidth 
  type="date"
  InputLabelProps={{ shrink: true }} // Giúp label không bị che khi hiển thị ngày
  value={selectedOrder ? selectedOrder.ngayDat : newOrder.ngayDat} 
  onChange={(e) => {
    selectedOrder 
      ? setSelectedOrder({ ...selectedOrder, ngayDat: e.target.value }) 
      : setNewOrder({ ...newOrder, ngayDat: e.target.value });
  }} 
/>
<TextField 
      margin="dense" 
      label="Địa chỉ" 
      fullWidth 
      value={selectedOrder ? selectedOrder.diaChiGiao : newOrder.diaChiGiao} 
      onChange={(e) => {
        selectedOrder 
          ? setSelectedOrder({ ...selectedOrder, diaChiGiao: e.target.value }) 
          : setNewOrder({ ...newOrder, diaChiGiao: e.target.value });
      }} 
    />
    <TextField 
      margin="dense" 
      label="Ghi chú" 
      fullWidth 
      value={selectedOrder ? selectedOrder.ghiChu : newOrder.ghiChu} 
      onChange={(e) => {
        selectedOrder 
          ? setSelectedOrder({ ...selectedOrder, ghiChu: e.target.value }) 
          : setNewOrder({ ...newOrder, ghiChu: e.target.value });
      }} 
    />

  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="error">Hủy</Button>
    <Button onClick={handleSaveOrder} color="primary">{selectedOrder ? "Lưu" : "Thêm"}</Button>
  </DialogActions>
</Dialog>
<Dialog open={editStatusOpen} onClose={() => setEditStatusOpen(false)}>
  <DialogTitle>Chỉnh sửa trạng thái đơn hàng</DialogTitle>
  <DialogContent>
    <FormControl fullWidth>
      <InputLabel>Trạng thái</InputLabel>
      <Select
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
      >
        {selectedStatusOrder &&
          (selectedStatusOrder.trangThai === "Chờ xác nhận"
            ? ["Đang vận chuyển", "Đã hủy"]
            : selectedStatusOrder.trangThai === "Đang vận chuyển"
            ? ["Đã giao"]
            : []
          ).map((status) => (
            <MenuItem key={status} value={status}>{status}</MenuItem>
          ))}
      </Select>
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setEditStatusOpen(false)} color="error">Hủy</Button>
    <Button onClick={handleSaveStatus} color="primary">Lưu</Button>
  </DialogActions>
</Dialog>
<Dialog open={viewOpen} onClose={() => setViewOpen(false)}>
  <DialogTitle>Thông tin đơn hàng</DialogTitle>
  <DialogContent>
    {selectedOrderDetails && (
      <Box>
        <Typography><b>Id:</b> {selectedOrderDetails.id}</Typography>
        <Typography><b>Mã sản phẩm:</b> {selectedOrderDetails.idSanPham}</Typography>
        <Typography><b>Tên sản phẩm:</b> {selectedOrderDetails.idSanPham}</Typography>
        <Typography><b>Ảnh sản phẩm:</b> <img src={giay} alt="giay" style={{ width: 100, height: 100 }} /></Typography>
        <Typography><b>Số lượng:</b> {selectedOrderDetails.soLuong}</Typography>
        <Typography><b>Giá:</b> {selectedOrderDetails.gia.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Typography>
        <Typography><b>Mã khách hàng:</b> {selectedOrderDetails.idKhachHang}</Typography>
        <Typography><b>Tên khách hàng:</b> {selectedOrderDetails.idKhachHang}</Typography>
        <Typography><b>Ngày đặt:</b> {selectedOrderDetails.ngayDat}</Typography>
        <Typography><b>Trạng thái:</b> {selectedOrderDetails.trangThai}</Typography>
        <Typography><b>Địa chỉ giao:</b> {selectedOrderDetails.diaChiGiao}</Typography>
        <Typography><b>Ghi chú:</b> {selectedOrderDetails.ghiChu}</Typography>
      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setViewOpen(false)} color="primary">Đóng</Button>
  </DialogActions>
</Dialog>


    </ThemeProvider>
  );
}
