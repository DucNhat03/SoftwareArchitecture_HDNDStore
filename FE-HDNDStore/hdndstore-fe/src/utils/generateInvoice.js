import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import RobotoFont from "./roboto";

export const generateInvoicePDF = (selectedOrderDetails) => {
  const doc = new jsPDF();
  // Đăng ký font
  doc.addFileToVFS("Roboto-Regular.ttf", RobotoFont);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");


  // Tiêu đề cửa hàng
  doc.setFontSize(16);
  doc.setFont("Roboto", "bold");
  doc.text("CỬA HÀNG GIÀY DÉP HDND", 60, 10);
  doc.setFontSize(12);
  doc.setFont("Roboto", "normal");
  doc.text("Địa chỉ: 12 Nguyễn Văn Bảo, Quận Gò Vấp, TP.HCM", 20, 20);
  doc.text("SĐT: 0123 456 789 - Email: hdndshop@gmail.com", 20, 30);
  doc.text("-------------------------------------------------------------", 20, 35);

  // Thông tin đơn hàng
  doc.setFontSize(14);
  doc.text("HÓA ĐƠN BÁN HÀNG", 75, 45);
  doc.setFontSize(12);
  doc.text(`Mã Hóa Đơn: ${selectedOrderDetails.idHoaDon}`, 20, 55);
  doc.text(`Ngày: ${new Date(selectedOrderDetails.orderDate).toLocaleDateString()}`, 130, 55);
  doc.text(`Khách Hàng: ${selectedOrderDetails.customerName}`, 20, 65);
  doc.text(`Địa Chỉ Giao Hàng: ${selectedOrderDetails.receiver}`, 20, 75);
  doc.text(`Phương Thức Thanh Toán: ${selectedOrderDetails.paymentMethod}`, 20, 85);
  doc.text(`Trạng Thái: ${selectedOrderDetails.status}`, 130, 85);

  // Bảng danh sách sản phẩm
  const tableColumn = ["Tên sản phẩm", "Số lượng", "Size", "Màu sắc", "Giá", "Thành tiền"];
  const tableRows = [];

  selectedOrderDetails.cartItems.forEach((item) => {
    item.variants.forEach((variant) => {
      tableRows.push([
        item.name,
        variant.stock,
        variant.size || "Không có",
        variant.color || "Không có",
        `${item.price}đ`,
        `${item.price * variant.stock}đ`,
      ]);
    });
  });

  // 💡 Gọi autoTable ĐÚNG CÚ PHÁP (truyền doc)
  autoTable(doc, {
    startY: 95,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
  });

  // 💡 Lấy vị trí cuối cùng của bảng
  const finalY = doc.lastAutoTable.finalY || 95;

  // Tổng tiền
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`TỔNG TIỀN: ${selectedOrderDetails.finalAmount}đ`, 130, finalY + 10);

  // Chữ ký
  doc.setFont("helvetica", "normal");
  doc.text("Người bán hàng", 20, finalY + 30);
  doc.text("(Ký tên)", 30, finalY + 40);
  doc.text("Khách hàng", 130, finalY + 30);
  doc.text("(Ký tên)", 140, finalY + 40);

  // Xuất file PDF
  doc.save(`HoaDon_${selectedOrderDetails.idHoaDon}.pdf`);
};
