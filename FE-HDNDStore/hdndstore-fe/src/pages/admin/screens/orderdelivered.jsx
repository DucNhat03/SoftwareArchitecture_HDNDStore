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
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  InputAdornment,
  Breadcrumbs,
  Link,
  Tooltip,
  Badge,
  Backdrop,
  CircularProgress
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Visibility,
  Dashboard,
  Receipt,
  DoneAll,
  Search,
  Close as CloseIcon,
  CalendarToday,
  Person,
  LocationOn,
  Phone,
  Email
} from "@mui/icons-material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { generateInvoicePDF } from "../../../utils/generateInvoice";
import SideBar from "../../../components/layout/admin-sideBar";

const ITEMS_PER_PAGE = 6;

const theme = createTheme({
  palette: {
    primary: { main: "#2A3F54" },
    secondary: { main: "#FF9800" },
    success: { main: "#4CAF50" },
    error: { main: "#F44336" },
    info: { main: "#03A9F4" },
    warning: { main: "#FFC107" },
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
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500
        }
      }
    }
  }
});

export default function OrderDelivered() {
  // State declarations
  const [orders, setOrders] = useState([]);
  const [status] = useState("Đã giao");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
    
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset currentPage when searchTerm or selectedDate changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedDate]);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/orders/status/${status}`);
      setOrders(response.data.orders);
      console.log("Danh sách đơn hàng:", response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng", error);
      toast.error("Không thể tải danh sách đơn hàng");
      setLoading(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/all");
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
    }
  };

  // Add customer info to orders
  const ordersWithUsers = orders.map((order) => {
    const user = users.find((user) => user._id === order.receiver);
    return {
      ...order,
      customerName: user ? user.fullName : "Không có thông tin",
      customerPhone: user ? user.phone : "Không có thông tin",
      customerEmail: user ? user.email : "Không có thông tin",
    };
  });

  // Format address
  const formatAddress = (order) => {
    const addr = order.shippingAddress.address;
    return `${addr.street}, ${addr.ward}, ${addr.district}, ${addr.city}`;
  };

  // Filter orders by searchTerm and selectedDate
  const filteredOrders = ordersWithUsers.filter((order) => {
    const matchesSearch =
      order.statusPayment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.idHoaDon?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      !selectedDate ||
      dayjs(order.orderDate).format("YYYY-MM-DD") === dayjs(selectedDate).format("YYYY-MM-DD") ||
      dayjs(order.ngayXacNhan).format("YYYY-MM-DD") === dayjs(selectedDate).format("YYYY-MM-DD") ||
      dayjs(order.ngayNhanHang).format("YYYY-MM-DD") === dayjs(selectedDate).format("YYYY-MM-DD");

    return matchesSearch && matchesDate;
  });

  // Calculate pagination
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Handle view order details
  const handleViewOrder = (order) => {
    setSelectedOrderDetails(order);
    setViewOpen(true);
  };

  // Calculate total orders and filtered count
  const totalOrders = orders.length;
  const filteredCount = filteredOrders.length;

  // Render payment status chip
  const renderPaymentStatusChip = (paymentStatus) => {
    if (paymentStatus === "Đã thanh toán") {
      return (
        <Chip 
          label="Đã thanh toán" 
          color="success" 
          size="small" 
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      );
    } else {
      return (
        <Chip 
          label="Chưa thanh toán" 
          color="warning" 
          size="small" 
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      );
    }
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
      
      <Backdrop open={loading} sx={{ zIndex: 1300, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      
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
                  <b>ĐƠN HÀNG ĐÃ GIAO</b>
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
                  <Link 
                    underline="hover" 
                    color="inherit" 
                    href="/admin/orders"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Receipt sx={{ mr: 0.5 }} fontSize="small" />
                    Quản lý đơn hàng
                  </Link>
                  <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <DoneAll sx={{ mr: 0.5 }} fontSize="small" />
                    Đơn hàng đã giao
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
                    Tổng số: {filteredCount} đơn hàng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quản lý đơn hàng đã giao thành công đến khách hàng
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <TextField
                      variant="outlined"
                      placeholder="Tìm kiếm đơn hàng..."
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
                    
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Lọc theo ngày"
                        value={selectedDate}
                        onChange={(newValue) => {
                          setSelectedDate(newValue);
                        }}
                        slotProps={{
                          textField: { 
                            size: "small",
                            sx: {
                              width: 150,
                              backgroundColor: "#fff",
                              borderRadius: 2,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              }
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                    
                    {selectedDate && (
                      <Button 
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedDate(null)}
                        sx={{ borderRadius: 2 }}
                      >
                        Xóa bộ lọc
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Ngày đặt</TableCell>
                    <TableCell>Ngày xác nhận</TableCell>
                    <TableCell>Ngày giao hàng</TableCell>
                    <TableCell>Thanh toán</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedOrders.length > 0 ? (
                    paginatedOrders.map((order) => (
                      <TableRow
                        key={order.idHoaDon}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleViewOrder(order)}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            #{order.idHoaDon}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Person color="action" sx={{ mr: 1, fontSize: 20 }} />
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {order.shippingAddress.fullName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {order.shippingAddress.phone}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            badgeContent={
                              order.cartItems.reduce(
                                (total, item) => total + item.variants.length,
                                0
                              )
                            } 
                            color="info" 
                            sx={{ '& .MuiBadge-badge': { fontWeight: 500 } }}
                          >
                            <Typography variant="body2">sản phẩm</Typography>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {new Date(order.ngayXacNhan).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {new Date(order.ngayNhanHang).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {renderPaymentStatusChip(order.statusPayment)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={<DoneAll fontSize="small" />}
                            label={order.status}
                            color="success"
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Xem chi tiết">
                              <IconButton
                                color="info"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOrder(order);
                                }}
                                size="small"
                                sx={{ 
                                  bgcolor: alpha('#03A9F4', 0.08),
                                  '&:hover': { bgcolor: alpha('#03A9F4', 0.15) }
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Box sx={{ py: 3 }}>
                          <Typography variant="body1" color="text.secondary">
                            Không tìm thấy đơn hàng nào
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider' 
            }}>
              <Typography variant="body2" color="text.secondary">
                Hiển thị {filteredCount > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredCount)} trên tổng số {filteredCount} đơn hàng
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
                  disabled={startIndex + ITEMS_PER_PAGE >= filteredCount}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  sx={{ ml: 1 }}
                  size="small"
                >
                  <ArrowForward fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Order Details Dialog */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e0e0e0', 
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">
            Chi tiết đơn hàng #{selectedOrderDetails?.idHoaDon}
          </Typography>
          <IconButton onClick={() => setViewOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {selectedOrderDetails && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Thông tin khách hàng
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', mb: 1.5 }}>
                          <Person sx={{ color: 'text.secondary', mr: 2 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">Họ tên</Typography>
                            <Typography variant="body1">{selectedOrderDetails.shippingAddress.fullName}</Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', mb: 1.5 }}>
                          <Phone sx={{ color: 'text.secondary', mr: 2 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">Số điện thoại</Typography>
                            <Typography variant="body1">{selectedOrderDetails.shippingAddress.phone}</Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', mb: 1.5 }}>
                          <LocationOn sx={{ color: 'text.secondary', mr: 2 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">Địa chỉ giao hàng</Typography>
                            <Typography variant="body1">{formatAddress(selectedOrderDetails)}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Chi tiết thanh toán
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Phương thức thanh toán</Typography>
                            <Typography variant="body1">
                              {selectedOrderDetails.paymentMethod}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Trạng thái thanh toán</Typography>
                            <Typography variant="body1">
                              {renderPaymentStatusChip(selectedOrderDetails.statusPayment)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Tổng tiền sản phẩm</Typography>
                            <Typography variant="body1">
                              {parseInt(selectedOrderDetails.totalAmount || 0).toLocaleString('vi-VN')}đ
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Phí giao hàng</Typography>
                            <Typography variant="body1">
                              {parseInt(selectedOrderDetails.shippingFee || 0).toLocaleString('vi-VN')}đ
                            </Typography>
                          </Grid>
                        </Grid>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" fontWeight="bold">Tổng thanh toán</Typography>
                          <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                            {parseInt(selectedOrderDetails.finalAmount || 0).toLocaleString('vi-VN')}đ
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Thông tin đơn hàng
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Mã đơn hàng</Typography>
                            <Typography variant="body1">#{selectedOrderDetails.idHoaDon}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Trạng thái</Typography>
                            <Chip 
                              icon={<DoneAll fontSize="small" />}
                              label={selectedOrderDetails.status}
                              color="success"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Ngày đặt hàng</Typography>
                            <Typography variant="body1">
                              {new Date(selectedOrderDetails.orderDate).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Ngày xác nhận</Typography>
                            <Typography variant="body1">
                              {new Date(selectedOrderDetails.ngayXacNhan).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Ngày giao hàng</Typography>
                            <Typography variant="body1">
                              {new Date(selectedOrderDetails.ngayNhanHang).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Ghi chú
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {selectedOrderDetails.note || "Không có ghi chú"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Danh sách sản phẩm
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                    <TableRow>
                      <TableCell>Hình ảnh</TableCell>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell align="center">Số lượng</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Màu sắc</TableCell>
                      <TableCell align="right">Đơn giá</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrderDetails.cartItems.map((item, index) =>
                      item.variants.map((variant, variantIndex) => (
                        <TableRow key={`${index}-${variantIndex}`}>
                          {/* Hình ảnh sản phẩm */}
                          <TableCell>
                            <Box
                              component="img"
                              src={
                                item.imagethum?.[0] ||
                                item.image?.[0] ||
                                "https://via.placeholder.com/50"
                              }
                              alt={item.name}
                              sx={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 1,
                                border: "1px solid #e0e0e0"
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {item.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{variant.stock}</TableCell>
                          <TableCell>{variant.size || "Không có"}</TableCell>
                          <TableCell>{variant.color || "Không có"}</TableCell>
                          <TableCell align="right">
                            {parseInt(item.price).toLocaleString('vi-VN')}đ
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="medium">
                              {parseInt(item.price * variant.stock).toLocaleString('vi-VN')}đ
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    
                    <TableRow>
                      <TableCell colSpan={5} />
                      <TableCell align="right">
                        <Typography variant="subtitle2">Tổng tiền sản phẩm:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">
                          {parseInt(selectedOrderDetails.totalAmount || 0).toLocaleString('vi-VN')}đ
                        </Typography>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={5} />
                      <TableCell align="right">
                        <Typography variant="subtitle2">Phí giao hàng:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">
                          {parseInt(selectedOrderDetails.shippingFee || 0).toLocaleString('vi-VN')}đ
                        </Typography>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={5} />
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          Tổng thanh toán:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                          {parseInt(selectedOrderDetails.finalAmount || 0).toLocaleString('vi-VN')}đ
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', px: 3, py: 2 }}>
          <Button 
            onClick={() => setViewOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Đóng
          </Button>
          <Button
            onClick={async () => {
              try {
                await generateInvoicePDF(selectedOrderDetails);
                toast.success("Xuất hóa đơn thành công!");
                setViewOpen(false);
              } catch (error) {
                console.error("Lỗi khi xuất hóa đơn:", error);
                toast.error("Không thể xuất hóa đơn");
              }
            }}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Xuất hóa đơn PDF
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}