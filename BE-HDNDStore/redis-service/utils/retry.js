/**
 * Hàm trễ (delay) Promise
 * @param {number} ms Thời gian trễ tính bằng milliseconds
 * @returns {Promise<void>} Promise sẽ resolve sau khoảng thời gian trễ
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Thực hiện hàm với logic retry
 * @param {Function} fn Hàm cần thực hiện (phải trả về Promise)
 * @param {number} maxRetries Số lần retry tối đa (mặc định là 3)
 * @param {number} delayMs Thời gian trễ giữa các lần retry (mặc định là 5000ms = 5s)
 * @returns {Promise} Kết quả của hàm fn sau khi thực hiện thành công
 * @throws {Error} Lỗi cuối cùng nếu tất cả các lần retry đều thất bại
 */
const retry = async (fn, maxRetries = 3, delayMs = 5000) => {
  let lastError;
  let attemptCount = 0;
  
  // Biến jitter để làm ngẫu nhiên thời gian delay (3-5s)
  const getJitteredDelay = () => {
    // Random trong khoảng 3-5 giây
    const minDelay = 3000; // 3 seconds
    const maxDelay = 5000; // 5 seconds
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  };
  
  while (attemptCount <= maxRetries) {
    try {
      if (attemptCount > 0) {
        console.log(`[Retry] Attempt ${attemptCount}/${maxRetries}`);
      }
      
      // Thử thực hiện hàm
      const result = await fn();
      
      // Nếu thành công sau các lần retry, log thông tin
      if (attemptCount > 0) {
        console.log(`[Retry] Succeeded after ${attemptCount} retries`);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      attemptCount++;
      
      // Nếu đã hết số lần retry, throw lỗi
      if (attemptCount > maxRetries) {
        console.error(`[Retry] Failed after ${maxRetries} retries`);
        break;
      }
      
      // Tính thời gian delay cho lần retry tiếp theo
      const jitteredDelay = getJitteredDelay();
      console.log(`[Retry] Attempt ${attemptCount} failed. Error: ${error.message}`);
      console.log(`[Retry] Retrying in ${jitteredDelay/1000} seconds...`);
      
      // Chờ trước khi thực hiện lần retry tiếp theo
      await delay(jitteredDelay);
    }
  }
  
  // Nếu đến đây, tất cả các lần retry đều thất bại
  throw lastError;
};

module.exports = retry; 