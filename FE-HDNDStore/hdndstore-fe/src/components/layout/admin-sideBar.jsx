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
} from "@mui/material";
import {
  Dashboard,
  People,
  ShoppingCart,
  Receipt,
  BarChart,
  Settings,
  Logout,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

 const userId = localStorage.getItem("userId");
 console.log("User ID:", userId); // Log the userId to the console

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

  const menuItems = [
    { text: "Bảng điều khiển", icon: <Dashboard />, path: "/" },
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
        { text: "Đã hủy", path: "/admin/orders/canceled" }
      ],
    },
    { text: "Báo cáo doanh thu", icon: <BarChart />, path: "/admin/report" },
    {
      text: "Quản lý Khuyến Mãi",
      icon: <CardGiftcardIcon />,
      path: "/admin/voucher",
    },
    { text: "Cài đặt hệ thống", icon: <Settings />, path: "/" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          backgroundColor: "#2A3F54", // Xanh navy đậm
          color: "#FFFFFF", // Màu chữ trắng
        },
      }}
    >
      <Toolbar>
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            DuyNgayXua
          </Typography>
          <IconButton color="error" sx={{ mt: 1 }}>
            <Logout onClick={() => handleLogout()} />
          </IconButton>
        </Box>
      </Toolbar>
      <List>
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.isParent ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => toggleMenu(item.text)}>
                    <ListItemIcon sx={{ color: "#fff" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {openMenus[item.text] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse
                  in={openMenus[item.text]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subMenus.map((subItem, subIndex) => (
                      <ListItem key={subIndex} disablePadding>
                        <ListItemButton
                          sx={{ pl: 4 }}
                          onClick={() => navigate(subItem.path)}
                        >
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
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
  );
};

export default SideBar;
