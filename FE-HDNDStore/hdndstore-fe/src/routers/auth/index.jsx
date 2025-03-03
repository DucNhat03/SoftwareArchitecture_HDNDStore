import { Routes, Route } from "react-router-dom";
import AuthPage from "../../pages/AuthPage";
import ProfilePage from "../../pages/ProfilePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* 404 - Không tìm thấy trang */}
      <Route path="*" element={<h2 className="text-center mt-5">404 - Không tìm thấy trang</h2>} />
    </Routes>
  );
};

export default AppRoutes;
