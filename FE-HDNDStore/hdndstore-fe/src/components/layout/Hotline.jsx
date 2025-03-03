import React from "react";
import { FaFacebook, FaInstagramSquare, FaYoutube, FaTiktok } from "react-icons/fa";

const Hotline = () => {
  return (
    <div className="hotline px-2 py-4 container">
      <hr />
      <div className="row px-4">
        {/* Hotline mua hàng và khiếu nại */}
        <div className="col-sm-4">
          <div className="hotline-info text-dark" align="left">
            <p className="p-0 m-0">GỌI MUA HÀNG ONLINE (08:00 - 21:00 mỗi ngày)</p>
            <h5 className="py-2 m-0 hover-primary">1900.633.349</h5>
            <p className="p-0 m-0" style={{ fontSize: "13px" }}>
              Tất cả các ngày trong tuần (Trừ tết Âm Lịch)
            </p>
          </div>
          <div className="hotline-info text-dark mt-4" align="left">
            <p className="p-0 m-0">GÓP Ý & KHIẾU NẠI (08:30 - 20:30)</p>
            <h5 className="py-2 m-0 hover-primary">1900.633.349</h5>
            <p className="p-0 m-0" style={{ fontSize: "13px" }}>
              Tất cả các ngày trong tuần (Trừ tết Âm Lịch)
            </p>
          </div>
        </div>

        {/* Thông tin */}
        <div className="col-sm-4">
          <div className="hotline-info text-dark" align="left">
            <p className="p-0 m-0">THÔNG TIN</p>
            <ul>
              <li><a href="#" className="hover-primary">Giới thiệu về MWC</a></li>
              <li><a href="#" className="hover-primary">Thông tin Website thương mại điện tử</a></li>
              <li><a href="#" className="hover-primary">Than Phiền Góp Ý</a></li>
              <li><a href="#" className="hover-primary">Chính sách và quy định</a></li>
            </ul>
          </div>
        </div>

        {/* FAQ & Social */}
        <div className="col-sm-4">
          <div className="hotline-info text-dark" align="left">
            <p className="p-0 m-0">FAQ</p>
            <ul>
              <li><a href="#" className="hover-primary">Vận chuyển</a></li>
              <li><a href="#" className="hover-primary">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover-primary">Chính sách đổi trả bảo hành</a></li>
              <li className="d-flex" style={{ flexWrap: "wrap", gap: "15px" }}>
                <a href="#"><FaFacebook size={24}/></a>
                <a href="#"><FaInstagramSquare size={24}/></a>
                <a href="#"><FaYoutube size={24}/></a>
                <a href="#"><FaTiktok size={24}/></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotline;
