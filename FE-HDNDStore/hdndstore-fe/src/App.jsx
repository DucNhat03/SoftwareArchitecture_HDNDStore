import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routers/auth";
import ScrollToTop from "./components/utils/ScrollToTop";
import PromoModal from "./components/utils/PromoModal";

const App = () => {
  return (
    <Router>
      <PromoModal />
      <ScrollToTop /> {/* Gọi component ScrollToTop */}
      <AppRoutes /> {/* Gọi routes từ folder routes */}
    </Router>
  );
};

export default App;
