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
  Backdrop,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  InputAdornment,
  Rating as MuiRating,
  Breadcrumbs,
  Link,
  Stack,
  Tooltip
} from "@mui/material";
import {
  Edit,
  AddCircle,
  Add,
  Close as CloseIcon,
  ArrowBack,
  ArrowForward,
  Search,
  Visibility,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Category,
  Dashboard,
  ShoppingCart,
  Photo,
  CameraAlt,
  AttachMoney,
  Star
} from "@mui/icons-material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import SideBar from '../../../components/layout/admin-sideBar';

const ITEMS_PER_PAGE = 6;

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

export default function ProductWomen() {
  const [products, setProducts] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "Giày nữ",
    rating: 0,
    image: [],
    imagethum: [],
    variants: [],
    status: "Hết hàng",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedThumbnails, setSelectedThumbnails] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    
    // Cập nhật thời gian mỗi giây
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/products/all/women")
      .then((response) => {
        setProducts(response.data);
        console.log("Danh sách sản phẩm:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        toast.error("Không thể tải danh sách sản phẩm");
        setLoading(false);
      });
  };

  // Reset currentPage về 0 khi searchTerm thay đổi
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredProduct = products.slice()
    .reverse()
    .filter(
      (product) =>
        (!isNaN(searchTerm) && product.id?.toString().includes(searchTerm)) ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategories?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (!isNaN(searchTerm) && product.price?.toString().includes(searchTerm)) ||
        product.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Xác định danh sách sản phẩm cần hiển thị
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProduct.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleVariantChange = (event) => {
    setSelectedVariantIndex(event.target.value);
    setSelectedStock(""); // Reset số lượng khi chọn biến thể mới
  };

  const handleStockChange = (event) => {
    let value = event.target.value.replace(/\D/g, ""); // Chỉ giữ số
    value = Math.min(999, Math.max(0, Number(value)));
    setSelectedStock(value);
  };

  const handleConfirm = () => {
    const selectedVariant = selectedProduct.variants[selectedVariantIndex];
    handleSubmit({
      size: selectedVariant.size,
      color: selectedVariant.color,
      quantity: selectedStock,
    });
  };

  const handleRemoveImage = async (index, type) => {
    try {
      // Xóa ảnh khỏi state
      setSelectedProduct((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }));

      toast.success("Xóa ảnh thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa ảnh:", error);
      toast.error("Lỗi khi xóa ảnh!");
    }
  };

  const handleSubmit = async ({ size, color, quantity }) => {
    try {
      setLoading(true);
      // Gửi yêu cầu cập nhật kho hàng cho sản phẩm
      const response = await fetch(
        `http://localhost:5000/products/import/${selectedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            size: size,
            color: color,
            stock: Number(quantity),
            status: "Còn hàng",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi gửi dữ liệu!");
      }

      const result = await response.json();
      toast.success("Nhập kho thành công!");
      console.log("Thêm kho hàng thành công:", result);

      // Cập nhật danh sách sản phẩm
      fetchProducts();
      
      // Đóng dialog sau khi gửi thành công
      handleClose();
    } catch (error) {
      console.error("Lỗi khi xử lý:", error);
      toast.error("Lỗi khi nhập kho hàng!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProductDetails(product);
    setViewOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleAddStock = (product) => {
    setSelectedProduct(product);
    setAddStockOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setAddOpen(false);
    setAddStockOpen(false);
    setSelectedProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      category: "Giày nữ",
      rating: 0,
      image: [],
      imagethum: [],
      variants: [],
      status: "Hết hàng",
    });
    setSelectedFiles([]);
    setSelectedThumbnails([]);
  };

  const handleSaveProduct = async () => {
    try {
      setLoading(true);

      // Kiểm tra dữ liệu đầu vào
      if (!selectedProduct?.name && !newProduct.name) {
        toast.error("Vui lòng nhập tên sản phẩm!");
        setLoading(false);
        return;
      }

      if (!selectedProduct?.subcategories && !newProduct.subcategories) {
        toast.error("Vui lòng chọn danh mục phụ!");
        setLoading(false);
        return;
      }

      if (!selectedProduct?.price && !newProduct.price) {
        toast.error("Vui lòng nhập giá sản phẩm!");
        setLoading(false);
        return;
      }

      if (selectedProduct?.image?.length + selectedFiles.length > 1) {
        toast.error("Số lượng ảnh tối đa là 1!");
        setLoading(false);
        return;
      }

      if (selectedProduct?.imagethum?.length + selectedThumbnails.length > 5) {
        toast.error("Số lượng ảnh nhỏ tối đa là 5!");
        setLoading(false);
        return;
      }

      let imageUrls = [];
      let imagethumUrls = [];

      // Upload ảnh sản phẩm lên Cloudinary nếu có
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("image", file));

        const response = await axios.post(
          "http://localhost:5000/api/upload",
          formData
        );
        imageUrls = response.data.imageUrls || [];
      }

      // Upload ảnh Thumbnail lên Cloudinary nếu có
      if (selectedThumbnails.length > 0) {
        const formData = new FormData();
        selectedThumbnails.forEach((file) =>
          formData.append("imagethum", file)
        );

        const response = await axios.post(
          "http://localhost:5000/api/upload",
          formData
        );
        imagethumUrls = response.data.imagethumUrls || [];
      }

      // Gộp URL ảnh vào sản phẩm trước khi lưu
      if (!selectedProduct || !selectedProduct.id) {
        // Kiểm tra trùng lặp trước khi thêm mới
        const checkDuplicate = await axios.get(
          "http://localhost:5000/products/check-duplicate",
          {
            params: { name: newProduct.name },
          }
        );

        if (checkDuplicate.data.duplicate) {
          toast.error("Sản phẩm đã tồn tại!");
          setLoading(false);
          return;
        }

        // Thêm mới sản phẩm với ảnh đã upload
        await axios.post("http://localhost:5000/products/create", {
          ...newProduct,
          image: [...(newProduct.image || []), ...imageUrls],
          imagethum: [...(newProduct.imagethum || []), ...imagethumUrls],
        });
        toast.success("Thêm sản phẩm thành công!");
      } else {
        // Cập nhật sản phẩm với ảnh đã upload
        await axios.put(
          `http://localhost:5000/products/update/${selectedProduct.id}`,
          {
            ...selectedProduct,
            image: [...(selectedProduct.image || []), ...imageUrls],
            imagethum: [...(selectedProduct.imagethum || []), ...imagethumUrls],
          }
        );
        toast.success("Cập nhật sản phẩm thành công!");
      }

      // Lấy danh sách sản phẩm mới sau khi thêm/cập nhật
      fetchProducts();
      handleClose();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      toast.error("Lỗi khi lưu sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  // Render status chip với màu sắc phù hợp
  const renderStatusChip = (status) => {
    switch(status?.toLowerCase()) {
      case 'còn hàng':
        return <Chip size="small" color="success" label="Còn hàng" />;
      case 'hết hàng':
        return <Chip size="small" color="error" label="Hết hàng" />;
      case 'sắp về':
        return <Chip size="small" color="warning" label="Sắp về" />;
      default:
        return <Chip size="small" label={status || "Không xác định"} />;
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
      
      <Backdrop open={loading} sx={{ zIndex: 9999, color: '#fff' }}>
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
                  <b>QUẢN LÝ SẢN PHẨM GIÀY NỮ</b>
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
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Category sx={{ mr: 0.5 }} fontSize="small" />
                    Quản lý sản phẩm
                  </Link>
                  <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingCart sx={{ mr: 0.5 }} fontSize="small" />
                    Giày nữ
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
                    Tổng số: {filteredProduct.length} sản phẩm
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quản lý thông tin và kho hàng của sản phẩm giày nữ
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <TextField
                      variant="outlined"
                      placeholder="Tìm kiếm sản phẩm..."
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
                        fontWeight: 500,
                        boxShadow: 2,
                        whiteSpace: "nowrap"
                      }}
                    >
                      Thêm sản phẩm
                    </Button>
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
                        <TableRow sx={{ backgroundColor: alpha('#2A3F54', 0.03) }}>
                          <TableCell width="5%">ID</TableCell>
                          <TableCell width="20%">Sản phẩm</TableCell>
                          <TableCell width="15%">Giá</TableCell>
                          <TableCell width="15%">Danh mục</TableCell>
                          <TableCell width="15%">Tồn kho</TableCell>
                          <TableCell width="15%">Trạng thái</TableCell>
                          <TableCell width="15%" align="center">Thao tác</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedProducts.length > 0 ? (
                          paginatedProducts.map((product) => (
                            <TableRow
                              key={product.id}
                              hover
                              sx={{ cursor: "pointer" }}
                              onClick={() => handleViewProduct(product)}
                            >
                              <TableCell>{product.id}</TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  {product.image && product.image.length > 0 ? (
                                    <Box
                                      component="img"
                                      src={product.image[0]}
                                      alt={product.name}
                                      sx={{
                                        width: 40,
                                        height: 40,
                                        objectFit: "cover",
                                        borderRadius: 1,
                                        mr: 2,
                                        border: "1px solid #e0e0e0"
                                      }}
                                    />
                                  ) : (
                                    <Box
                                      sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 1,
                                        mr: 2,
                                        backgroundColor: "#f0f0f0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                      }}
                                    >
                                      <Photo color="action" fontSize="small" />
                                    </Box>
                                  )}
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                      {product.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <MuiRating 
                                        value={Number(product.rating) || 0} 
                                        readOnly 
                                        precision={0.5}
                                        size="small"
                                      />
                                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                        {product.rating || 0}/5
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight={500} color="primary">
                                  {parseInt(product.price).toLocaleString('vi-VN')} ₫
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {product.subcategories}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {product.variants?.reduce(
                                    (total, variant) => total + (variant.stock || 0),
                                    0
                                  ) || 0} sản phẩm
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {product.variants?.length || 0} biến thể
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {renderStatusChip(product.status)}
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                  <Tooltip title="Xem chi tiết">
                                    <IconButton
                                      color="info"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewProduct(product);
                                      }}
                                      sx={{ 
                                        bgcolor: alpha('#03A9F4', 0.08),
                                        '&:hover': { bgcolor: alpha('#03A9F4', 0.15) }
                                      }}
                                      size="small"
                                    >
                                      <Visibility fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Chỉnh sửa">
                                    <IconButton
                                      color="warning"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(product);
                                      }}
                                      sx={{ 
                                        ml: 1,
                                        bgcolor: alpha('#FF9800', 0.08),
                                        '&:hover': { bgcolor: alpha('#FF9800', 0.15) }
                                      }}
                                      size="small"
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Nhập kho">
                                    <IconButton
                                      color="success"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddStock(product);
                                      }}
                                      sx={{ 
                                        ml: 1,
                                        bgcolor: alpha('#4CAF50', 0.08),
                                        '&:hover': { bgcolor: alpha('#4CAF50', 0.15) }
                                      }}
                                      size="small"
                                    >
                                      <Add fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              <Box sx={{ py: 3 }}>
                                <Typography variant="body1" color="text.secondary">
                                  Không tìm thấy sản phẩm nào
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
                      Hiển thị {Math.min(startIndex + 1, filteredProduct.length)} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredProduct.length)} trên tổng số {filteredProduct.length} sản phẩm
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
                        disabled={startIndex + ITEMS_PER_PAGE >= filteredProduct.length}
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

      {/* Dialog chỉnh sửa / thêm mới sản phẩm */}
      <Dialog 
        open={editOpen || addOpen} 
        onClose={handleClose}
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
          <Typography variant="h6" component="div">
            {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tên sản phẩm"
                fullWidth
                variant="outlined"
                value={selectedProduct ? selectedProduct.name : newProduct.name}
                onChange={(e) => {
                  selectedProduct
                    ? setSelectedProduct({
                      ...selectedProduct,
                      name: e.target.value,
                    })
                    : setNewProduct({ ...newProduct, name: e.target.value });
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                label="Danh mục chính"
                fullWidth
                variant="outlined"
                value={selectedProduct?.category || newProduct.category}
                disabled={true}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Danh mục phụ</InputLabel>
                <Select
                  value={
                    selectedProduct
                      ? selectedProduct.subcategories || ""
                      : newProduct.subcategories || ""
                  }
                  onChange={(e) => {
                    selectedProduct
                      ? setSelectedProduct({
                        ...selectedProduct,
                        subcategories: e.target.value,
                      })
                      : setNewProduct({
                        ...newProduct,
                        subcategories: e.target.value,
                      });
                  }}
                  label="Danh mục phụ"
                >
                  <MenuItem value="Sandal nữ">Sandal nữ</MenuItem>
                  <MenuItem value="Giày thể thao nữ">Giày thể thao nữ</MenuItem>
                  <MenuItem value="Giày lười">Giày lười</MenuItem>
                  <MenuItem value="Dép nữ">Dép nữ</MenuItem>
                  <MenuItem value="Giày cao gót">Giày cao gót</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Giá (VND)"
                fullWidth
                variant="outlined"
                value={selectedProduct ? selectedProduct.price : newProduct.price}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  value = value === "" ? "0" : value;
                  value = Math.min(999999999, Math.max(0, Number(value)));
                  selectedProduct
                    ? setSelectedProduct({ ...selectedProduct, price: value })
                    : setNewProduct({ ...newProduct, price: value });
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Giá hiển thị: {parseInt(selectedProduct ? selectedProduct.price : newProduct.price).toLocaleString('vi-VN')}đ
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" mb={1}>Đánh giá sản phẩm</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MuiRating
                    value={Number(selectedProduct ? selectedProduct.rating : newProduct.rating)}
                    onChange={(event, newValue) => {
                      selectedProduct
                        ? setSelectedProduct({ ...selectedProduct, rating: newValue })
                        : setNewProduct({ ...newProduct, rating: newValue });
                    }}
                    precision={1}
                  />
                  <Typography ml={1}>
                    ({selectedProduct ? selectedProduct.rating : newProduct.rating}/5)
                  </Typography>
                </Box>
              </Box>
              
              <TextField
                label="Mô tả sản phẩm"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={
                  selectedProduct
                    ? selectedProduct.description
                    : newProduct.description
                }
                onChange={(e) => {
                  selectedProduct
                    ? setSelectedProduct({
                      ...selectedProduct,
                      description: e.target.value,
                    })
                    : setNewProduct({ ...newProduct, description: e.target.value });
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Ảnh đại diện sản phẩm
                </Typography>
                <Box sx={{ 
                  border: '1px dashed #ccc',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  mb: 1,
                  backgroundColor: alpha('#f5f5f5', 0.5)
                }}>
                  <input
                    type="file"
                    id="product-image"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      if (files.length === 0) return;
                      setSelectedFiles(files);
                    }}
                  />
                  <label htmlFor="product-image">
                    <Button
                      component="span"
                      startIcon={<CameraAlt />}
                      variant="outlined"
                      color="primary"
                      sx={{ mb: 1 }}
                    >
                      Chọn ảnh đại diện
                    </Button>
                  </label>
                  
                  <Typography variant="body2" color="text.secondary">
                    Cho phép JPG, PNG (Tối đa 1 ảnh)
                  </Typography>
                </Box>
                
                <Grid container spacing={1}>
                  {selectedFiles.length > 0 && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          p: 0.5,
                          mb: 1,
                          position: 'relative'
                        }}
                      >
                        <img
                          src={URL.createObjectURL(selectedFiles[0])}
                          alt="Selected"
                          style={{ 
                            width: '100%',
                            height: '200px',
                            objectFit: 'contain',
                            borderRadius: '4px'
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: 4, 
                            right: 4, 
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                          }}
                          onClick={() => setSelectedFiles([])}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  )}
                  
                  {selectedProduct?.image?.map((img, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          p: 0.5,
                          mb: 1,
                          position: 'relative'
                        }}
                      >
                        <img
                          src={img}
                          alt={`Image ${index}`}
                          style={{ 
                            width: '100%',
                            height: '200px',
                            objectFit: 'contain',
                            borderRadius: '4px'
                          }}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          sx={{ 
                            position: 'absolute', 
                            top: 4, 
                            right: 4, 
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                          }}
                          onClick={() => handleRemoveImage(index, "image")}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Ảnh chi tiết sản phẩm
                </Typography>
                <Box sx={{ 
                  border: '1px dashed #ccc',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  mb: 1,
                  backgroundColor: alpha('#f5f5f5', 0.5)
                }}>
                  <input
                    type="file"
                    id="product-thumbnails"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      if (files.length === 0) return;
                      setSelectedThumbnails(files);
                    }}
                  />
                  <label htmlFor="product-thumbnails">
                    <Button
                      component="span"
                      startIcon={<UploadIcon />}
                      variant="outlined"
                      color="secondary"
                      sx={{ mb: 1 }}
                    >
                      Tải ảnh chi tiết
                    </Button>
                  </label>
                  
                  <Typography variant="body2" color="text.secondary">
                    Cho phép JPG, PNG (Tối đa 5 ảnh)
                  </Typography>
                </Box>
                
                <Grid container spacing={1}>
                  {selectedThumbnails.map((file, index) => (
                    <Grid item xs={4} key={`new-${index}`}>
                      <Box
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          p: 0.5,
                          position: 'relative',
                          height: '100px'
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New thumbnail ${index}`}
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            right: 0, 
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                            padding: '2px'
                          }}
                          onClick={() => {
                            setSelectedThumbnails(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                  
                  {selectedProduct?.imagethum?.map((img, index) => (
                    <Grid item xs={4} key={index}>
                      <Box
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          p: 0.5,
                          position: 'relative',
                          height: '100px'
                        }}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index}`}
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            right: 0, 
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                            padding: '2px'
                          }}
                          onClick={() => handleRemoveImage(index, "imagethum")}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', px: 3, py: 2 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Huỷ bỏ
          </Button>
          <Button 
            onClick={handleSaveProduct} 
            variant="contained"
            color="primary"
            startIcon={<AddCircle />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {selectedProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog nhập kho */}
      <Dialog
        open={addStockOpen}
        onClose={handleClose}
        PaperProps={{ 
          sx: { 
            borderRadius: 3, 
            padding: 2, 
            maxWidth: 500 
          } 
        }}
      >
        <DialogTitle sx={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          <Typography variant="h6">
            Nhập thêm kho hàng
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {selectedProduct && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Thông tin sản phẩm</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {selectedProduct.image && selectedProduct.image.length > 0 ? (
                    <Box
                      component="img"
                      src={selectedProduct.image[0]}
                      alt={selectedProduct.name}
                      sx={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 1,
                        mr: 2,
                        border: "1px solid #e0e0e0"
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        mr: 2,
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Photo fontSize="medium" />
                    </Box>
                  )}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {selectedProduct.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedProduct.subcategories}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Chọn biến thể</InputLabel>
                <Select
                  value={selectedVariantIndex}
                  onChange={handleVariantChange}
                  label="Chọn biến thể"
                >
                  {selectedProduct?.variants?.map((variant, index) => (
                    <MenuItem key={index} value={index}>
                      Size: {variant.size}, Color: {variant.color}, Tồn kho: {variant.stock || 0}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Nhập số lượng</Typography>
                <TextField
                  type="number"
                  value={selectedStock}
                  onChange={handleStockChange}
                  fullWidth
                  variant="outlined"
                  inputProps={{ min: 1 }}
                  placeholder="Nhập số lượng cần thêm vào kho"
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      backgroundColor: "#f5f5f5",
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ 
                mt: 3, 
                p: 2, 
                bgcolor: alpha('#4CAF50', 0.08), 
                borderRadius: 1,
                border: '1px solid',
                borderColor: alpha('#4CAF50', 0.2)
              }}>
                <Typography variant="body2">
                  <b>Lưu ý:</b> Số lượng nhập thêm sẽ được cộng vào tồn kho hiện tại của biến thể đã chọn.
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="success"
            disabled={!selectedStock || selectedStock === "0"}
            startIcon={<Add />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Nhập kho
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xem chi tiết sản phẩm */}
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
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6">Chi tiết sản phẩm</Typography>
          <IconButton onClick={() => setViewOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {selectedProductDetails && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                {/* Main product image */}
                <Box sx={{ position: 'relative', mb: 2 }}>
                  {selectedProductDetails.image && selectedProductDetails.image.length > 0 ? (
                    <Box
                      component="img"
                      src={selectedProductDetails.image[0]}
                      alt={selectedProductDetails.name}
                      sx={{
                        width: '100%',
                        height: 300,
                        objectFit: "contain",
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        bgcolor: '#f9f9f9'
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: 300,
                        borderRadius: 2,
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed #ccc"
                      }}
                    >
                      <Typography color="text.secondary">Không có ảnh</Typography>
                    </Box>
                  )}
                  
                  {renderStatusChip(selectedProductDetails.status) && (
                    <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                      {renderStatusChip(selectedProductDetails.status)}
                    </Box>
                  )}
                </Box>
                
                {/* Thumbnail images */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(selectedProductDetails.imagethum || [])
                    .filter(Boolean)
                    .map((image, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={image}
                        alt={`Thumbnail ${index}`}
                        sx={{
                          width: 70,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: 1,
                          border: "1px solid #e0e0e0",
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={7}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {selectedProductDetails.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MuiRating 
                    value={Number(selectedProductDetails.rating)} 
                    readOnly 
                    precision={0.5}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {selectedProductDetails.rating}/5
                  </Typography>
                </Box>
                
                <Typography variant="h6" color="primary.main" gutterBottom>
                  {parseInt(selectedProductDetails.price).toLocaleString('vi-VN')} ₫
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Danh mục
                    </Typography>
                    <Typography variant="body1">
                      {selectedProductDetails.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Danh mục phụ
                    </Typography>
                    <Typography variant="body1">
                      {selectedProductDetails.subcategories}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      ID Sản phẩm
                    </Typography>
                    <Typography variant="body1">
                      #{selectedProductDetails.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Tổng số lượng
                    </Typography>
                    <Typography variant="body1">
                      {selectedProductDetails.variants?.reduce(
                        (total, variant) => total + (variant.stock || 0),
                        0
                      ) || 0} sản phẩm
                    </Typography>
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle1" gutterBottom>
                  Mô tả sản phẩm
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedProductDetails.description || "Không có mô tả"}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Biến thể sản phẩm
                </Typography>
                
                {selectedProductDetails.variants && selectedProductDetails.variants.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: alpha('#2A3F54', 0.03) }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Kích thước</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Màu sắc</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Số lượng</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedProductDetails.variants.map((variant, index) => (
                          <TableRow key={index}>
                            <TableCell>{variant.size}</TableCell>
                            <TableCell>{variant.color}</TableCell>
                            <TableCell>{variant.stock}</TableCell>
                            <TableCell>
                              {parseInt(variant.stock) > 0 ? (
                                <Chip size="small" color="success" label="Còn hàng" />
                              ) : (
                                <Chip size="small" color="error" label="Hết hàng" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Sản phẩm chưa có biến thể nào.
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', px: 3, py: 2 }}>
          <Button
            onClick={() => setViewOpen(false)}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Đóng
          </Button>
          {selectedProductDetails && (
            <Button
              onClick={() => {
                setViewOpen(false);
                handleEdit(selectedProductDetails);
              }}
              variant="outlined"
              color="secondary"
              startIcon={<Edit />}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Chỉnh sửa
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}