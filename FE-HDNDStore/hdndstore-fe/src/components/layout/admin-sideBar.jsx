import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Dashboard,
  People,
  ShoppingCart,
  Receipt,
  BarChart,
  Logout,
  ExpandLess,
  ExpandMore,
  ArrowRight,
} from "@mui/icons-material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("Administrator");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Chưa có token, vui lòng đăng nhập!");
          return;
        }

        const response = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFullName(response.data.fullName);
        if (response.data.avatar) {
          setAvatar(response.data.avatar);
        }
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin user:",
          error.response?.data || error
        );
      }
    };

    fetchUserData();
  }, []);

  // Auto expand menu based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    menuItems.forEach((item) => {
      if (item.isParent && item.subMenus) {
        item.subMenus.forEach((subItem) => {
          if (currentPath.startsWith(subItem.path)) {
            setOpenMenus((prev) => ({ ...prev, [item.text]: true }));
          }
        });
      }
    });
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("promo_closed");

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("promo_closed_")) {
        localStorage.removeItem(key);
      }
    });

    navigate("/auth");
  };

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const isActiveParentRoute = (subMenus) => {
    return subMenus.some((subItem) => location.pathname.startsWith(subItem.path));
  };

  const menuItems = [
    { text: "Bảng điều khiển", icon: <Dashboard />, path: "/admin/dashboard" },
    { text: "Quản lý khách hàng", icon: <People />, path: "/admin/users" },
    {
      text: "Quản lý sản phẩm",
      icon: <ShoppingCart />,
      isParent: true,
      subMenus: [
        { text: "Giày nam", path: "/admin/products/men" },
        { text: "Giày nữ", path: "/admin/products/women" },
      ],
    },
    {
      text: "Quản lý đơn hàng",
      icon: <Receipt />,
      isParent: true,
      subMenus: [
        { text: "Chờ xác nhận", path: "/admin/orders/pending" },
        { text: "Đang giao", path: "/admin/orders/shipping" },
        { text: "Đã giao", path: "/admin/orders/delivered" },
        { text: "Đã hủy", path: "/admin/orders/canceled" },
      ],
    },
    { text: "Báo cáo doanth thu", icon: <BarChart />, path: "/admin/report" },
    {
      text: "Quản lý Khuyến Mãi",
      icon: <CardGiftcardIcon />,
      path: "/admin/voucher",
    },
  ];

  // Function to get initials from full name
  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          background: "linear-gradient(180deg, #1a2c40 0%, #2A3F54 100%)",
          color: "#FFFFFF",
          boxShadow: "0 0 15px rgba(0,0,0,0.2)",
          overflowX: "hidden",
        },
      }}
    >
      <Toolbar sx={{ display: "flex", flexDirection: "column", py: 2.5 }}>
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          mb: 2 
        }}>
          {avatar ? (
            <Avatar 
              src={avatar} 
              alt={fullName}
              sx={{ 
                width: 80, 
                height: 80, 
                mb: 1.5,
                border: "3px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
              }}
            />
          ) : (
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                mb: 1.5, 
                bgcolor: "#4caf50",
                fontSize: 32,
                fontWeight: 600,
                border: "3px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
              }}
            >
              {getInitials(fullName)}
            </Avatar>
          )}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              letterSpacing: 0.5,
              textShadow: "0 1px 2px rgba(0,0,0,0.3)"
            }}
          >
            {fullName}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.75,
              fontStyle: "italic",
              letterSpacing: 0.5
            }}
          >
            {role}
          </Typography>
        </Box>
        <Tooltip title="Đăng xuất" placement="right">
          <IconButton 
            onClick={handleLogout}
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.2)",
              },
              transition: "all 0.2s ease",
              mt: 1,
              mb: 0.5,
              color: "#ff5252",
            }}
          >
            <Logout fontSize="small" />
          </IconButton>
        </Tooltip>
      </Toolbar>
      
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mx: 2 }} />
      
      <List sx={{ px: 1, pt: 2 }}>
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.isParent ? (
              <>
                <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
                  <ListItemButton 
                    onClick={() => toggleMenu(item.text)}
                    sx={{
                      borderRadius: 1.5,
                      py: 1,
                      mb: 0.5,
                      backgroundColor: isActiveParentRoute(item.subMenus) 
                        ? "rgba(255,255,255,0.1)" 
                        : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.15)"
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: isActiveParentRoute(item.subMenus) ? "#fff" : "rgba(255,255,255,0.7)",
                        minWidth: "40px"
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: isActiveParentRoute(item.subMenus) ? 600 : 400,
                        letterSpacing: 0.2,
                      }}
                    />
                    {openMenus[item.text] ? 
                      <ExpandLess sx={{ color: "rgba(255,255,255,0.7)" }} /> : 
                      <ExpandMore sx={{ color: "rgba(255,255,255,0.7)" }} />
                    }
                  </ListItemButton>
                </ListItem>
                <Collapse
                  in={openMenus[item.text]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding sx={{ pl: 1 }}>
                    {item.subMenus.map((subItem, subIndex) => (
                      <ListItem key={subIndex} disablePadding sx={{ display: "block" }}>
                        <ListItemButton
                          onClick={() => navigate(subItem.path)}
                          sx={{
                            pl: 4,
                            py: 0.75,
                            borderRadius: 1.5,
                            mb: 0.5,
                            backgroundColor: isActiveRoute(subItem.path) 
                              ? "rgba(255,255,255,0.1)" 
                              : "transparent",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.15)"
                            },
                            transition: "all 0.2s",
                          }}
                        >
                          <ListItemIcon 
                            sx={{ 
                              color: isActiveRoute(subItem.path) ? "#fff" : "rgba(255,255,255,0.6)",
                              minWidth: "30px",
                              ml: -0.5,
                            }}
                          >
                            <ArrowRight fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontSize: 13,
                              fontWeight: isActiveRoute(subItem.path) ? 600 : 400,
                              letterSpacing: 0.2,
                              color: isActiveRoute(subItem.path) ? "#fff" : "rgba(255,255,255,0.8)",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
                <ListItemButton 
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 1.5,
                    py: 1,
                    backgroundColor: isActiveRoute(item.path) 
                      ? "rgba(255,255,255,0.1)" 
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)"
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isActiveRoute(item.path) ? "#fff" : "rgba(255,255,255,0.7)",
                      minWidth: "40px"
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: isActiveRoute(item.path) ? 600 : 400,
                      letterSpacing: 0.2,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </div>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Box sx={{ 
        p: 2, 
        backgroundColor: "rgba(0,0,0,0.15)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        mt: 2
      }}>
        <Typography variant="caption" sx={{ opacity: 0.6, display: "block", textAlign: "center" }}>
          HDND Store Admin Panel
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.6, display: "block", textAlign: "center" }}>
          © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default SideBar;