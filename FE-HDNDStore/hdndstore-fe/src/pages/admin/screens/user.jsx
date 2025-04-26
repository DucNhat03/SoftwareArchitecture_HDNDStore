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
  Chip,
  Avatar,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
  InputAdornment,
  Tooltip,
  Badge,
  CircularProgress,
  Tabs,
  Tab,
  Breadcrumbs,
  Link
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Search,
  Visibility,
  Error,
  Check,
  Person,
  Home,
  Phone,
  Email,
  CalendarMonth,
  ShoppingBag,
  LocationOn,
  WbSunny,
  Dashboard
} from "@mui/icons-material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import SideBar from '../../../components/layout/admin-sideBar';

const ITEMS_PER_PAGE = 8;

const theme = createTheme({
  palette: {
    primary: { main: "#2A3F54" },
    secondary: { main: "#FF9800" },
    success: { main: "#4CAF50" },
    error: { main: "#F44336" },
    info: { main: "#03A9F4" },
    background: {
      default: "#f5f7fa"
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    }
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px 16px"
        },
        head: {
          fontWeight: 600,
          whiteSpace: "nowrap"
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha('#2A3F54', 0.04)
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }
      }
    }
  }
});

// Hàm định dạng tiền tệ VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Tên viết tắt
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Hàm tạo màu ngẫu nhiên cho avatar
const stringToColor = (string) => {
  if (!string) return '#2A3F54';
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

export default function User() { 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderOfUser, setOrderOfUser] = useState([]);
  const [page, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  // Tải dữ liệu khách hàng
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/users/all")
      .then((response) => {
        setUsers(response.data);
        console.log("Danh sách khách hàng:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách khách hàng:", error);
        toast.error("Không thể tải danh sách khách hàng");
        setLoading(false);
      });
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Tải dữ liệu đơn hàng
  useEffect(() => {
    axios
      .get("http://localhost:5000/orders/all")
      .then((response) => {
        setOrders(response.data.orders);
        console.log("Danh sách hóa đơn:", response.data.orders);
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách hóa đơn:", error));
  }, []);

  // Reset currentPage về 0 khi searchTerm thay đổi
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  // Lọc khách hàng theo từ khóa tìm kiếm
  const filteredUsers = users.slice()
    .reverse()
    .filter(
      (user) =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address?.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address?.ward?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address?.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.gender?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Xác định danh sách khách hàng cần hiển thị dựa trên phân trang
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Xử lý xóa khách hàng
  const handleDeleteUser = () => {
    axios
      .delete(`http://localhost:5000/users/delete/${userToDelete.id}`)
      .then(() => {
        setUsers(users.filter((c) => c.id !== userToDelete.id));
        toast.success("Xóa khách hàng thành công!");
        setDeleteOpen(false);
        setUserToDelete(null);
      })
      .catch((error) => {
        console.error("Lỗi khi xóa khách hàng:", error);
        toast.error("Không thể xóa khách hàng");
      });
  };

  // Xử lý xem chi tiết khách hàng
  const handleViewUser = (user) => {
    setSelectedUserDetails(user);
    const userOrders = orders.filter((order) => order.receiver === user._id);
    setOrderOfUser(userOrders);
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
          .then(() => axios.get("http://localhost:5000/users/all"))
          .then((response) => {
            toast.success("Cập nhật khách hàng thành công!");
            setUsers(response.data);
            handleClose();
          })
          .catch((error) => {
            console.error("Lỗi khi cập nhật khách hàng:", error);
            toast.error("Không thể cập nhật khách hàng");
          });
      })
      .catch((error) => console.error("Lỗi khi kiểm tra trùng lặp:", error));
  };

  // Render trạng thái thanh toán với chip màu
  const renderPaymentStatus = (status) => {
    if (!status) return <Chip size="small" label="Chưa xác định" />;
    
    switch(status.toLowerCase()) {
      case 'đã thanh toán':
        return <Chip size="small" color="success" icon={<Check />} label="Đã thanh toán" />;
      case 'chưa thanh toán':
        return <Chip size="small" color="warning" icon={<Error />} label="Chưa thanh toán" />;
      default:
        return <Chip size="small" label={status} />;
    }
  };

  // Render trạng thái đơn hàng với chip màu
  const renderOrderStatus = (status) => {
    if (!status) return <Chip size="small" label="Chưa xác định" />;
    
    switch(status.toLowerCase()) {
      case 'đã giao':
        return <Chip size="small" color="success" icon={<Check />} label="Đã giao" />;
      case 'đang giao':
        return <Chip size="small" color="info" label="Đang giao" />;
      case 'chờ xác nhận':
        return <Chip size="small" color="warning" label="Chờ xác nhận" />;
      case 'đã hủy':
        return <Chip size="small" color="error" label="Đã hủy" />;
      default:
        return <Chip size="small" label={status} />;
    }
  };

  // Tính tổng số đơn hàng và doanh số của khách hàng
  const getUserStats = (userId) => {
    const userOrders = orders.filter(order => order.receiver === userId);
    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => sum + (parseFloat(order.finalAmount) || 0), 0);
    
    return { totalOrders, totalSpent };
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
        <CssBaseline />
        <SideBar />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <AppBar
            position="static"
            sx={{ 
              backgroundColor: "#fff", 
              color: "text.primary",
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              mb: 3
            }}
            elevation={0}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="h5" color="primary.main">
                  <b>QUẢN LÝ KHÁCH HÀNG</b>
                </Typography>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 0.5 }}>
                  <Link 
                    underline="hover" 
                    color="inherit" 
                    href="/admin/dashboard"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Dashboard sx={{ mr: 0.5 }} fontSize="small" />
                    Dashboard
                  </Link>
                  <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 0.5 }} fontSize="small" />
                    Quản lý khách hàng
                  </Typography>
                </Breadcrumbs>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end' 
              }}>
                <Typography variant="body1" fontWeight="medium">
                  {currentTime.toLocaleDateString('vi-VN')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentTime.toLocaleTimeString('vi-VN')}
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" color="primary">
                    Tổng số: {filteredUsers.length} khách hàng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quản lý thông tin và tra cứu đơn hàng của khách hàng
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <TextField
                      variant="outlined"
                      placeholder="Tìm kiếm khách hàng..."
                      size="small"
                      fullWidth
                      sx={{
                        maxWidth: 350,
                        backgroundColor: "#fff",
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search color="action" />
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TableContainer sx={{ mb: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell width="4%">#</TableCell>
                          <TableCell width="20%">Khách hàng</TableCell>
                          <TableCell width="12%">Số điện thoại</TableCell>
                          <TableCell width="18%">Email</TableCell>
                          <TableCell width="18%">Địa chỉ</TableCell>
                          <TableCell width="16%">Thống kê</TableCell>
                          <TableCell width="12%" align="center">Thao tác</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedUsers.length > 0 ? paginatedUsers.map((user, index) => {
                          const { totalOrders, totalSpent } = getUserStats(user._id);
                          return (
                            <TableRow
                              key={user.id || index}
                              hover
                              sx={{ cursor: "pointer" }}
                            >
                              <TableCell>
                                {startIndex + index + 1}
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Avatar 
                                    sx={{ 
                                      bgcolor: stringToColor(user.fullName),
                                      width: 36,
                                      height: 36,
                                      mr: 1.5
                                    }}
                                  >
                                    {getInitials(user.fullName)}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle2" noWrap>
                                      {user.fullName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {user.gender || "Không xác định"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {user.phone || "Chưa cập nhật"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" noWrap>
                                  {user.email || "Chưa cập nhật"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ 
                                  overflow: "hidden", 
                                  textOverflow: "ellipsis", 
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}>
                                  {user.address?.street ||
                                  user.address?.ward ||
                                  user.address?.district ||
                                  user.address?.city
                                    ? `${user.address.street || ""} ${
                                        user.address.ward || ""
                                      } ${user.address.district || ""} ${
                                        user.address.city || ""
                                      }`
                                    : "Chưa cập nhật"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Stack spacing={0.5}>
                                  <Typography variant="body2">
                                    <ShoppingBag fontSize="small" sx={{ 
                                      verticalAlign: 'middle', 
                                      mr: 0.5,
                                      color: 'primary.main' 
                                    }}/> 
                                    <b>{totalOrders}</b> đơn hàng
                                  </Typography>
                                  <Typography variant="body2">
                                    <WbSunny fontSize="small" sx={{ 
                                      verticalAlign: 'middle', 
                                      mr: 0.5,
                                      color: 'secondary.main' 
                                    }}/> 
                                    <b>{formatCurrency(totalSpent)}</b>
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="center">
                                <Tooltip title="Xem chi tiết">
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleViewUser(user)}
                                    size="small"
                                    sx={{ 
                                      bgcolor: alpha('#2A3F54', 0.08),
                                      '&:hover': {
                                        bgcolor: alpha('#2A3F54', 0.15)
                                      }
                                    }}
                                  >
                                    <Visibility fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        }) : (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              <Box sx={{ py: 3 }}>
                                <Typography variant="body1" color="text.secondary">
                                  Không tìm thấy khách hàng nào
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Hiển thị {Math.min(startIndex + 1, filteredUsers.length)} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} trên tổng số {filteredUsers.length} khách hàng
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        sx={{ mr: 1 }}
                        size="small"
                      >
                        <ArrowBack fontSize="small" />
                      </IconButton>
                      
                      <Box sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                        minWidth: 30,
                        textAlign: 'center'
                      }}>
                        {currentPage + 1}
                      </Box>
                      
                      <IconButton
                        disabled={startIndex + ITEMS_PER_PAGE >= filteredUsers.length}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        sx={{ ml: 1 }}
                        size="small"
                      >
                        <ArrowForward fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Dialog hiển thị chi tiết khách hàng */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: selectedUserDetails ? stringToColor(selectedUserDetails.fullName) : 'primary.main',
                width: 40,
                height: 40,
                mr: 2
              }}
            >
              {selectedUserDetails ? getInitials(selectedUserDetails.fullName) : ""}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedUserDetails?.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mã khách hàng: #{selectedUserDetails?.id}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {selectedUserDetails && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Thông tin khách hàng
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ color: 'primary.main', mr: 1.5 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Họ và tên
                            </Typography>
                            <Typography variant="subtitle2">
                              {selectedUserDetails.fullName}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Phone sx={{ color: 'primary.main', mr: 1.5 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Số điện thoại
                            </Typography>
                            <Typography variant="subtitle2">
                              {selectedUserDetails.phone || "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email sx={{ color: 'primary.main', mr: 1.5 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Email
                            </Typography>
                            <Typography variant="subtitle2">
                              {selectedUserDetails.email || "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarMonth sx={{ color: 'primary.main', mr: 1.5 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Ngày sinh
                            </Typography>
                            <Typography variant="subtitle2">
                              {selectedUserDetails.birthday?.day &&
                              selectedUserDetails.birthday?.month &&
                              selectedUserDetails.birthday?.year
                                ? `${selectedUserDetails.birthday.day}/${selectedUserDetails.birthday.month}/${selectedUserDetails.birthday.year}`
                                : "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <LocationOn sx={{ color: 'primary.main', mr: 1.5 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Địa chỉ
                            </Typography>
                            <Typography variant="subtitle2">
                              {selectedUserDetails.address
                                ? `${selectedUserDetails.address.street || ""} ${selectedUserDetails.address.ward || ""} ${selectedUserDetails.address.district || ""} ${selectedUserDetails.address.city || ""}`
                                : "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Lịch sử mua hàng
                        </Typography>
                        
                        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="order status tabs">
                          <Tab label={`Tất cả (${orderOfUser.length})`} />
                          <Tab 
                            label={`Đã giao (${orderOfUser.filter(o => o.status === 'Đã giao').length})`} 
                            sx={{ color: 'success.main' }}
                          />
                          <Tab 
                            label={`Đang giao (${orderOfUser.filter(o => o.status === 'Đang giao').length})`}
                            sx={{ color: 'info.main' }}
                          />
                          <Tab 
                            label={`Chờ xác nhận (${orderOfUser.filter(o => o.status === 'Chờ xác nhận').length})`}
                            sx={{ color: 'warning.main' }}
                          />
                        </Tabs>
                      </Box>
                      
                      {orderOfUser.length > 0 ? (
                        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                          {orderOfUser
                            .filter(order => {
                              if (tabValue === 0) return true;
                              if (tabValue === 1) return order.status === 'Đã giao';
                              if (tabValue === 2) return order.status === 'Đang giao';
                              if (tabValue === 3) return order.status === 'Chờ xác nhận';
                              return true;
                            })
                            .map((order) => (
                              <Card 
                                key={order._id} 
                                variant="outlined" 
                                sx={{ mb: 2, borderRadius: 1 }}
                              >
                                <CardContent sx={{ p: 2 }}>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    mb: 1
                                  }}>
                                    <Typography variant="subtitle2">
                                      Mã ĐH: <b>{order.idHoaDon}</b>
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                      {renderOrderStatus(order.status)}
                                      {renderPaymentStatus(order.statusPayment)}
                                    </Box>
                                  </Box>
                                  
                                  <Divider sx={{ my: 1 }} />
                                  
                                  {order.cartItems.map((item, idx) => (
                                    <Box 
                                      key={idx} 
                                      sx={{ 
                                        py: 1, 
                                        borderBottom: idx < order.cartItems.length - 1 ? '1px dashed rgba(0,0,0,0.1)' : 'none'
                                      }}
                                    >
                                      <Typography variant="body2" fontWeight={500}>
                                        {item.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {item.variants
                                          .map(
                                            (v) => `${v.color}/${v.size} (SL: ${v.stock})`
                                          )
                                          .join(", ")}
                                      </Typography>
                                    </Box>
                                  ))}
                                  
                                  <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    mt: 2,
                                    pt: 1,
                                    borderTop: 1,
                                    borderColor: 'divider'
                                  }}>
                                    <Box>
                                      <Typography variant="caption" color="text.secondary">
                                        Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                      </Typography>
                                      <br />
                                      <Typography variant="caption" color="text.secondary">
                                        {order.ngayNhanHang
                                          ? `Ngày nhận: ${new Date(order.ngayNhanHang).toLocaleDateString('vi-VN')}`
                                          : "Chưa nhận hàng"}
                                      </Typography>
                                    </Box>
                                    
                                    <Typography variant="subtitle1" fontWeight={600} color="primary">
                                      {formatCurrency(order.finalAmount || 0)}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            ))}
                        </Box>
                      ) : (
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          py: 6
                        }}>
                          <ShoppingBag sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary">
                            Chưa có đơn hàng nào
                          </Typography>
                          <Typography variant="body2" color="text.disabled">
                            Khách hàng này chưa thực hiện giao dịch
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={() => setViewOpen(false)} 
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}