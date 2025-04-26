import { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  AppBar,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  InputAdornment,
  Breadcrumbs,
  Link,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import {
  Dashboard,
  Search,
  CalendarToday,
  Assessment,
  TrendingUp,
  Paid,
  Receipt,
  ArrowUpward,
  ArrowDownward,
  PieChart,
  ShowChart,
  BarChart,
  AttachMoney,
  ShoppingCart
} from "@mui/icons-material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import SideBar from '../../../components/layout/admin-sideBar';
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement,
  LineElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
);

const ITEMS_PER_PAGE = 10;

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

export default function RevenueReport() {
  const [orders, setOrders] = useState([]);
  const [analysisResults, setAnalysisResults] = useState({});
  const [revenueByDate, setRevenueByDate] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Tính các số liệu tổng hợp
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [percentIncrease, setPercentIncrease] = useState(0);

  useEffect(() => {
    fetchData();
    
    // Update current time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Fetch all necessary data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch delivered orders
      const ordersResponse = await axios.get("http://localhost:5000/orders/delivered");
      const ordersData = ordersResponse.data.orders;
      setOrders(ordersData);
      
      // Calculate total revenue and order count
      const total = ordersData.reduce((sum, order) => sum + order.finalAmount, 0);
      setTotalRevenue(total);
      setTotalOrders(ordersData.length);
      setAvgOrderValue(ordersData.length > 0 ? (total / ordersData.length) : 0);
      
      // Calculate revenue by date
      const revenueByDateObj = {};
      ordersData.forEach((order) => {
        const date = new Date(order.orderDate).toLocaleDateString('vi-VN');
        if (!revenueByDateObj[date]) {
          revenueByDateObj[date] = 0;
        }
        revenueByDateObj[date] += order.finalAmount;
      });

      const revenueArray = Object.entries(revenueByDateObj)
        .map(([date, total]) => ({ date, total }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setRevenueByDate(revenueArray);
      
      // Calculate revenue growth percentage
      if (revenueArray.length >= 2) {
        const lastIndex = revenueArray.length - 1;
        const currentRevenue = revenueArray[lastIndex].total;
        const previousRevenue = revenueArray[lastIndex - 1].total;
        const difference = currentRevenue - previousRevenue;
        const percentChange = previousRevenue > 0 ? (difference / previousRevenue) * 100 : 0;
        setPercentIncrease(percentChange);
      }

      // Fetch analysis results
      const analysisResponse = await axios.get("http://localhost:5000/orders/analysis-results");
      setAnalysisResults(analysisResponse.data || {});
      
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      toast.error("Không thể tải dữ liệu báo cáo");
      setLoading(false);
    }
  };

  // Format number as currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(amount).replace('₫', 'đ');
  };
  
  // Filter orders by search term
  const filteredOrders = orders.filter((order) =>
    order.idHoaDon?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate orders
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Prepare chart data
  const dailyOrders = analysisResults.dailyOrders || [];
  const paymentRevenue = analysisResults.paymentRevenue || [];
  const genderDistribution = analysisResults.genderDistribution || {};

  // Order count chart data
  const orderCountChartData = {
    labels: dailyOrders.map((result) => {
      const date = new Date(result.orderDate_day);
      return date.toLocaleDateString('vi-VN');
    }),
    datasets: [
      {
        label: "Số đơn hàng",
        data: dailyOrders.map((result) => result.orderCount),
        backgroundColor: alpha('#4CAF50', 0.7),
        borderColor: '#4CAF50',
        borderWidth: 1,
      },
    ],
  };

  // Payment method revenue chart data
  const paymentMethodChartData = {
    labels: paymentRevenue.map((item) => item.paymentMethod),
    datasets: [
      {
        data: paymentRevenue.map((item) => item.finalAmount),
        backgroundColor: [
          alpha('#2A3F54', 0.8),
          alpha('#FF9800', 0.8),
          alpha('#F44336', 0.8)
        ],
        borderColor: ['#2A3F54', '#FF9800', '#F44336'],
        borderWidth: 1,
      },
    ],
  };

  // Gender distribution chart data
  const genderChartData = {
    labels: Object.keys(genderDistribution),
    datasets: [
      {
        data: Object.values(genderDistribution),
        backgroundColor: [
          alpha('#03A9F4', 0.8),
          alpha('#FF9800', 0.8),
          alpha('#9C27B0', 0.8)
        ],
        borderColor: ['#03A9F4', '#FF9800', '#9C27B0'],
        borderWidth: 1,
      },
    ],
  };

  // Daily revenue chart data
  const dailyRevenueChartData = {
    labels: revenueByDate.map((item) => item.date),
    datasets: [
      {
        label: "Doanh thu",
        data: revenueByDate.map((item) => item.total),
        backgroundColor: alpha('#2A3F54', 0.2),
        borderColor: '#2A3F54',
        fill: true,
        tension: 0.4,
      },
    ],
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
                  <b>BÁO CÁO DOANH THU</b>
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
                    <Assessment sx={{ mr: 0.5 }} fontSize="small" />
                    Báo cáo doanh thu
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
          
          {/* Thẻ thống kê tổng quan */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Tổng doanh thu
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {formatCurrency(totalRevenue)}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mt: 1,
                        color: percentIncrease >= 0 ? 'success.main' : 'error.main'
                      }}>
                        {percentIncrease >= 0 ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {Math.abs(percentIncrease).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <AttachMoney fontSize="large" sx={{ color: 'primary.main' }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Số đơn hàng
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {totalOrders}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Đơn hàng đã giao
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      backgroundColor: alpha(theme.palette.success.main, 0.15),
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShoppingCart fontSize="large" sx={{ color: 'success.main' }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Giá trị trung bình
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {formatCurrency(avgOrderValue)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Trên mỗi đơn hàng
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      backgroundColor: alpha(theme.palette.info.main, 0.15),
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <TrendingUp fontSize="large" sx={{ color: 'info.main' }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Phương thức thanh toán
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {paymentRevenue.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Loại thanh toán
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      backgroundColor: alpha(theme.palette.secondary.main, 0.15),
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Paid fontSize="large" sx={{ color: 'secondary.main' }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Hàng dành cho tìm kiếm */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Assessment sx={{ color: 'primary.main', mr: 1, fontSize: 24 }} />
                    <Typography variant="h6" color="primary">
                      Báo cáo chi tiết
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Thống kê doanh thu và đơn hàng
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {/* Bảng danh sách đơn hàng */}
          <Card>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Receipt sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">Danh sách đơn hàng đã giao</Typography>
                </Box>
                <Chip 
                  label={`Tổng số: ${filteredOrders.length}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer sx={{ overflow: 'auto' }}>
                <Table>
                  <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                    <TableRow>
                      <TableCell>Mã đơn hàng</TableCell>
                      <TableCell>Người đặt</TableCell>
                      <TableCell>Ngày đặt</TableCell>
                      <TableCell>Ngày giao</TableCell>
                      <TableCell>Phương thức thanh toán</TableCell>
                      <TableCell align="right">Tổng tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedOrders.length > 0 ? (
                      paginatedOrders.map((order) => (
                        <TableRow key={order._id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              #{order.idHoaDon}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {order.shippingAddress?.fullName || "Không có thông tin"}
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
                                {new Date(order.ngayNhanHang).toLocaleDateString('vi-VN')}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={order.paymentMethod}
                              size="small"
                              color={order.paymentMethod === "Thanh toán khi nhận hàng" ? "warning" : "info"}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium" color="primary.main">
                              {formatCurrency(order.finalAmount)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
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
              
              {filteredOrders.length > ITEMS_PER_PAGE && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 2,
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider' 
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} trên tổng số {filteredOrders.length} đơn hàng
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      sx={{ mr: 1 }}
                      size="small"
                    >
                      <ArrowUpward fontSize="small" />
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
                      disabled={startIndex + ITEMS_PER_PAGE >= filteredOrders.length}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      sx={{ ml: 1 }}
                      size="small"
                    >
                      <ArrowDownward fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
          {/* Biểu đồ */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={12}>
              <Card>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ShowChart sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="h6">Doanh thu theo ngày</Typography>
                    </Box>
                    <Chip 
                      label={`${revenueByDate.length} ngày`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {revenueByDate.length > 0 ? (
                    <Box sx={{ height: 350 }}>
                      <Line 
                        data={dailyRevenueChartData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return `Doanh thu: ${formatCurrency(context.parsed.y)}`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              ticks: {
                                callback: function(value) {
                                  return formatCurrency(value);
                                }
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        Không có dữ liệu doanh thu
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={12}>
              <Grid container spacing={3} direction="column">
                <Grid item>
                  <Card>
                    <CardContent>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BarChart sx={{ color: 'success.main', mr: 1 }} />
                          <Typography variant="h6">Số đơn hàng</Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      {dailyOrders.length > 0 ? (
                        <Box sx={{ height: 180 }}>
                          <Bar 
                            data={orderCountChartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: false
                                }
                              }
                            }}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="body1" color="text.secondary">
                            Không có dữ liệu
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item>
                  <Card>
                    <CardContent>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PieChart sx={{ color: 'info.main', mr: 1 }} />
                          <Typography variant="h6">Phương thức thanh toán</Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      {paymentRevenue.length > 0 ? (
                        <Box sx={{ height: 180 }}>
                          <Pie 
                            data={paymentMethodChartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                tooltip: {
                                  callbacks: {
                                    label: function(context) {
                                      const label = context.label || '';
                                      const value = formatCurrency(context.raw);
                                      return `${label}: ${value}`;
                                    }
                                  }
                                }
                              }
                            }}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="body1" color="text.secondary">
                            Không có dữ liệu
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
          
        </Box>
      </Box>
    </ThemeProvider>
  );
}