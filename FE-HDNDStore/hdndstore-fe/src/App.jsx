import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routers/auth";
import ScrollToTop from "./components/utils/ScrollToTop";
import PromoModal from "./components/utils/PromoModal";
import ZaloButton from "./components/utils/ZaloButton"; 
import RateLimitAlert from "./components/RateLimitAlert";

const App = () => {
  return (
    <Router>
      <RateLimitAlert />
      <PromoModal />
      <ZaloButton /> 
      <ScrollToTop />
      <AppRoutes /> 
    </Router>
  );
};

export default App;
