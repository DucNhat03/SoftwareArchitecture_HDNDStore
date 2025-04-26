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
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  InputAdornment,
  Breadcrumbs,
  Link,
  Tooltip,
  Backdrop,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  Edit,
  Delete,
  AddCircle,
  Dashboard,
  CardGiftcard,
  Search,
  Close as CloseIcon,
  CalendarToday,
  DiscountOutlined,
  LocalOffer,
  Inventory,
  CheckCircle,
  Cancel,
  HourglassEmpty
} from "@mui/icons-material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import SideBar from '../../../components/layout/admin-sideBar';

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
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12
        }
      }
    }
  }
});

export default function VoucherManagement() {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [newVoucher, setNewVoucher] = useState({
    name: "",
    code: "",
    discount: 10000,
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0],
    state: "Còn hiệu lực",
    quantity: 1,
  });
  
  // Thống kê voucher
  const activeVouchers = vouchers.filter(v => v.state === "Còn hiệu lực").length;
  const inactiveVouchers = vouchers.filter(v => v.state === "Hết hạn").length;
  const pendingVouchers = vouchers.filter(v => v.state === "Chưa hiệu lực").length;

  // Fetch vouchers on component mount
  useEffect(() => {
    fetchVouchers();
    
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (vouchers.length > 0) {
      updateVoucherStates();
    }
  }, [vouchers]);

  // Fetch vouchers from API
  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/vouchers");
      setVouchers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách voucher:", error);
      toast.error("Không thể tải danh sách voucher");
      setLoading(false);
    }
  };
  
  // Update voucher states
  const updateVoucherStates = async () => {
    try {
      const today = new Date();
      
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

      // Update voucher states in the backend
      await Promise.all(updatedVouchers.map(voucher => {
        return axios.put(`http://localhost:5000/api/vouchers/${voucher._id}`, { state: voucher.state });
      }));

      // Update vouchers in state
      setVouchers(updatedVouchers);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái voucher:", error);
    }
  };

  // Handle open edit dialog
  const handleEditVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setEditOpen(true);
  };

  // Handle close dialog
  const handleClose = () => {
    setEditOpen(false);
    setAddOpen(false);
    setSelectedVoucher(null);
  };

  // Handle save voucher
  const handleSaveVoucher = async () => {
    setLoading(true);
    try {
      if (selectedVoucher) {
        await axios.put(`http://localhost:5000/api/vouchers/${selectedVoucher._id}`, selectedVoucher);
        toast.success("Cập nhật voucher thành công!");
      } else {
        await axios.post("http://localhost:5000/api/vouchers", newVoucher);
        toast.success("Thêm voucher mới thành công!");
      }
      fetchVouchers();
      handleClose();
    } catch (error) {
      toast.error("Lỗi khi lưu voucher. Vui lòng kiểm tra mã voucher không được trùng.")
      console.error("Lỗi khi lưu voucher:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete voucher
  const handleDeleteVoucher = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/vouchers/${id}`);
      toast.success("Xóa voucher thành công!");
      fetchVouchers();
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
      toast.error("Không thể xóa voucher");
    } finally {
      setLoading(false);
    }
  };

  // Render voucher status chip
  const renderVoucherStatusChip = (status) => {
    if (status === "Còn hiệu lực") {
      return (
        <Chip 
          icon={<CheckCircle fontSize="small" />}
          label="Còn hiệu lực" 
          color="success" 
          size="small"
          sx={{ fontWeight: 500 }}
        />
      );
    } else if (status === "Chưa hiệu lực") {
      return (
        <Chip 
          icon={<HourglassEmpty fontSize="small" />}
          label="Chưa hiệu lực" 
          color="warning" 
          size="small"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      );
    } else {
      return (
        <Chip 
          icon={<Cancel fontSize="small" />}
          label="Hết hạn" 
          color="error" 
          size="small"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      );
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Filter vouchers
  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <b>QUẢN LÝ VOUCHER</b>
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
                    <LocalOffer sx={{ mr: 0.5 }} fontSize="small" />
                    Quản lý voucher
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
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.12), 
                    borderRadius: '50%', 
                    p: 1.5,
                    mr: 2
                  }}>
                    <CheckCircle sx={{ color: 'success.main', fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Voucher đang hoạt động</Typography>
                    <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 600 }}>
                      {activeVouchers}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.12), 
                    borderRadius: '50%', 
                    p: 1.5,
                    mr: 2
                  }}>
                    <HourglassEmpty sx={{ color: 'warning.main', fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Voucher chưa hiệu lực</Typography>
                    <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 600 }}>
                      {pendingVouchers}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    bgcolor: alpha(theme.palette.error.main, 0.12), 
                    borderRadius: '50%', 
                    p: 1.5,
                    mr: 2
                  }}>
                    <Cancel sx={{ color: 'error.main', fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Voucher hết hạn</Typography>
                    <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 600 }}>
                      {inactiveVouchers}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalOffer sx={{ color: 'primary.main', mr: 1, fontSize: 24 }} />
                    <Typography variant="h6" color="primary">
                      Danh sách voucher
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Tổng số: {vouchers.length} voucher
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <TextField
                      variant="outlined"
                      placeholder="Tìm kiếm voucher..."
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
                    
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddCircle />}
                      onClick={() => setAddOpen(true)}
                      sx={{
                        borderRadius: 2,
                        fontWeight: "medium",
                      }}
                    >
                      Thêm Voucher
                    </Button>
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
                    <TableCell>Tên Voucher</TableCell>
                    <TableCell>Mã</TableCell>
                    <TableCell>Giảm giá</TableCell>
                    <TableCell>Ngày bắt đầu</TableCell>
                    <TableCell>Ngày kết thúc</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVouchers.length > 0 ? (
                    filteredVouchers.map((voucher) => (
                      <TableRow
                        key={voucher._id}
                        hover
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CardGiftcard sx={{ color: 'primary.main', mr: 1 }} />
                            <Typography fontWeight="medium">
                              {voucher.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={voucher.code}
                            color="default"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography color="secondary.main" fontWeight="medium">
                            {formatCurrency(voucher.discount)} VNĐ
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {new Date(voucher.start_date).toLocaleDateString("vi-VN")}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {new Date(voucher.end_date).toLocaleDateString("vi-VN")}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {renderVoucherStatusChip(voucher.state)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Inventory sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {voucher.quantity}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Chỉnh sửa">
                              <IconButton
                                color="info"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditVoucher(voucher);
                                }}
                                size="small"
                                sx={{ 
                                  mr: 1,
                                  bgcolor: alpha('#03A9F4', 0.08),
                                  '&:hover': { bgcolor: alpha('#03A9F4', 0.15) }
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <IconButton
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm("Bạn có chắc chắn muốn xóa voucher này không?")) {
                                    handleDeleteVoucher(voucher._id);
                                  }
                                }}
                                size="small"
                                sx={{ 
                                  bgcolor: alpha('#F44336', 0.08),
                                  '&:hover': { bgcolor: alpha('#F44336', 0.15) }
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Box sx={{ py: 3 }}>
                          <Typography variant="body1" color="text.secondary">
                            Không tìm thấy voucher nào
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>

      {/* Add/Edit Voucher Dialog */}
      <Dialog 
        open={editOpen || addOpen} 
        onClose={handleClose}
        maxWidth="sm"
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {selectedVoucher ? (
              <Edit sx={{ color: 'info.main', mr: 1 }} />
            ) : (
              <AddCircle sx={{ color: 'success.main', mr: 1 }} />
            )}
            <Typography variant="h6">
              {selectedVoucher ? "Chỉnh sửa Voucher" : "Thêm Voucher mới"}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Tên Voucher"
                fullWidth
                variant="outlined"
                value={selectedVoucher ? selectedVoucher.name : newVoucher.name}
                onChange={(e) => {
                  selectedVoucher
                    ? setSelectedVoucher({ ...selectedVoucher, name: e.target.value })
                    : setNewVoucher({ ...newVoucher, name: e.target.value });
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CardGiftcard color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Mã Voucher"
                fullWidth
                variant="outlined"
                value={selectedVoucher ? selectedVoucher.code : newVoucher.code}
                onChange={(e) => {
                  selectedVoucher
                    ? setSelectedVoucher({ ...selectedVoucher, code: e.target.value })
                    : setNewVoucher({ ...newVoucher, code: e.target.value });
                }}
                helperText="Mã voucher phải là duy nhất"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOffer color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Giảm giá</InputLabel>
                <Select
                  value={selectedVoucher ? selectedVoucher.discount : newVoucher.discount}
                  onChange={(e) => {
                    selectedVoucher
                      ? setSelectedVoucher({ ...selectedVoucher, discount: e.target.value })
                      : setNewVoucher({ ...newVoucher, discount: e.target.value });
                  }}
                  label="Giảm giá"
                  startAdornment={
                    <InputAdornment position="start">
                      <DiscountOutlined color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value={10000}>10.000 VNĐ</MenuItem>
                  <MenuItem value={20000}>20.000 VNĐ</MenuItem>
                  <MenuItem value={50000}>50.000 VNĐ</MenuItem>
                  <MenuItem value={100000}>100.000 VNĐ</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Ngày bắt đầu"
                type="date"
                fullWidth
                variant="outlined"
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Ngày kết thúc"
                type="date"
                fullWidth
                variant="outlined"
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={selectedVoucher ? selectedVoucher.state : newVoucher.state}
                  onChange={(e) => {
                    selectedVoucher
                      ? setSelectedVoucher({ ...selectedVoucher, state: e.target.value })
                      : setNewVoucher({ ...newVoucher, state: e.target.value });
                  }}
                  label="Trạng thái"
                >
                  <MenuItem value="Còn hiệu lực">Còn hiệu lực</MenuItem>
                  <MenuItem value="Chưa hiệu lực">Chưa hiệu lực</MenuItem>
                  <MenuItem value="Hết hạn">Hết hạn</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Số lượng"
                type="number"
                fullWidth
                variant="outlined"
                value={selectedVoucher ? selectedVoucher.quantity : newVoucher.quantity}
                onChange={(e) => {
                  selectedVoucher
                    ? setSelectedVoucher({ ...selectedVoucher, quantity: e.target.value })
                    : setNewVoucher({ ...newVoucher, quantity: e.target.value });
                }}
                InputProps={{
                  inputProps: { min: 1 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Inventory color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 1 }}>
                Trạng thái sẽ tự động cập nhật dựa trên ngày bắt đầu và ngày kết thúc.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', px: 3, py: 2 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSaveVoucher} 
            variant="contained" 
            color={selectedVoucher ? "info" : "primary"}
            sx={{ borderRadius: 2 }}
          >
            {selectedVoucher ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}