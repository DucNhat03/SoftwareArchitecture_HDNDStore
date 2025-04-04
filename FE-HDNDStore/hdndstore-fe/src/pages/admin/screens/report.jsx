import { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import SideBar from "../../../components/layout/admin-sideBar";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ITEMS_PER_PAGE = 6;

const theme = createTheme({
  palette: {
    primary: { main: "#2A3F54" },
    secondary: { main: "#FF9800" },
  },
});

export default function RevenueReport() {
  const [orders, setOrders] = useState([]);
  const [analysisResults, setAnalysisResults] = useState({});
  const [revenueByDate, setRevenueByDate] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/orders/delivered")
      .then((response) => {
        const ordersData = response.data.orders;
        setOrders(ordersData);

        const revenueByDateObj = {};
        ordersData.forEach((order) => {
          const date = new Date(order.orderDate).toLocaleDateString();
          if (!revenueByDateObj[date]) {
            revenueByDateObj[date] = 0;
          }
          revenueByDateObj[date] += order.finalAmount;
        });

        const revenueArray = Object.entries(revenueByDateObj)
          .map(([date, total]) => ({ date, total }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setRevenueByDate(revenueArray);
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách hóa đơn:", error));

    axios
      .get("http://localhost:5000/orders/analysis-results")
      .then((response) => {
        setAnalysisResults(response.data || {});
      })
      .catch((error) => {
        console.error("Lỗi khi lấy kết quả phân tích:", error);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.idHoaDon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const dailyOrders = analysisResults.dailyOrders || [];
  const paymentRevenue = analysisResults.paymentRevenue || [];
  const genderDistribution = analysisResults.genderDistribution || {};

  const revenueData = {
    labels: dailyOrders.map((result) => result.orderDate_day),
    datasets: [
      {
        label: "Số đơn hàng theo ngày",
        data: dailyOrders.map((result) => result.orderCount),
        backgroundColor: "#2A3F54",
      },
    ],
  };

  const paymentMethodDistributionData = {
    labels: paymentRevenue.map((item) => item.paymentMethod),
    datasets: [
      {
        data: paymentRevenue.map((item) => item.finalAmount),
        backgroundColor: ["#2A3F54", "#FF9800"],
      },
    ],
  };

  const genderDistributionData = {
    labels: Object.keys(genderDistribution),
    datasets: [
      {
        data: Object.values(genderDistribution),
        backgroundColor: ["#2A3F54", "#FF9800"],
      },
    ],
  };

  const dailyRevenueChartData = {
    labels: revenueByDate.map((item) => item.date),
    datasets: [
      {
        label: "Tổng doanh thu theo ngày",
        data: revenueByDate.map((item) => item.total),
        backgroundColor: "#2A3F54",
        borderColor: "#2A3F54",
      },
    ],
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", backgroundColor: "#e9ecec", minHeight: "100vh" }}>
        <CssBaseline />
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <AppBar position="static" sx={{ backgroundColor: "#2A3F54", color: "#FFFFFF" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5">
                <b>BÁO CÁO DOANH THU</b>
              </Typography>
              <Typography variant="body1" style={{ color: "#fff" }}>
                {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 2 }}>
            <TextField
              variant="outlined"
              placeholder="🔍 Tìm kiếm mã đơn hàng..."
              size="small"
              sx={{ backgroundColor: "#fff", borderRadius: 2, width: "300px", boxShadow: 1 }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          <Grid container spacing={2}>
            {dailyOrders.length > 0 && (
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 3, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
                  <Typography variant="h6" gutterBottom>Biểu đồ số đơn hàng theo ngày</Typography>
                  <Bar data={revenueData} options={{ responsive: true }} height={200} />
                </Box>
              </Grid>
            )}

            {paymentRevenue.length > 0 && (
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 3, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
                  <Typography variant="h6" gutterBottom>Doanh thu theo phương thức thanh toán</Typography>
                  <Pie data={paymentMethodDistributionData} options={{ responsive: true }} height={200} />
                </Box>
              </Grid>
            )}

            {Object.keys(genderDistribution).length > 0 && (
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 3, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
                  <Typography variant="h6" gutterBottom>Phân phối giới tính</Typography>
                  <Pie data={genderDistributionData} options={{ responsive: true }} height={200} />
                </Box>
              </Grid>
            )}

            {revenueByDate.length > 0 && (
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 3, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
                  <Typography variant="h6" gutterBottom>Tổng doanh thu theo ngày</Typography>
                  <Bar data={dailyRevenueChartData} options={{ responsive: true }} height={200} />
                </Box>
              </Grid>
            )}
          </Grid>

          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, mt: 3, backgroundColor: "#f0f0f0" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#2A3F54" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Mã Đơn</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Ngày Đặt</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tổng Tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>{order.idHoaDon}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>{order.finalAmount} đ</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
