import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaList,
  FaAngleDown,
} from "react-icons/fa";
import "../../styles/Header.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/img-shop/logo-txt.png";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(null); // Điều khiển submenu trên mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024); // Xác định thiết bị
  const navigate = useNavigate();

  // Cập nhật trạng thái khi resize màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isAuthenticated = !!localStorage.getItem("token");
  const handleAuth = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/auth");
    }
  };

  const handleCartClick = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("Vui lòng đăng nhập để xem giỏ hàng !", {
        position: "top-center",
      });
      // Đợi 2 giây (2000ms) trước khi chuyển hướng
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
      return;
    }

    navigate("/cart");
  };

  const menuItems = [
    {
      name: "GIÁ ƯU ĐÃI",
      link: "/category",
      submenu: ["79K", "99K - 199K", "149K - 159K", "GIÁ ĐẶT BIỆT"],
    },
    {
      name: "GIÀY NỮ",
      link: "/category",
      submenu: [
        "GIÀY CAO GÓT",
        "GIÀY THỂ THAO",
        "SANDAL NỮ",
        "DÉP SỤC",
        "GIÀY BÚP BÊ & MỌI",
        "OXFORD & BOOT",
        "DÉP NỮ",
      ],
    },
    {
      name: "GIÀY NAM",
      link: "/category",
      submenu: [
        "GIÀY THỂ THAO NAM",
        "SANDAL NAM",
        "DÉP NAM",
        "GIÀY TÂY & SLIP ON",
        "BOOT NAM & OXFORD",
      ],
    },
    { name: "GIÀY CẶP", link: "/category" },
    {
      name: "BALO - TÚI",
      link: "/category",
      submenu: ["Balo laptop, du lịch, thời trang", "Túi đeo chéo"],
    },
    { name: "SALE 50%", link: "/category" },
    { name: "SẢN PHẨM BÁN CHẠY", link: "/category" },
    {
      name: "PHỤ KIỆN",
      link: "/category",
      submenu: ["Vớ", "Dây giày", "Chai vệ sinh giày", "Đế lót"],
    },
  ];

  return (
    <header className="header">
      <nav className="nav">
        <button
          className="menu_button btn btn-link"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FaList size={24} />
        </button>
        {/**  <a href="/home" className="nav_logo">
          HDND STORE
        </a>*/}

        <a href="/home" className="nav_logo">
          <img src={logo} alt="logo" height={70} />
        </a>

        <ul className="nav_items m-0 p-0">
          {menuItems.map((item, index) => (
            <li className="nav_item" key={index}>
              <a href={item.link} className="nav_link">
                {item.name}
              </a>
              {isMobile && item.submenu && (
                <button
                  className="submenu_toggle"
                  onBlur={() =>
                    setShowSubmenu(showSubmenu === index ? null : index)
                  }
                >
                  {/* <FaAngleDown /> */}
                </button>
              )}
              {item.submenu && (isMobile ? showSubmenu === index : true) && (
                <ul className="submenu">
                  {item.submenu.map((sub, subIndex) => (
                    <li key={subIndex}>
                      <a href="/category">{sub}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="nav_right">
          <div className="search_box">
            <input type="text" placeholder="Tìm kiếm..." />
            <FaSearch className="search_icon" />
          </div>
          <button className="button" onClick={() => handleAuth()}>
            <FaUser />
          </button>

          <div
            className="cart_box"
            // onClick={() => navigate("/cart")}
            style={{ cursor: "pointer" }}
          >
            <div
              className="cart_box"
              onClick={handleCartClick}
              style={{ cursor: "pointer" }}
            >
              <FaShoppingCart />
              <div className="cart_count">1</div>
            </div>
          </div>

          <div className="nav_right-reponsive">
            <button className="btn btn-link">
              <FaSearch size={24} />
            </button>
            <button className="btn btn-link" onClick={() => handleAuth()}>
              <FaUser size={24} />
            </button>
            <button className="btn btn-link">
              <FaShoppingCart size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="menu" style={{ display: showMenu ? "block" : "none" }}>
        <ul className="menu_items">
          {menuItems.map((item, index) => (
            <li className="menu_item" key={index}>
              <a href={item.link} className="menu_link">
                {item.name}
              </a>
              {isMobile && item.submenu && (
                <button
                  className="submenu_toggle"
                  onClick={() =>
                    setShowSubmenu(showSubmenu === index ? null : index)
                  }
                >
                  <FaAngleDown />
                </button>
              )}
              {item.submenu && (isMobile ? showSubmenu === index : true) && (
                <ul className="submenu">
                  {item.submenu.map((sub, subIndex) => (
                    <li key={subIndex}>
                      <a href="/category">{sub}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
