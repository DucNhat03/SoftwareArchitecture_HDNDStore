import Header from "../components/layout/Header";
import AuthSwitcher from "../components/auth/AuthSwitcher";
import Hotline from "../components/layout/Hotline";
import Footer from "../components/layout/Footer";

const AuthPage = () => {
  return (
    <div>
      <Header />
      <AuthSwitcher />
      <Hotline />
      <Footer />
    </div>
  );
};

export default AuthPage;
