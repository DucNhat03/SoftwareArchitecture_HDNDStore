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
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Breadcrumbs,
  Tooltip,
  Backdrop,
  CircularProgress,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Visibility,
  ArrowForward,
  People,
  AttachMoney,
  Receipt,
  CheckCircle,
  Cancel,
  LocalShipping,
  Inventory,
  Assignment,
  ArrowUpward,
  ArrowDownward,
  ShowChart,
  CalendarToday,
  PieChart
} from "@mui/icons-material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import SideBar from '../../../components/layout/admin-sideBar';
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";

// Đăng ký các components cho Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Theme configuration
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

export default function AdminDashboard() {
  // State declarations
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    shippingOrders: 0,
    deliveredOrders: 0,
    canceledOrders: 0,
    revenueGrowth: 0,
    customerGrowth: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState({});
  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        ordersResponse,
        customersResponse,
        productsResponse,
        revenueResponse,
        topProductsResponse
      ] = await Promise.all([
        axios.get("http://localhost:5000/orders/all"),
        axios.get("http://localhost:5000/users/all"),
        axios.get("http://localhost:5000/products/all"),
        axios.get("http://localhost:5000/orders/revenue"),
        axios.get("http://localhost:5000/products/top")
      ]);

      const orders = ordersResponse.data.orders || [];
      const customers = customersResponse.data || [];
      const products = productsResponse.data || [];
      const revenueData = revenueResponse.data || [];

      // Order status distribution
      const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      // Calculate total revenue from delivered orders
      const deliveredOrders = orders.filter(order => order.status === "Đã giao");
      const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.finalAmount, 0);

      // Get recent orders (latest 5)
      const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      const recentOrdersList = sortedOrders.slice(0, 5);

      // mới có giả định nha ae
      const revenueGrowth = 12.5;  
      const customerGrowth = 8.2;   

      // Top customers by order count
      const customerOrderCounts = orders.reduce((acc, order) => {
        const customerId = order.receiver;
        acc[customerId] = (acc[customerId] || 0) + 1;
        return acc;
      }, {});

      const topCustomersList = customers
        .map(customer => ({
          id: customer._id,
          name: customer.fullName,
          email: customer.email,
          avatar: customer.avatar,
          orderCount: customerOrderCounts[customer._id] || 0,
          totalSpent: orders
            .filter(order => order.receiver === customer._id && order.status === "Đã giao")
            .reduce((sum, order) => sum + order.finalAmount, 0)
        }))
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, 5);

      // Update state with all fetched data
      setDashboardStats({
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        pendingOrders: statusCounts["Chờ xác nhận"] || 0,
        shippingOrders: statusCounts["Đang giao"] || 0,
        deliveredOrders: statusCounts["Đã giao"] || 0,
        canceledOrders: statusCounts["Đã hủy"] || 0,
        revenueGrowth,
        customerGrowth
      });

      setRevenueData(revenueData);
      setRecentOrders(recentOrdersList);
      setTopProducts(topProductsResponse.data || []);
      setOrderStatusDistribution(statusCounts);
      setTopCustomers(topCustomersList);

      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu dashboard:", error);
      toast.error("Không thể tải dữ liệu dashboard");
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(amount).replace('₫', 'đ');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Prepare chart data
  // Revenue chart data
  // này cũng đang giả định
  const revenueChartData = {
    labels: [
      'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 
      'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
    ],
    datasets: [
      {
        label: 'Doanh thu',
        data: [
          2500000, 3200000, 2800000, 4100000, 3600000, 5200000,
          4800000, 5500000, 6200000, 5800000, 7100000, 8500000
        ],
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        fill: true,
        tension: 0.4,
      }
    ]
  };

  // Order status distribution chart data
  const statusDistributionData = {
    labels: ['Chờ xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'],
    datasets: [
      {
        data: [
          dashboardStats.pendingOrders,
          dashboardStats.shippingOrders,
          dashboardStats.deliveredOrders,
          dashboardStats.canceledOrders
        ],
        backgroundColor: [
          theme.palette.warning.main,
          theme.palette.info.main,
          theme.palette.success.main,
          theme.palette.error.main
        ],
        borderColor: ['white', 'white', 'white', 'white'],
        borderWidth: 2,
      }
    ]
  };

  // Status chip renderer
  const renderStatusChip = (status) => {
    const statusConfig = {
      "Chờ xác nhận": { icon: <Assignment fontSize="small" />, color: "warning" },
      "Đang giao": { icon: <LocalShipping fontSize="small" />, color: "info" },
      "Đã giao": { icon: <CheckCircle fontSize="small" />, color: "success" },
      "Đã hủy": { icon: <Cancel fontSize="small" />, color: "error" }
    };

    const config = statusConfig[status] || { icon: null, color: "default" };
    
    return (
      <Chip
        icon={config.icon}
        label={status}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
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
                  <b>BẢNG ĐIỀU KHIỂN</b>
                </Typography>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 0.5 }}>
                  <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <DashboardIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Dashboard
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
          
          {/* Overview Statistics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Total Revenue */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Doanh thu
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {formatCurrency(dashboardStats.totalRevenue)}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mt: 1,
                        color: dashboardStats.revenueGrowth >= 0 ? 'success.main' : 'error.main'
                      }}>
                        {dashboardStats.revenueGrowth >= 0 ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {Math.abs(dashboardStats.revenueGrowth).toFixed(1)}%
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

            {/* Total Orders */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Đơn hàng
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {dashboardStats.totalOrders}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Tổng số đơn hàng
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
                      <Receipt fontSize="large" sx={{ color: 'success.main' }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Total Customers */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Khách hàng
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {dashboardStats.totalCustomers}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mt: 1,
                        color: dashboardStats.customerGrowth >= 0 ? 'success.main' : 'error.main'
                      }}>
                        {dashboardStats.customerGrowth >= 0 ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {Math.abs(dashboardStats.customerGrowth).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      backgroundColor: alpha(theme.palette.info.main, 0.15),
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <People fontSize="large" sx={{ color: 'info.main' }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Total Products */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Sản phẩm
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {dashboardStats.totalProducts}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Tổng số sản phẩm
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
                      <Inventory fontSize="large" sx={{ color: 'secondary.main' }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Order Status Statistics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Pending Orders */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Assignment sx={{ color: 'warning.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                      Chờ xác nhận
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                    {dashboardStats.pendingOrders}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Đơn hàng
                    </Typography>
                    <Button 
                      size="small" 
                      variant="text" 
                      color="inherit"
                      href="/admin/orders/pending"
                      endIcon={<ArrowForward />}
                      sx={{ fontWeight: 500 }}
                    >
                      Chi tiết
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Shipping Orders */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalShipping sx={{ color: 'info.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                      Đang giao
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                    {dashboardStats.shippingOrders}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Đơn hàng
                    </Typography>
                    <Button 
                      size="small" 
                      variant="text" 
                      color="inherit"
                      href="/admin/orders/shipping"
                      endIcon={<ArrowForward />}
                      sx={{ fontWeight: 500 }}
                    >
                      Chi tiết
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Delivered Orders */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                      Đã giao
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                    {dashboardStats.deliveredOrders}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Đơn hàng
                    </Typography>
                    <Button 
                      size="small" 
                      variant="text" 
                      color="inherit"
                      href="/admin/orders/delivered"
                      endIcon={<ArrowForward />}
                      sx={{ fontWeight: 500 }}
                    >
                      Chi tiết
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Canceled Orders */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Cancel sx={{ color: 'error.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                      Đã hủy
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                    {dashboardStats.canceledOrders}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Đơn hàng
                    </Typography>
                    <Button 
                      size="small" 
                      variant="text" 
                      color="inherit"
                      href="/admin/orders/canceled"
                      endIcon={<ArrowForward />}
                      sx={{ fontWeight: 500 }}
                    >
                      Chi tiết
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Charts and Tables */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Revenue Chart */}
            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ShowChart sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="h6">Doanh thu theo tháng</Typography>
                    </Box>
                    <Chip 
                      label={`Năm ${new Date().getFullYear()}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 350 }}>
                    <Line 
                      data={revenueChartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
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
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return formatCurrency(value);
                              }
                            }
                          },
                          x: {
                            grid: {
                              display: false
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Order Status Distribution */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PieChart sx={{ color: 'info.main', mr: 1 }} />
                      <Typography variant="h6">Trạng thái đơn hàng</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 350, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ height: 250, mb: 2 }}>
                      <Doughnut 
                        data={statusDistributionData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          },
                          cutout: '60%'
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Tổng số: {dashboardStats.totalOrders} đơn hàng
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Grid container spacing={3}>
            {/* Recent Orders */}
            <Grid item xs={12} lg={7}>
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
                      <Typography variant="h6">Đơn hàng gần đây</Typography>
                    </Box>
                    <Button 
                      size="small" 
                      variant="text"
                      href="/admin/orders/pending" 
                      endIcon={<ArrowForward />}
                      sx={{ fontWeight: 500 }}
                    >
                      Xem tất cả
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  {recentOrders.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                          <TableRow>
                            <TableCell>Mã đơn</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Ngày đặt</TableCell>
                            <TableCell align="right">Giá trị</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {recentOrders.map((order) => (
                            <TableRow key={order.idHoaDon} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  #{order.idHoaDon}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                  {order.shippingAddress?.fullName}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <CalendarToday sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2">
                                    {formatDate(order.orderDate)}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                <Typography fontWeight={500} color="primary.main">
                                  {formatCurrency(order.finalAmount)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {renderStatusChip(order.status)}
                              </TableCell>
                              <TableCell align="center">
                                <Tooltip title="Xem chi tiết">
                                  <IconButton
                                    color="info"
                                    size="small"
                                    sx={{ 
                                      bgcolor: alpha('#03A9F4', 0.08),
                                      '&:hover': { bgcolor: alpha('#03A9F4', 0.15) }
                                    }}
                                    href={`/admin/orders/${order.status === "Chờ xác nhận" ? "pending" : 
                                          order.status === "Đang giao" ? "shipping" : 
                                          order.status === "Đã giao" ? "delivered" : "canceled"}`}
                                  >
                                    <Visibility fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ py: 3, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        Không có đơn hàng nào gần đây
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Top Products & Top Customers */}
            <Grid item xs={12} lg={5}>
              <Grid container spacing={3}>
                {/* Top Products */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Inventory sx={{ color: 'secondary.main', mr: 1 }} />
                          <Typography variant="h6">Sản phẩm bán chạy</Typography>
                        </Box>
                        <Button 
                          size="small" 
                          variant="text"
                          href="/admin/products/men" 
                          endIcon={<ArrowForward />}
                          sx={{ fontWeight: 500 }}
                        >
                          Xem tất cả
                        </Button>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      
                      {topProducts.length > 0 ? (
                        <Stack spacing={2}>
                          {topProducts.slice(0, 5).map((product, index) => (
                            <Box key={product._id} sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              p: 1, 
                              borderRadius: 2,
                              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
                            }}>
                              <Box sx={{ position: 'relative', mr: 2 }}>
                                <img
                                  src={product.image[0] || "https://via.placeholder.com/50"}
                                  alt={product.name}
                                  style={{ 
                                    width: 50, 
                                    height: 50, 
                                    borderRadius: 8,
                                    objectFit: 'cover'
                                  }}
                                />
                                <Box sx={{ 
                                  position: 'absolute',
                                  top: -10,
                                  left: -10,
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 12,
                                  fontWeight: 'bold'
                                }}>
                                  {index + 1}
                                </Box>
                              </Box>
                              
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: 200 }}>
                                  {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Đã bán: {product.soldCount || 10}
                                </Typography>
                              </Box>
                              
                              <Typography variant="body2" fontWeight="medium" color="primary.main">
                                {formatCurrency(product.price)}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Box sx={{ py: 3, textAlign: 'center' }}>
                          <Typography variant="body1" color="text.secondary">
                            Không có dữ liệu sản phẩm
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Top Customers */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Card>
                    <CardContent>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <People sx={{ color: 'info.main', mr: 1 }} />
                          <Typography variant="h6">Khách hàng thân thiết</Typography>
                        </Box>
                        <Button 
                          size="small" 
                          variant="text"
                          href="/admin/users" 
                          endIcon={<ArrowForward />}
                          sx={{ fontWeight: 500 }}
                        >
                          Xem tất cả
                        </Button>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      
                      {topCustomers.length > 0 ? (
                        <Stack spacing={2}>
                          {topCustomers.map((customer, index) => (
                            <Box key={customer.id} sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              p: 1, 
                              borderRadius: 2,
                              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
                            }}>
                              <Avatar 
                                src={customer.avatar} 
                                alt={customer.name}
                                sx={{ mr: 2 }}
                              >
                                {customer.name.charAt(0)}
                              </Avatar>
                              
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight="medium">
                                  {customer.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {customer.orderCount} đơn hàng
                                </Typography>
                              </Box>
                              
                              <Typography variant="body2" fontWeight="medium" color="primary.main">
                                {formatCurrency(customer.totalSpent)}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Box sx={{ py: 3, textAlign: 'center' }}>
                          <Typography variant="body1" color="text.secondary">
                            Không có dữ liệu khách hàng
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