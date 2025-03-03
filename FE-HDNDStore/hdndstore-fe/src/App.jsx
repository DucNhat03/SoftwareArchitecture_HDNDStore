import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routers/auth";

const App = () => {
  return (
    <Router>
      <AppRoutes /> {/* Gọi routes từ folder routes */}
    </Router>
  );
};

export default App;
