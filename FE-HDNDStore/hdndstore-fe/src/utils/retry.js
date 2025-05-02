// Utility to implement retry logic for failed API calls

/**
 * Delay function to wait for a specified time (in milliseconds)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the specified time
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry a function execution with exponential backoff
 * @param {Function} fn - The function to retry (should return a Promise)
 * @param {Object} options - Configuration options
 * @param {number} options.maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} options.initialDelayMs - Initial delay in milliseconds (default: 3000)
 * @param {boolean} options.exponentialBackoff - Whether to use exponential backoff (default: true)
 * @returns {Promise} - Promise that resolves with the function result or rejects after all retries fail
 */
const retry = async (fn, options = {}) => {
  const { 
    maxRetries = 3, 
    initialDelayMs = 3000, 
    exponentialBackoff = true 
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries + 1; attempt++) {
    try {
      // Try to execute the function
      return await fn();
    } catch (error) {
      lastError = error;
      
      // If this was the last attempt, don't retry
      if (attempt >= maxRetries) {
        break;
      }
      
      // Calculate delay time (with exponential backoff if enabled)
      const delayTime = exponentialBackoff 
        ? initialDelayMs * Math.pow(2, attempt) 
        : initialDelayMs;
      
      console.log(`API call failed (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delayTime/1000}s...`);
      
      // Wait before the next retry
      await delay(delayTime);
    }
  }
  
  // If we got here, all retries failed
  console.error(`All retry attempts failed after ${maxRetries + 1} attempts.`);
  throw lastError;
};

export default retry; 