import { useState, useEffect} from "react";
import {
  Box, CssBaseline, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, AppBar, Toolbar, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { Dashboard, People, AccountCircle, ShoppingCart, Receipt, BarChart, Settings, Edit, Delete, Logout, AddCircle } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import giay from "../../../assets/images/giay01.jpg";

const drawerWidth = 260;

const theme = createTheme({
  palette: {
    primary: { main: "#504c4c" },
    secondary: { main: "#FF9800" },
    success: { main: "#4CAF50" },
    error: { main: "#F44336" },
  },
});

// const initialProducts = [
//   {id:1, name: "Giày nam", price: 100000, quantity: 10,color: "black", description: "Giày thể thao nam", image: require("../../../assets/images/giay01.jpg")},
// ];

export default function Product() {
  const [Products, setProducts] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, quantity: 0, color: "", description: "", image: "" });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [ProductToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);
  return () => clearInterval(timer);
}, []);


  const handleDeleteConfirm = (Product) => {
  setProductToDelete(Product);
  setDeleteOpen(true);
};

const handleDeleteProduct = () => {
  setProducts(Products.filter(acc => acc.id !== ProductToDelete.id));
  setDeleteOpen(false);
  setProductToDelete(null);
};


  const handleEdit = (Product) => {
    setSelectedProduct(Product);
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setAddOpen(false);
    setSelectedProduct(null);
  };


  const handleSaveProduct = () => {
    if (selectedProduct) {
      setProducts(Products.map(acc => acc.id === selectedProduct.id ? { ...selectedProduct } : acc));
    } else {
      setProducts([...Products, { id: Products.length + 1, ...newProduct }]);
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
    <Typography variant="h6">Quản lý sản phẩm</Typography>
    <Typography variant="body1">
      {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
    </Typography>
  </Toolbar>
</AppBar>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 2 }}>
  <TextField
    variant="outlined"
    placeholder="🔍 Tìm kiếm sản phẩm ..."
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
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Price</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Color</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Quantity</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Image</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {Products
  .filter(Product => 
    Product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||    
    Product.color.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((Product) => (
    <TableRow key={Product.id} hover>
      <TableCell>{Product.id}</TableCell>
      <TableCell>{Product.name}</TableCell>
      <TableCell>{Product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</TableCell>
        <TableCell>{Product.color}</TableCell>
      <TableCell>{Product.quantity}</TableCell>
      <TableCell>
      <img src={giay} style={{ width: "100px", height: "100px", borderRadius: "5px" ,objectFit: "cover"}} />
      </TableCell>
      <TableCell>
        <IconButton color="secondary" onClick={() => handleEdit(Product)}>
          <Edit />
        </IconButton>
        <IconButton color="error" onClick={() => handleDeleteConfirm(Product)}>
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
  <DialogTitle>{selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}</DialogTitle>
  <DialogContent>
    <TextField 
      margin="dense" 
      label="Tên sản phẩm" 
      fullWidth 
      value={selectedProduct ? selectedProduct.name : newProduct.name} 
      onChange={(e) => {
        selectedProduct 
          ? setSelectedProduct({ ...selectedProduct, name: e.target.value }) 
          : setNewProduct({ ...newProduct, name: e.target.value });
      }} 
    />
    <TextField 
      margin="dense" 
      label="Giá (VND)" 
      fullWidth 
      value={selectedProduct ? selectedProduct.price : newProduct.price} 
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, ""); // Chỉ giữ số
        selectedProduct 
          ? setSelectedProduct({ ...selectedProduct, price: value }) 
          : setNewProduct({ ...newProduct, price: value });
      }}
    />
    <Typography variant="body2">
      Giá hiển thị: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(selectedProduct ? selectedProduct.price : newProduct.price)}
    </Typography>

    <TextField 
      margin="dense" 
      label="Số lượng" 
      fullWidth 
      value={selectedProduct ? selectedProduct.quantity : newProduct.quantity} 
      onChange={(e) => {
        selectedProduct 
          ? setSelectedProduct({ ...selectedProduct, quantity: e.target.value }) 
          : setNewProduct({ ...newProduct, quantity: e.target.value });
      }} 
    />
    <TextField 
      margin="dense" 
      label="Màu sắc" 
      fullWidth 
      value={selectedProduct ? selectedProduct.color : newProduct.color} 
      onChange={(e) => {
        selectedProduct 
          ? setSelectedProduct({ ...selectedProduct, color: e.target.value }) 
          : setNewProduct({ ...newProduct, color: e.target.value });
      }} 
    />
    <TextField 
      margin="dense" 
      label="Mô tả" 
      fullWidth 
      value={selectedProduct ? selectedProduct.description : newProduct.description} 
      onChange={(e) => {
        selectedProduct 
          ? setSelectedProduct({ ...selectedProduct, description: e.target.value }) 
          : setNewProduct({ ...newProduct, description: e.target.value });
      }} 
    />

    {/* Hiển thị hình ảnh */}
    {selectedProduct?.image || newProduct.image ? (
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <img 
          src={selectedProduct?.image || newProduct.image} 
          alt="Giày" 
          style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "5px" }} 
        />
      </Box>
    ) : null}

    {/* Input chọn ảnh */}
    <Button variant="contained" component="label" sx={{ mt: 2 }}>
      Chọn ảnh
      <input 
        type="file" 
        hidden 
        accept="image/*" 
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const imageUrl = URL.createObjectURL(file);
            selectedProduct 
              ? setSelectedProduct({ ...selectedProduct, image: imageUrl }) 
              : setNewProduct({ ...newProduct, image: imageUrl });
          }
        }} 
      />
    </Button>

  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="error">Hủy</Button>
    <Button onClick={handleSaveProduct} color="primary">{selectedProduct ? "Lưu" : "Thêm"}</Button>
  </DialogActions>
</Dialog>

    </ThemeProvider>
  );
}
