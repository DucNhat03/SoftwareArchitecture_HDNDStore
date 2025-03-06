import { useState, useEffect} from "react";
import {
  Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, AppBar, Toolbar, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { Dashboard, People, AccountCircle, ShoppingCart, Receipt, BarChart, Settings, Edit, Delete, Logout, AddCircle } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";


const drawerWidth = 260;

const theme = createTheme({
  palette: {
    primary: { main: "#504c4c" },
    secondary: { main: "#FF9800" },
    success: { main: "#4CAF50" },
    error: { main: "#F44336" },
  },
});

const initialAccounts = [
  { id: 1, username: "admin", role: "Admin", fullName: "Nguyễn Văn A" },
  { id: 2, username: "user", role: "User", fullName: "Nguyễn Văn B" },
];

export default function Account() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({ username: "", role: "User", fullName: "" });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();


  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);
  return () => clearInterval(timer);
}, []);


  const handleDeleteConfirm = (account) => {
  setAccountToDelete(account);
  setDeleteOpen(true);
};

const handleDeleteAccount = () => {
  setAccounts(accounts.filter(acc => acc.id !== accountToDelete.id));
  setDeleteOpen(false);
  setAccountToDelete(null);
};


  const handleEdit = (account) => {
    setSelectedAccount(account);
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setAddOpen(false);
    setSelectedAccount(null);
  };


  const handleSaveAccount = () => {
    if (selectedAccount) {
      // Cập nhật tài khoản
      setAccounts(accounts.map(acc => acc.id === selectedAccount.id ? { ...selectedAccount } : acc));
    } else {
      // Thêm mới tài khoản
      setAccounts([...accounts, { id: accounts.length + 1, ...newAccount }]);
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
    <Typography variant="h6">Quản lý tài khoản</Typography>
    <Typography variant="body1">
      {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
    </Typography>
  </Toolbar>
</AppBar>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 2 }}>
  <TextField
    variant="outlined"
    placeholder="🔍 Tìm kiếm tài khoản hoặc vai trò..."
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
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tài Khoản</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Role</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Họ và Tên</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tính năng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {accounts
  .filter(account => 
    account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.role.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((account) => (
    <TableRow key={account.id} hover>
      <TableCell>{account.id}</TableCell>
      <TableCell>{account.username}</TableCell>
      <TableCell>{account.role}</TableCell>
      <TableCell>{account.fullName}</TableCell>
      <TableCell>
        <IconButton color="secondary" onClick={() => handleEdit(account)}>
          <Edit />
        </IconButton>
        <IconButton color="error" onClick={() => handleDeleteConfirm(account)}>
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
    <DialogTitle>{selectedAccount ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}</DialogTitle>
    <DialogContent>
      <TextField 
        margin="dense" 
        label="Tài khoản" 
        fullWidth 
        value={selectedAccount ? selectedAccount.username : newAccount.username} 
        onChange={(e) => {
          selectedAccount 
            ? setSelectedAccount({ ...selectedAccount, username: e.target.value }) 
            : setNewAccount({ ...newAccount, username: e.target.value });
        }} 
      />
      <FormControl fullWidth margin="dense">
        <InputLabel>Role</InputLabel>
        <Select 
          value={selectedAccount ? selectedAccount.role : newAccount.role} 
          onChange={(e) => {
            selectedAccount 
              ? setSelectedAccount({ ...selectedAccount, role: e.target.value }) 
              : setNewAccount({ ...newAccount, role: e.target.value });
          }}
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="User">User</MenuItem>
        </Select>
      </FormControl>
      <TextField 
        margin="dense" 
        label="Họ và tên" 
        fullWidth 
        value={selectedAccount ? selectedAccount.fullName : newAccount.fullName} 
        onChange={(e) => {
          selectedAccount 
            ? setSelectedAccount({ ...selectedAccount, fullName: e.target.value }) 
            : setNewAccount({ ...newAccount, fullName: e.target.value });
        }} 
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="error">Hủy</Button>
      <Button onClick={handleSaveAccount} color="primary">{selectedAccount ? "Lưu" : "Thêm"}</Button>
    </DialogActions>
  </Dialog>
  <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
  <DialogTitle>Xác nhận xóa</DialogTitle>
  <DialogContent>
    <Typography>Bạn có chắc chắn muốn xóa tài khoản <b>{accountToDelete?.username}</b> không?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteOpen(false)} color="primary">Hủy</Button>
    <Button onClick={handleDeleteAccount} color="error">Xóa</Button>
  </DialogActions>
</Dialog>
    </ThemeProvider>
  );
}
