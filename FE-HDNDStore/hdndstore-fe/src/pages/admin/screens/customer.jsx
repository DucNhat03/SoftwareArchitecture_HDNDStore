import { useState, useEffect} from "react";
import {
  Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, AppBar, Toolbar, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { Dashboard, People, AccountCircle, ShoppingCart, Receipt, BarChart, Settings, Edit, Delete, Logout, AddCircle } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import axios from "axios";

const drawerWidth = 260;

const theme = createTheme({
  palette: {
    primary: { main: "#504c4c" },
    secondary: { main: "#FF9800" },
    success: { main: "#4CAF50" },
    error: { main: "#F44336" },
  },
});

// const initialCustomers = [
//   {id:1, name: "Nguyễn Văn A", phone: "0123456789", email: "anc@gmail.com", address: "123 Đường ABC, Quận XYZ, TP HCM", orderspurchased : 5 , totalAmount: 5000000},
//   {id:2, name: "Nguyễn Văn B", phone: "0123456789", email: "abc@gmail.com", address: "123 Đường XYZ, Quận ABC, TP HCM", orderspurchased : 10 , totalAmount: 10000000},
// ];
// const mockOrders = [
//   { id: 101, customerId: 1, product: "iPhone 14", quantity: 1, total: 20000000 },
//   { id: 102, customerId: 1, product: "Samsung S23", quantity: 2, total: 30000000 },
//   { id: 103, customerId: 2, product: "MacBook Pro", quantity: 1, total: 45000000 },
// ];

export default function Customer() {
  const [Customers, setCustomers] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", address: "" });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [CustomerToDelete, setCustomerToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderOfCustomer, setOrderOfCustomer] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:5005/api/customers")
      .then(response => setCustomers(response.data))
      .catch(error => console.error("Lỗi khi lấy danh sách khách hàng:", error));
      console.log(Customers);
    axios.get("http://localhost:5005/api/orders")
      .then(response => setOrders(response.data))
      .catch(error => console.error("Lỗi khi lấy danh sách đơn hàng:", error));
      console.log(orders);
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);
  return () => clearInterval(timer);
}, []);

  const handleDeleteConfirm = (Customer) => {
  setCustomerToDelete(Customer);
  setDeleteOpen(true);
};

