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
  IconButton,
  TextField,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import SideBar from '../../../components/layout/admin-sideBar';
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ITEMS_PER_PAGE = 6;

const theme = createTheme({
  palette: {
    primary: { main: "#2A3F54" },
    secondary: { main: "#FF9800" },
  },
});

export default function RevenueReport() {
  const [orders, setOrders] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/orders/all")
      .then((response) => setOrders(response.data.orders))
      .catch((error) => console.error("Lỗi khi lấy danh sách hóa đơn:", error));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredOrders = orders.filter(order => 
    order.idHoaDon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const revenueData = {
    labels: orders.map(order => new Date(order.orderDate).toLocaleDateString()),
    datasets: [
      {
        label: "Doanh thu",
        data: orders.map(order => order.finalAmount),
        backgroundColor: "#2A3F54",
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
              <Typography variant="h5"><b>BÁO CÁO DOANH THU</b></Typography>
              <Typography variant="body1">
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
          <Box sx={{ mt: 4, mb: 4, p: 3, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>Biểu đồ doanh thu</Typography>
            <Bar data={revenueData} />
          </Box>
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