import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import "../../styles/Header.css"; 

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <a href="#" className="nav_logo">
          HDND STORE
        </a>
        <ul className="nav_items">
          {[
            "GIÁ ƯU ĐÃI",
            "GIÀY NỮ",
            "GIÀY NAM",
            "GIÀY CẶP",
            "BALO - TÚI",
            "SALE 50%",
            "SẢN PHẨM BÁN CHẠY",
            "PHỤ KIỆN",
          ].map((item, index) => (
            <li className="nav_item" key={index}>
              <a href="#" className="nav_link">
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav_right">
          <div className="search_box">
            <input type="text" placeholder="Tìm kiếm..." />
            <FaSearch className="search_icon" />
          </div> 
          <button className="button" onClick={()=> {alert('Ẩn hiện form!!!')}}>
            <FaUser />
          </button>

          <div className="cart_box">
            <FaShoppingCart />
            <div className="cart_count">1</div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
