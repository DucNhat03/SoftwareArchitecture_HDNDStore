import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import RobotoFont from "./roboto";

export const generateInvoicePDF = (selectedOrderDetails) => {
  const doc = new jsPDF();
  
  // Đăng ký font chữ Roboto
  doc.addFileToVFS("Roboto-Regular.ttf", RobotoFont);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");

  let y = 10; // Vị trí dòng

  // Tiêu đề cửa hàng
  doc.setFontSize(20);
  doc.setFont("Roboto");
  doc.text("CỬA HÀNG GIÀY DÉP HDND", 60, y);
  y += 8;

  doc.setFontSize(12);
  doc.setFont("Roboto", "normal");
  doc.text("Địa chỉ: 12 Nguyễn Văn Bảo, Quận Gò Vấp, TP.HCM", 20, y);
  y += 6;
  doc.text("SĐT: 0123 456 789 | Email: hdndshop@gmail.com", 20, y);
  y += 6;
  doc.text("--------------------------------------------------------------------------------------------------------------------------------------------------", 20, y);
  y += 10; 

  // Tiêu đề hóa đơn
  doc.setFontSize(18);
  doc.setFont("Roboto");
  doc.text("HÓA ĐƠN BÁN HÀNG", 75, y);
  y += 10;

  doc.setFontSize(12);
  doc.setFont("Roboto", "normal");
  doc.text(`Mã Hóa Đơn: ${selectedOrderDetails.idHoaDon}`, 20, y);
  doc.text(`Ngày Lập: ${new Date(selectedOrderDetails.orderDate).toLocaleDateString()}`, 130, y);
  y += 8;
  doc.text(`Khách Hàng: ${selectedOrderDetails.customerName}`, 20, y);
  doc.text(`Số Điện Thoại: ${selectedOrderDetails.customerPhone}`, 130, y);
  y += 8;
  doc.text(`Địa Chỉ Giao Hàng: ${selectedOrderDetails.customerAddress}`, 20, y);
  y += 8;
  doc.text(`Phương Thức Thanh Toán: ${selectedOrderDetails.paymentMethod}`, 20, y);
  doc.text(`Trạng Thái Thanh Toán: ${selectedOrderDetails.statusPayment}`, 130, y);
  y += 8;
  doc.text(`Trạng Thái Hóa Đơn: ${selectedOrderDetails.status}`, 20, y);
  y += 8;

  // Nếu hóa đơn đã hủy, thêm ngày hủy và lý do hủy
  if (selectedOrderDetails.status === "Đã hủy") {
    doc.text(`Ngày Hủy: ${new Date(selectedOrderDetails.ngayHuy).toLocaleDateString()}`, 20, y);
    y += 8;
    doc.text(`Lý Do Hủy: ${selectedOrderDetails.lyDoHuy}`, 20, y);
    y += 10;
  }

  // Nếu hóa đơn đã giao, thêm ngày giao hàng
  if (selectedOrderDetails.status === "Đã giao") {
    doc.text(`Ngày Giao: ${new Date(selectedOrderDetails.ngayNhanHang).toLocaleDateString()}`, 20, y);
    y += 10;
  }

  if (selectedOrderDetails.ghiChu) {
    doc.text(`Ghi Chú: ${selectedOrderDetails.note}`, 20, y);
    y += 10;
  }

  // Bảng danh sách sản phẩm
  const tableColumn = ["Product", "Quantity", "Size", "Color", "Price", "Total"];
  const tableRows = [];

  selectedOrderDetails.cartItems.forEach((item) => {
    item.variants.forEach((variant) => {
      tableRows.push([
        item.name,
        variant.stock,
        variant.size || "Không có",
        variant.color || "Không có",
        `${item.price.toLocaleString()}đ`,
        `${(item.price * variant.stock).toLocaleString()}đ`,
      ]);
    });
  });

  autoTable(doc, {
    startY: y + 5, 
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    styles: { fontSize: 10, font: "Roboto" },
    headStyles: { font: "Roboto", fillColor: [41, 128, 185], textColor: [255, 255, 255] },
    didParseCell: (data) => {
      data.cell.styles.font = "Roboto"; // Đảm bảo mọi ô đều dùng font Roboto
    },
  });

  const finalY = doc.lastAutoTable.finalY || y + 10;

  // Hiển thị tổng tiền
  doc.setFontSize(12);
  doc.setFont("Roboto");
  doc.text(`TỔNG TIỀN: ${selectedOrderDetails.finalAmount.toLocaleString()}đ`, 130, finalY + 10);

  // Chữ ký
  const signY = finalY + 30;
  doc.setFont("Roboto", "normal");
  doc.text("Người bán hàng", 20, signY);
  doc.text("(Ký tên)", 30, signY + 10);
  doc.text("Khách hàng", 130, signY);
  doc.text("(Ký tên)", 140, signY + 10);

  // Xuất file PDF
  doc.save(`HoaDon_${selectedOrderDetails.idHoaDon}.pdf`);
};
