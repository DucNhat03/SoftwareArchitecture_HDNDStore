import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routers/auth";
import ScrollToTop from "./components/utils/ScrollToTop";
import PromoModal from "./components/utils/PromoModal";
import ZaloButton from "./components/utils/ZaloButton"; 

const App = () => {
  return (
    <Router>
      <PromoModal />
      <ZaloButton /> 
      <ScrollToTop />
      <AppRoutes /> 
    </Router>
  );
};

export default App;
