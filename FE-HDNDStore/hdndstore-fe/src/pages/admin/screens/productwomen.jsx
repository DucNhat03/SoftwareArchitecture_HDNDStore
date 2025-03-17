import { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  Collapse,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import {
  Dashboard,
  People,
  ShoppingCart,
  Receipt,
  BarChart,
  Settings,
  Edit,
  Logout,
  AddCircle,
  ExpandLess,
  ExpandMore,
  Add,
  Close as CloseIcon,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";

const drawerWidth = 260;
const ITEMS_PER_PAGE = 6;

const theme = createTheme({
  palette: {
    primary: { main: "#504c4c" },
    secondary: { main: "#FF9800" },
    success: { main: "#4CAF50" },
    error: { main: "#F44336" },
  },
});

export default function ProductWomen() {
  const [Products, setProducts] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    rating: 0,
    image: [],
    imagethum: [],
    variants: [],
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // Lưu ảnh sản phẩm
  const [selectedThumbnails, setSelectedThumbnails] = useState([]); // Lưu ảnh thumbnail
  const [openOrders, setOpenOrders] = useState(false);
  const handleOrdersClick = () => {
    setOpenOrders(!openOrders);
  };

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:5000/products/all/women")
      .then((response) => {
        setProducts(response.data);
        console.log("Danh sách sản phẩm:", response.data);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách sản phẩm:", error)
      );
    // Cập nhật thời gian mỗi giây
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [currentPage, setCurrentPage] = useState(0);

  // Reset currentPage về 0 khi searchTerm thay đổi
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  // Lọc đơn hàng theo từ khóa tìm kiếm
  const filteredProduct = Products.slice()
    .reverse()
    .filter(
      (Product) =>
        (!isNaN(searchTerm) && Product.id.toString().includes(searchTerm)) ||
        Product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Product.subcategories
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (!isNaN(searchTerm) && Product.price.toString().includes(searchTerm)) ||
        Product.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Xác định danh sách hóa đơn cần hiển thị
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
  const handleRemoveImage = async (index, type, imgUrl) => {
    try {
      // 🟢 Xóa ảnh trên Cloudinary + database
      await axios.post("http://localhost:5000/api/delete-image", { imgUrl });

      // 🟢 Xóa ảnh khỏi state
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
            stock: Number(quantity), // Chuyển thành số
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

      // Gửi yêu cầu lấy danh sách sản phẩm mới
      const fetchResponse = await fetch(
        "http://localhost:5000/products/all/women"
      );
      if (!fetchResponse.ok) {
        throw new Error("Lỗi khi tải danh sách sản phẩm");
      }
      const products = await fetchResponse.json();
      setProducts(products); // Cập nhật danh sách sản phẩm

      // Đóng dialog sau khi gửi thành công
      handleClose();
    } catch (error) {
      console.error("Lỗi khi xử lý:", error);
    }
  };

  const [openProducts, setOpenProducts] = useState(false);

  const handleProductsClick = () => {
    setOpenProducts(!openProducts);
  };

  const handleViewProduct = (Product) => {
    setSelectedProductDetails(Product);
    setViewOpen(true);
  };

  const handleEdit = (Product) => {
    setSelectedProduct(Product);
    setEditOpen(true);
  };

  const handleAddStock = (Product) => {
    setSelectedProduct(Product);
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
      category: "",
      rating: 0,
      image: [],
      imagethum: [],
      variants: [],
      status: "",
    });
    setSelectedProduct("");
    setSelectedFiles([]);
    setSelectedThumbnails([]);
  };

  useEffect(() => {
    if (!selectedProduct && !newProduct.category) {
      setNewProduct((prev) => ({ ...prev, category: "Giày nữ" }));
    }
  }, [selectedProduct, newProduct]);
  useEffect(() => {
    if (!selectedProduct && !newProduct.status) {
      setNewProduct((prev) => ({ ...prev, status: "Hết hàng" }));
    }
  }, [selectedProduct, newProduct]);

  const [loading, setLoading] = useState(false);
  const handleSaveProduct = async () => {
    try {
      setLoading(true); // Bật hiệu ứng xoay vòng + làm mờ

      // ✅ Kiểm tra dữ liệu đầu vào
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

      if (
        selectedProduct?.image?.length + selectedFiles.length > 5 ||
        selectedThumbnails.length > 5
      ) {
        toast.error("Số lượng ảnh tối đa là 5!");
        setLoading(false);
        return;
      }

      let imageUrls = [];
      let imagethumUrls = [];

      // ✅ Upload ảnh sản phẩm lên Cloudinary nếu có
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("image", file));

        const response = await axios.post(
          "http://localhost:5000/api/upload",
          formData
        );
        imageUrls = response.data.imageUrls || [];
      }

      // ✅ Upload ảnh Thumbnail lên Cloudinary nếu có
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

      // ✅ Gộp URL ảnh vào sản phẩm trước khi lưu
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

        // ✅ Thêm mới sản phẩm với ảnh đã upload
        await axios.post("http://localhost:5000/products/create", {
          ...newProduct,
          image: [...(newProduct.image || []), ...imageUrls],
          imagethum: [...(newProduct.imagethum || []), ...imagethumUrls],
        });
        toast.success("Thêm sản phẩm thành công!");
      } else {
        // ✅ Cập nhật sản phẩm với ảnh đã upload
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

      // ✅ Lấy danh sách sản phẩm mới sau khi thêm/cập nhật
      const response = await axios.get(
        "http://localhost:5000/products/all/men"
      );
      setProducts(response.data);
      handleClose();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      toast.error("Lỗi khi lưu sản phẩm!");
    } finally {
      setLoading(false); // Tắt loading khi xong
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Backdrop open={loading} style={{ zIndex: 1300, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box
        sx={{ display: "flex", backgroundColor: "#e9ecec", minHeight: "100vh" }}
      >
        <CssBaseline />


        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#a7adad",
              color: "#fff",
            },
          }}
        >
          <Toolbar>
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                DuyNgayXua
              </Typography>
              <IconButton color="error" sx={{ mt: 1 }}>
                <Logout />
              </IconButton>
            </Box>
          </Toolbar>
          <List>
            {[
              { text: "Bảng điều khiển", icon: <Dashboard />, path: "/" },
              {
                text: "Quản lý khách hàng",
                icon: <People />,
                path: "/admin/users",
              },
              {
                text: "Quản lý sản phẩm",
                icon: <ShoppingCart />,
                isParent: true,
              },

              // { text: "Quản lý đơn hàng", icon: <Receipt />, path: "/admin/order" },

              {
                text: "Quản lý đơn hàng",
                icon: <Receipt />,
                isParent: true,
              },
              { text: "Báo cáo doanh thu", icon: <BarChart />, path: "/" },
              {
                text: "Quản lý Khuyến Mãi",
                icon: <CardGiftcardIcon />,
                path: "/admin/voucher",
              },
              { text: "Cài đặt hệ thống", icon: <Settings />, path: "/" },
            ].map((item, index) => (
              <div key={index}>
                {item.isParent ? (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={
                          item.text === "Quản lý sản phẩm"
                            ? handleProductsClick
                            : handleOrdersClick
                        }
                      >
                        <ListItemIcon sx={{ color: "#fff" }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                        {item.text === "Quản lý sản phẩm" ? (
                          openProducts ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )
                        ) : openOrders ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItemButton>
                    </ListItem>
                    <Collapse
                      in={
                        item.text === "Quản lý sản phẩm"
                          ? openProducts
                          : openOrders
                      }
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {item.text === "Quản lý sản phẩm" ? (
                          <>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() => navigate("/admin/products/men")}
                              >
                                <ListItemText primary="Giày nam" />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                  navigate("/admin/products/women")
                                }
                              >
                                <ListItemText primary="Giày nữ" />
                              </ListItemButton>
                            </ListItem>
                          </>
                        ) : (
                          <>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                  navigate("/admin/orders/pending")
                                }
                              >
                                <ListItemText primary="Chờ xác nhận" />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                  navigate("/admin/orders/shipping")
                                }
                              >
                                <ListItemText primary="Đang giao" />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                  navigate("/admin/orders/delivered")
                                }
                              >
                                <ListItemText primary="Đã giao" />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                  navigate("/admin/orders/canceled")
                                }
                              >
                                <ListItemText primary="Đã hủy" />
                              </ListItemButton>
                            </ListItem>
                          </>
                        )}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate(item.path)}>
                      <ListItemIcon sx={{ color: "#fff" }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                )}
              </div>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <AppBar
            position="static"
            sx={{ backgroundColor: "#a7adad", color: "#fff" }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5">
                <b>QUẢN LÝ SẢN PHẨM GIÀY NỮ</b>
              </Typography>
              <Typography variant="body1">
                {currentTime.toLocaleDateString()} -{" "}
                {currentTime.toLocaleTimeString()}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 2,
              mb: 2,
            }}
          >
            {/* Ô tìm kiếm sản phẩm */}
            <TextField
              variant="outlined"
              placeholder="🔍 Tìm kiếm sản phẩm ..."
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
            Thêm sản phẩm
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
              <TableHead sx={{ backgroundColor: "#a7adad" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Image
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Stock
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((Product) => (
                  <TableRow
                    key={Product.id}
                    hover
                    sx={{ cursor: "pointer" }} // 🟢 Biến hàng thành nút
                    onClick={() => handleViewProduct(Product)} // 🟢 Nhấn vào hàng để xem sản phẩm
                  >
                    <TableCell>{Product.id}</TableCell>
                    <TableCell>{Product.name}</TableCell>
                    <TableCell>{Product.price.toLocaleString()} VND</TableCell>
                    <TableCell>{Product.subcategories}</TableCell>
                    <TableCell>
                      {Product.image && Product.image.length > 0 ? (
                        <img
                          src={Product.image[0]}
                          alt="Product"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        <span>Không có ảnh</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {Product.variants?.reduce(
                        (total, variant) => total + variant.stock,
                        0
                      ) || 0}
                    </TableCell>
                    <TableCell>{Product.status}</TableCell>
                    <TableCell>
                      <IconButton
                        color="info"
                        onClick={(e) => {
                          e.stopPropagation(); // 🛑 Ngăn sự kiện click lan sang hàng
                          handleViewProduct(Product);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(Product);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddStock(Product);
                        }}
                      >
                        <Add />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "10px 0",
              }}
            >
              <IconButton
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
                sx={{ mx: 1 }}
              >
                <ArrowBack /> {/* Icon Trang Trước */}
              </IconButton>

              <IconButton
                disabled={startIndex + ITEMS_PER_PAGE >= filteredProduct.length}
                onClick={() => setCurrentPage(currentPage + 1)}
                sx={{ mx: 1 }}
              >
                <ArrowForward /> {/* Icon Trang Sau */}
              </IconButton>
            </div>
          </TableContainer>
        </Box>
      </Box>
      {/* dialog sửa khách hàng */}
      <Dialog open={editOpen || addOpen} onClose={handleClose}>
        <Backdrop open={loading} style={{ zIndex: 1300, color: "#fff" }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle>
          {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={selectedProduct ? selectedProduct.name : newProduct.name}
            onChange={(e) => {
              selectedProduct
                ? setSelectedProduct({
                  ...selectedProduct,
                  name: e.target.value,
                })
                : setNewProduct({ ...newProduct, name: e.target.value });
            }}
          />
          <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={selectedProduct?.category || newProduct.category}
            disabled={true} // Không cho chỉnh sửa
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>SubCategory</InputLabel>
            <Select
              value={
                selectedProduct
                  ? selectedProduct.subcategories
                  : newProduct.subcategories
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
            >
              <MenuItem value="Sandal nữ">Sandal nữ</MenuItem>
              <MenuItem value="Giày thể thao nữ">Giày thể thao nữ</MenuItem>
              <MenuItem value="Giày lười">Giày lười</MenuItem>
              <MenuItem value="Dép nữ">Dép nữ</MenuItem>
              <MenuItem value="Giày cao gót">Giày cao gót</MenuItem>
            </Select>
          </FormControl>

          {!selectedProduct && (
            <Typography variant="body1">Tên sản phẩm: Sản phẩm mới</Typography>
          )}

          <TextField
            margin="dense"
            label="Giá (VND)"
            fullWidth
            value={selectedProduct ? selectedProduct.price : newProduct.price}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, ""); // Chỉ giữ số
              value = Math.min(999999, Math.max(0, Number(value)));
              selectedProduct
                ? setSelectedProduct({ ...selectedProduct, price: value })
                : setNewProduct({ ...newProduct, price: value });
            }}
          />
          <Typography variant="body2">
            Giá hiển thị:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(
              selectedProduct ? selectedProduct.price : newProduct.price
            )}
          </Typography>
          <TextField
            margin="dense"
            label="Rating"
            fullWidth
            value={selectedProduct ? selectedProduct.rating : newProduct.rating}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, ""); // Chỉ giữ số
              value = Math.min(5, Math.max(0, Number(value))); // Giới hạn từ 0 - 5
              selectedProduct
                ? setSelectedProduct({ ...selectedProduct, rating: value })
                : setNewProduct({ ...newProduct, rating: value });
            }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
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
          />
          <TextField
            margin="dense"
            label="Image"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="file"
            inputProps={{ multiple: true }}
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (files.length === 0) return;
              setSelectedFiles(files); // ✅ Lưu file vào state, không upload ngay
            }}
          />
          {/* Hiển thị danh sách ảnh đã có */}
          {selectedProduct?.image &&
            selectedProduct.image.map((img, index) => (
              <div
                key={index}
                style={{
                  display: "inline-block",
                  position: "relative",
                  margin: "5px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={img}
                  alt={`Image ${index}`}
                  width="100"
                  height="100"
                  style={{ borderRadius: "8px", objectFit: "cover" }}
                />
                <button
                  onClick={() => handleRemoveImage(index, "image", img)}
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    background: "rgba(255, 0, 0, 0.8)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(255, 0, 0, 1)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "rgba(255, 0, 0, 0.8)")
                  }
                >
                  ✕
                </button>
              </div>
            ))}

          <TextField
            margin="dense"
            label="Imagethum"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="file"
            inputProps={{ multiple: true }}
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (files.length === 0) return;
              setSelectedThumbnails(files); // ✅ Lưu file vào state, không upload ngay
            }}
          />
          {/* Hiển thị danh sách ảnh thumbnail */}
          {selectedProduct?.imagethum &&
            selectedProduct.imagethum.map((img, index) => (
              <div
                key={index}
                style={{
                  display: "inline-block",
                  position: "relative",
                  margin: "5px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={img}
                  alt={`Imagethum ${index}`}
                  width="100"
                  height="100"
                  style={{ borderRadius: "8px", objectFit: "cover" }}
                />
                <button
                  onClick={() => handleRemoveImage(index, "imagethum", img)}
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    background: "rgba(255, 0, 0, 0.8)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(255, 0, 0, 1)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "rgba(255, 0, 0, 0.8)")
                  }
                >
                  ✕
                </button>
              </div>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Hủy
          </Button>
          <Button onClick={handleSaveProduct} color="primary">
            {selectedProduct ? "Lưu" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog nhập hàng */}
      <Dialog
        open={addStockOpen}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": { borderRadius: 3, padding: 2, minWidth: 400 },
        }}
      >
        {/* Tiêu đề có nút đóng */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              textAlign: "center",
              flex: 1,
            }}
          >
            Nhập thêm kho hàng
          </span>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Chọn biến thể */}
          <TextField
            select
            label="Chọn biến thể"
            fullWidth
            value={selectedVariantIndex}
            onChange={handleVariantChange}
            margin="dense"
            sx={{ mt: 1 }}
          >
            {selectedProduct?.variants?.map((variant, index) => (
              <MenuItem key={index} value={index}>
                Size: {variant.size}, Color: {variant.color}, Stock:{" "}
                {variant.stock}
              </MenuItem>
            ))}
          </TextField>

          {/* Nhập số lượng */}
          <TextField
            label="Nhập số lượng"
            type="number"
            value={selectedStock}
            onChange={handleStockChange}
            margin="dense"
            inputProps={{ min: 0 }}
            sx={{
              width: "45%", // Giảm chiều rộng
              alignSelf: "center", // Canh giữa
              "& .MuiInputBase-root": {
                borderRadius: "8px", // Bo góc
                padding: "10px", // Tăng padding
                backgroundColor: "#f5f5f5", // Màu nền nhẹ
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc", // Màu viền mặc định
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2", // Màu viền khi hover
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2", // Màu viền khi focus
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            disabled={!selectedStock}
            sx={{
              borderRadius: 2,
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog xem thông tin sản phẩm */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        maxWidth="sm" // Điều chỉnh kích thước, có thể là "sm", "md", "lg", "xl"
        fullWidth
      >
        <DialogTitle>Thông tin sản phẩm</DialogTitle>
        <DialogContent>
          {selectedProductDetails && (
            <Box>
              <Typography>
                <b>Name:</b> {selectedProductDetails.name}
              </Typography>
              <Typography>
                <b>Price:</b> {selectedProductDetails.price.toLocaleString()}{" "}
                VND
              </Typography>
              <Typography>
                <b>Category:</b> {selectedProductDetails.category}
              </Typography>
              <Typography>
                <b>SubCategory:</b> {selectedProductDetails.subcategories}
              </Typography>
              <Typography>
                <b>Rating:</b> {selectedProductDetails.rating}
              </Typography>
              <Typography>
                <b>Description:</b> {selectedProductDetails.description}
              </Typography>
              <Box>
                {/* Hiển thị danh sách hình ảnh (image) */}
                <Typography>
                  <b>Hình ảnh chính:</b>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  {(selectedProductDetails.image || []) // Kiểm tra nếu image là mảng
                    .filter(Boolean) // Lọc bỏ null/undefined
                    .map((image, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={image}
                        alt={`product-image-${index}`}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 2,
                          boxShadow: 1,
                          border: "1px solid #ddd",
                        }}
                      />
                    ))}
                </Box>

                {/* Hiển thị danh sách hình thu nhỏ (imagethum) */}
                <Typography sx={{ mt: 2 }}>
                  <b>Hình ảnh thu nhỏ:</b>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  {(selectedProductDetails.imagethum || []) // Kiểm tra nếu imagethum là mảng
                    .filter(Boolean) // Lọc bỏ null/undefined
                    .map((image, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={image}
                        alt={`product-thumbnail-${index}`}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 2,
                          boxShadow: 1,
                          border: "1px solid #ddd",
                        }}
                      />
                    ))}
                </Box>
              </Box>
              <Typography>
                <b>Status:</b> {selectedProductDetails.status}
              </Typography>
              {/* Bảng hiển thị Variants */}
              {selectedProductDetails.variants &&
                selectedProductDetails.variants.length > 0 && (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: "#a7adad" }}>
                        <TableRow>
                          <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                            Size
                          </TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                            Color
                          </TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                            Stock
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedProductDetails.variants.map(
                          (variant, index) => (
                            <TableRow key={index}>
                              <TableCell>{variant.size}</TableCell>
                              <TableCell>{variant.color}</TableCell>
                              <TableCell>{variant.stock}</TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
