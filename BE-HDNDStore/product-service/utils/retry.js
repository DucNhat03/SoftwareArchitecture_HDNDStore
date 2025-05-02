/**
 * Utility function to retry operations
 * @param {Function} fn - Function to retry
 * @param {Object} options - Options for retry
 * @param {number} options.maxRetries - Maximum number of retries
 * @param {number} options.retryDelay - Delay between retries in milliseconds
 * @param {Function} options.shouldRetry - Function that decides if retry should be attempted based on error
 * @returns {Promise<any>} - Result of the function
 */
const retry = async (fn, options = {}) => {
  const maxRetries = options.maxRetries || 3;
  const retryDelay = options.retryDelay || 3000;
  
  // Default shouldRetry function - retry for any error except 4xx status codes
  const shouldRetry = options.shouldRetry || ((error) => {
    // Don't retry for 4xx errors (client errors) except for 429 (rate limit)
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return error.response.status === 429; // Only retry rate limit errors
    }
    return true; // Retry other errors (network, 5xx, etc.)
  });
  
  let retryCount = 0;
  
  const attemptOperation = async () => {
    try {
      return await fn();
    } catch (error) {
      retryCount++;
      
      if (retryCount < maxRetries && shouldRetry(error)) {
        console.log(`Attempt ${retryCount} failed. Retrying in ${retryDelay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return attemptOperation();
      }
      
      // If we've exhausted our retries or shouldn't retry this error, throw it
      throw error;
    }
  };
  
  return attemptOperation();
};

module.exports = retry; 