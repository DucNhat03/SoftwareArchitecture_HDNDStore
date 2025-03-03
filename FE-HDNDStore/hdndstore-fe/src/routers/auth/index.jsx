import { Routes, Route } from "react-router-dom";
import AuthPage from "../../pages/AuthPage";
import ProfilePage from "../../pages/ProfilePage";
import Home from "../../pages/Home";
import Category from "../../pages/Category";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/category" element={<Category />} />

      {/* 404 - Không tìm thấy trang */}
      <Route path="*" element={<h2 className="text-center mt-5">404 - Không tìm thấy trang</h2>} />
    </Routes>
  );
};

export default AppRoutes;
