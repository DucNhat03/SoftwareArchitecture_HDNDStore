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
} from "@mui/material";
import {
  Edit,
  Delete,
  AddCircle,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import SideBar from '../../../components/layout/admin-sideBar';
const theme = createTheme({
  palette: {
    primary: { main: "#504c4c" },
    secondary: { main: "#FF9800" },
    success: { main: "#4CAF50" },
    error: { main: "#F44336" },
  },
});

export default function User() {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const [vouchers, setVouchers] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newVoucher, setNewVoucher] = useState({
    name: "",
    code: "",
    discount: 0,
    start_date: new Date().toISOString().split("T")[0], // Ngày mặc định là hôm nay
    end_date: new Date().toISOString().split("T")[0],
    state: "Còn hiệu lực",
    quantity: 1,
  });


  const fetchVouchers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/vouchers");
      setVouchers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách voucher:", error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);


  // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer); // Cleanup khi unmount
  }, []);

  useEffect(() => {
    if (vouchers.length > 0) {
      updateVoucherStates();
    }
  }, [vouchers]); // Chạy lại khi danh sách voucher thay đổi


  const handleEditVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setEditOpen(true);
  };



  const handleClose = () => {
    setEditOpen(false);
    setAddOpen(false);
    setSelectedVoucher(null);
  };

  const handleSaveVoucher = async () => {
    try {
      console.log("Sending data:", newVoucher || selectedVoucher);
      if (selectedVoucher) {
        await axios.put(`http://localhost:5000/api/vouchers/${selectedVoucher._id}`, selectedVoucher);
      } else {
        await axios.post("http://localhost:5000/api/vouchers", newVoucher);
      }
      fetchVouchers();
      handleClose();
    } catch (error) {
      toast.error("Lỗi khi lưu Voucher, Trùng code")
      console.error("Lỗi khi lưu voucher:", error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteVoucher = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa voucher này không?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/vouchers/${id}`);
      fetchVouchers();
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
    }
  };


  const updateVoucherStates = async () => {
    try {
      const today = new Date(); // Lấy ngày hiện tại

      const updatedVouchers = vouchers.map(voucher => {
        const startDate = new Date(voucher.start_date);
        const endDate = new Date(voucher.end_date);

        let newState = "Còn hiệu lực";
        if (startDate > today) {
          newState = "Chưa hiệu lực";
        } else if (endDate < today) {
          newState = "Hết hạn";
        }

        return { ...voucher, state: newState };
      });

      // Gửi API cập nhật trạng thái (nếu cần)
      await Promise.all(updatedVouchers.map(voucher => {
        return axios.put(`http://localhost:5000/api/vouchers/${voucher._id}`, { state: voucher.state });
      }));

      // Cập nhật lại state trong React
      setVouchers(updatedVouchers);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái voucher:", error);
    }
  };





  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box
        sx={{ display: "flex", backgroundColor: "#e9ecec", minHeight: "100vh" }}
      >
        <CssBaseline />

        <SideBar />

        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <AppBar
            position="static"
            sx={{ backgroundColor: "#2A3F54", color: "#fff" }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Quản lý Voucher</Typography>
              <Typography variant="body1" style={{ color: "#fff" }}>
                {currentTime.toLocaleDateString()} -{" "}
                {currentTime.toLocaleTimeString()}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 2 }}
          >
            <TextField
              variant="outlined"
              placeholder="🔍 Tìm kiếm Voucher ..."
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
          <Button
            variant="contained"
            color="success"
            startIcon={<AddCircle />}
            onClick={() => setAddOpen(true)}
            sx={{
              borderRadius: 2,
              padding: "6px 16px",
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: 1,
              "&:hover": {
                backgroundColor: "#388e3c",
              },
            }}
          >
            Thêm Voucher
          </Button>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: 3,
              mt: 3,
              backgroundColor: "#f0f0f0",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#2A3F54" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tên Voucher</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Mã</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Giảm giá</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Ngày bắt đầu</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Ngày kết thúc</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Trạng thái</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Số lượng</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vouchers
                  .filter((voucher) =>
                    voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((voucher) => (
                    <TableRow
                      key={voucher._id}
                      hover
                      sx={{ cursor: "pointer" }}
                      // onClick={() => handleViewVoucher(voucher)}
                    >
                      <TableCell>{voucher.name}</TableCell>
                      <TableCell>{voucher.code}</TableCell>
                      <TableCell>{voucher.discount} VNĐ</TableCell>
                      <TableCell>
                        {new Date(voucher.start_date).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        {new Date(voucher.end_date).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell
                        style={{
                          color:
                            voucher.state === "Hết hạn"
                              ? "red"
                              : voucher.state === "Chưa hiệu lực"
                                ? "orange"
                                : "green",
                          fontWeight: "bold",
                        }}
                      >
                        {voucher.state}
                      </TableCell>


                      <TableCell>{voucher.quantity}</TableCell>
                      <TableCell>
                        <IconButton
                          color="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditVoucher(voucher);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVoucher(voucher._id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

          </TableContainer>
        </Box>
      </Box>

      <Dialog open={editOpen || addOpen} onClose={handleClose}>
        <DialogTitle>
          {selectedVoucher ? "Chỉnh sửa Voucher" : "Thêm Voucher"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên Voucher"
            fullWidth
            value={selectedVoucher ? selectedVoucher.name : newVoucher.name}
            onChange={(e) => {
              selectedVoucher
                ? setSelectedVoucher({ ...selectedVoucher, name: e.target.value })
                : setNewVoucher({ ...newVoucher, name: e.target.value });
            }}
          />

          <TextField
            margin="dense"
            label="Mã Voucher"
            fullWidth
            value={selectedVoucher ? selectedVoucher.code : newVoucher.code}
            onChange={(e) => {
              selectedVoucher
                ? setSelectedVoucher({ ...selectedVoucher, code: e.target.value })
                : setNewVoucher({ ...newVoucher, code: e.target.value });
            }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Giảm giá</InputLabel>
            <Select
              value={selectedVoucher ? selectedVoucher.discount : newVoucher.discount}
              onChange={(e) => {
                selectedVoucher
                  ? setSelectedVoucher({ ...selectedVoucher, discount: e.target.value })
                  : setNewVoucher({ ...newVoucher, discount: e.target.value });
              }}
            >
              <MenuItem value={10000}>10,000 VNĐ</MenuItem>
              <MenuItem value={20000}>20,000 VNĐ</MenuItem>
              <MenuItem value={50000}>50,000 VNĐ</MenuItem>
              <MenuItem value={100000}>100,000 VNĐ</MenuItem>
            </Select>
          </FormControl>


          <TextField
            margin="dense"
            label="Ngày bắt đầu"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={
              selectedVoucher
                ? new Date(selectedVoucher.start_date).toISOString().split("T")[0]
                : new Date(newVoucher.start_date).toISOString().split("T")[0]
            }
            onChange={(e) => {
              selectedVoucher
                ? setSelectedVoucher({ ...selectedVoucher, start_date: e.target.value })
                : setNewVoucher({ ...newVoucher, start_date: e.target.value });
            }}
          />

          <TextField
            margin="dense"
            label="Ngày kết thúc"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={
              selectedVoucher
                ? new Date(selectedVoucher.end_date).toISOString().split("T")[0]
                : new Date(newVoucher.end_date).toISOString().split("T")[0]
            }
            onChange={(e) => {
              selectedVoucher
                ? setSelectedVoucher({ ...selectedVoucher, end_date: e.target.value })
                : setNewVoucher({ ...newVoucher, end_date: e.target.value });
            }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={selectedVoucher ? selectedVoucher.state : newVoucher.state}
              onChange={(e) => {
                selectedVoucher
                  ? setSelectedVoucher({ ...selectedVoucher, state: e.target.value })
                  : setNewVoucher({ ...newVoucher, state: e.target.value });
              }}
            >
              <MenuItem value="Còn hiệu lực">Còn hiệu lực</MenuItem>
              <MenuItem value="Hết hiệu lực">Hết hiệu lực</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Số lượng"
            type="number"
            fullWidth
            value={selectedVoucher ? selectedVoucher.quantity : newVoucher.quantity}
            onChange={(e) => {
              selectedVoucher
                ? setSelectedVoucher({ ...selectedVoucher, quantity: e.target.value })
                : setNewVoucher({ ...newVoucher, quantity: e.target.value });
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="error">
            Hủy
          </Button>
          <Button onClick={handleSaveVoucher} color="primary">
            {selectedVoucher ? "Lưu" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

    </ThemeProvider>
  );
}
