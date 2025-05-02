// Utility to implement rate limiting for API calls
class RateLimiter {
  constructor(maxRequests = 5, timeWindow = 60000) {
    this.maxRequests = maxRequests; // Maximum 5 requests
    this.timeWindow = timeWindow; // Within 1 minute (60000 ms)
    this.requests = [];
    this.blocked = false;
    this.blockTimer = null;
  }

  // Check if the request can proceed
  canMakeRequest() {
    if (this.blocked) {
      return false;
    }
    
    const now = Date.now();
    
    // Remove requests older than the time window
    this.requests = this.requests.filter(timestamp => now - timestamp < this.timeWindow);
    
    // Check if we've exceeded the maximum number of requests
    if (this.requests.length >= this.maxRequests) {
      this.blocked = true;
      
      // Calculate remaining time
      const oldestRequest = this.requests[0];
      const remainingTime = this.timeWindow - (now - oldestRequest);
      
      // Set a timer to unblock after the time window expires
      this.blockTimer = setTimeout(() => {
        this.blocked = false;
        this.requests = [];
      }, remainingTime);
      
      return false;
    }
    
    // Add current timestamp to requests
    this.requests.push(now);
    return true;
  }

  // Get the remaining time until unblocked (in seconds)
  getRemainingTime() {
    if (!this.blocked) {
      return 0;
    }
    
    const now = Date.now();
    const oldestRequest = this.requests[0];
    return Math.ceil((this.timeWindow - (now - oldestRequest)) / 1000);
  }

  // Clear the limiter state
  clear() {
    this.requests = [];
    this.blocked = false;
    if (this.blockTimer) {
      clearTimeout(this.blockTimer);
      this.blockTimer = null;
    }
  }
}

// Create and export a singleton instance
const rateLimiter = new RateLimiter();
export default rateLimiter; 