const handleDeleteCustomer = () => {
  axios.delete(`http://localhost:5005/api/customers/${CustomerToDelete.id}`)
      .then(() => {
        setCustomers(Customers.filter(c => c.id !== CustomerToDelete.id));
        setDeleteOpen(false);
        setCustomerToDelete(null);
      })
      .catch(error => console.error("Lỗi khi xóa khách hàng:", error));
};
const handleViewCustomer = (Customer) => {
  setSelectedCustomerDetails(Customer);
  setOrderOfCustomer(orders.filter(order => order.customerId === Customer.id));
  setViewOpen(true);
};

  const handleEdit = (Customer) => {
    setSelectedCustomer(Customer);
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setAddOpen(false);
    setSelectedCustomer(null);
  };


  const handleSaveCustomer = () => {
    if (selectedCustomer) {
      axios.put(`http://localhost:5005/api/customers/${selectedCustomer.id}`, selectedCustomer)
        .then(response => {
          setCustomers(Customers.map(c => (c.id === selectedCustomer.id ? response.data : c)));
          handleClose();
        })
        .catch(error => console.error("Lỗi khi cập nhật khách hàng:", error));
    } else {
      axios.post("http://localhost:5005/api/customers", newCustomer)
        .then(response => {
          setCustomers([...Customers, response.data]);
          handleClose();
        })
        .catch(error => console.error("Lỗi khi thêm khách hàng:", error));
    }
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
    <Typography variant="h6">Quản lý khách hàng</Typography>
    <Typography variant="body1">
      {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
    </Typography>
  </Toolbar>
</AppBar>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 2 }}>
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
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, mt: 3, backgroundColor: "#f0f0f0" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#a7adad" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>SDT</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Address</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {Customers
  .filter(Customer => 
    Customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Customer.sdt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Customer.diachi.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((Customer) => (
    <TableRow key={Customer.id} hover>
      <TableCell>{Customer.id}</TableCell>
      <TableCell>{Customer.name}</TableCell>
      <TableCell>{Customer.sdt}</TableCell>
      <TableCell>{Customer.email}</TableCell>
      <TableCell>{Customer.diachi}</TableCell>
      <TableCell>
      <IconButton color="info" onClick={() => handleViewCustomer(Customer)}>
      <Visibility />
      </IconButton>
        <IconButton color="secondary" onClick={() => handleEdit(Customer)}>
          <Edit />
        </IconButton>
        <IconButton color="error" onClick={() => handleDeleteConfirm(Customer)}>
          <Delete />
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
    <DialogTitle>{selectedCustomer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"}</DialogTitle>
    <DialogContent>
      <TextField 
        margin="dense" 
        label="Họ và tên"
        fullWidth 
        value={selectedCustomer ? selectedCustomer.name : newCustomer.name} 
        onChange={(e) => {
          selectedCustomer 
            ? setSelectedCustomer({ ...selectedCustomer, name: e.target.value }) 
            : setNewCustomer({ ...newCustomer, name: e.target.value });
        }} 
      />
      <TextField 
        margin="dense" 
        label="SDT" 
        fullWidth 
        value={selectedCustomer ? selectedCustomer.sdt : newCustomer.sdt} 
        onChange={(e) => {
          selectedCustomer 
            ? setSelectedCustomer({ ...selectedCustomer, sdt: e.target.value }) 
            : setNewCustomer({ ...newCustomer, sdt: e.target.value });
        }} 
      />
      <TextField 
        margin="dense" 
        label="Email" 
        fullWidth 
        value={selectedCustomer ? selectedCustomer.email : newCustomer.email} 
        onChange={(e) => {
          selectedCustomer 
            ? setSelectedCustomer({ ...selectedCustomer, email: e.target.value }) 
            : setNewCustomer({ ...newCustomer, email: e.target.value });
        }} 
      />
      <TextField 
        margin="dense" 
        label="Address" 
        fullWidth 
        value={selectedCustomer ? selectedCustomer.diachi : newCustomer.diachi} 
        onChange={(e) => {
          selectedCustomer 
            ? setSelectedCustomer({ ...selectedCustomer, diachi: e.target.value }) 
            : setNewCustomer({ ...newCustomer, diachi: e.target.value });
        }} 
      />

    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="error">Hủy</Button>
      <Button onClick={handleSaveCustomer} color="primary">{selectedCustomer ? "Lưu" : "Thêm"}</Button>
    </DialogActions>
  </Dialog>
  <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
  <DialogTitle>Xác nhận xóa</DialogTitle>
  <DialogContent>
    <Typography>Bạn có chắc chắn muốn xóa khách hàng <b>{CustomerToDelete?.name}</b> không?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteOpen(false)} color="primary">Hủy</Button>
    <Button onClick={handleDeleteCustomer} color="error">Xóa</Button>
  </DialogActions>
</Dialog>
<Dialog open={viewOpen} onClose={() => setViewOpen(false)}>
  <DialogTitle>Thông tin khách hàng</DialogTitle>
  <DialogContent>
    {selectedCustomerDetails && (
      <Box>
        <Typography><b>Họ và Tên:</b> {selectedCustomerDetails.name}</Typography>
        <Typography><b>SĐT:</b> {selectedCustomerDetails.phone}</Typography>
        <Typography><b>Email:</b> {selectedCustomerDetails.email}</Typography>
        <Typography><b>Địa chỉ:</b> {selectedCustomerDetails.address}</Typography>
        
        <Typography variant="h6" sx={{ mt: 2 }}>Đơn hàng đã mua:</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#a7adad" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Mã ĐH</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Sản phẩm</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Số lượng</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.total.toLocaleString()} VND</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
