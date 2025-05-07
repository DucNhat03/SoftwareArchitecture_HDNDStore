/**
 * Format số thành định dạng tiền tệ VNĐ
 * @param {number} amount - Số tiền cần format
 * @param {boolean} showSymbol - Có hiển thị đơn vị tiền tệ không
 * @returns {string} - Chuỗi đã được format
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === undefined || amount === null) return 'Liên hệ';
  
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(amount);
};

/**
 * Rút gọn text nếu dài hơn một độ dài nhất định
 * @param {string} text - Chuỗi cần rút gọn
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Chuỗi đã rút gọn
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}; 