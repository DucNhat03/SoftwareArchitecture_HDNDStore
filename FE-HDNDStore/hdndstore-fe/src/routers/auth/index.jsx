import { Routes, Route } from "react-router-dom";
import AuthPage from "../../pages/AuthPage";
import ProfilePage from "../../pages/ProfilePage";
import Home from "../../pages/Home";
import Category from "../../pages/Category";
import Cart from "../../components/Cart/Cart"; // Import Cart.jsx
import ProductDetail from "../../components/ProductDetail/ProductDetail";
import OrderSuccess from "../../components/OrderSuccess/OrderSuccess";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

{/* Admin */}
// import Account from "../../pages/admin/screens/account.jsx";
import User from "../../pages/admin/screens/user.jsx";
import OrderPending from "../../pages/admin/screens/orderpending.jsx";
import OrderShipping from "../../pages/admin/screens/ordershipping.jsx";
import OrderDelivered from "../../pages/admin/screens/orderdelivered.jsx";
import OrderCanceled from "../../pages/admin/screens/ordercanceled.jsx";
import ProductMen from "../../pages/admin/screens/productmen.jsx";
import ProductWomen from "../../pages/admin/screens/productwomen.jsx";



const AppRoutes = () => {
  return (
    <>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ToastContainer /> {/* Hiển thị toast */}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/cart" element={<Cart />} /> {/* Thêm route cho Cart */}
        <Route path="/chi-tiet-san-pham" element={<ProductDetail />} /> { }
        <Route path="/dat-hang-thanh-cong" element={<OrderSuccess />} /> { }

        {/* Admin */}
        {/* <Route path="/admin/account" element={<Account />} /> */}
        <Route path="/admin/users" element={<User />} />
        <Route path="/admin/orders/pending" element={<OrderPending/>} />
        <Route path="/admin/orders/shipping" element={<OrderShipping/>} />
        <Route path="/admin/orders/delivered" element={<OrderDelivered/>} />
        <Route path="/admin/orders/canceled" element={<OrderCanceled/>} />
        <Route path="/admin/products/men" element={<ProductMen/>} />
        <Route path="/admin/products/women" element={<ProductWomen/>} />


        {/* 404 - Không tìm thấy trang */}
        <Route path="*" element={<h2 className="text-center mt-5">404 - Không tìm thấy trang</h2>} />
      </Routes>
      </GoogleOAuthProvider>
    </>
    
  );
};

export default AppRoutes;
