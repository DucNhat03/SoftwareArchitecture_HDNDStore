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

const AppRoutes = () => {
  return (
    <>
      <ToastContainer /> {/* Hiển thị toast */}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/cart" element={<Cart />} /> {/* Thêm route cho Cart */}
        <Route path="/chi-tiet-san-pham" element={<ProductDetail />} /> { }
        <Route path="/dat-hang-thanh-cong" element={<OrderSuccess />} /> { }


        {/* 404 - Không tìm thấy trang */}
        <Route path="*" element={<h2 className="text-center mt-5">404 - Không tìm thấy trang</h2>} />
      </Routes>
    </>
    
  );
};

export default AppRoutes;
