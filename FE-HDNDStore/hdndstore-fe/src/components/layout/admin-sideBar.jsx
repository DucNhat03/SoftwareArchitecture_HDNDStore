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
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const sideBar = () => {
  return (
        <Drawer
          variant="permanent"
          sx={{
            width: 260,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 260,
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
                path: "/products",
                isParent: true,
              },
              { text: "Quản lý đơn hàng", icon: <Receipt />, path: "/admin/orders" },
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
                      <ListItemButton onClick={handleProductsClick}>
                        <ListItemIcon sx={{ color: "#fff" }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                        {openProducts ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>
                    <Collapse in={openProducts} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
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
                            onClick={() => navigate("/admin/products/women")}
                          >
                            <ListItemText primary="Giày nữ" />
                          </ListItemButton>
                        </ListItem>
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

export default sideBar;