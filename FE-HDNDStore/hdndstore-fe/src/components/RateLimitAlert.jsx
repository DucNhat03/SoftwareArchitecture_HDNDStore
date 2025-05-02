import { useState, useEffect } from 'react';
import rateLimiter from '../utils/rateLimiter';

const RateLimitAlert = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // Function to check rate limiter status
    const checkRateLimiter = () => {
      if (rateLimiter.blocked) {
        setRemainingTime(rateLimiter.getRemainingTime());
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Set up interval to check status
    const intervalId = setInterval(checkRateLimiter, 1000);

    // Set up event listener for rate limiter events
    const handleRateLimitEvent = (event) => {
      if (event.detail && event.detail.isRateLimited) {
        checkRateLimiter();
      }
    };

    // Create custom event for rate limiter
    window.addEventListener('ratelimit', handleRateLimitEvent);

    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('ratelimit', handleRateLimitEvent);
    };
  }, []);

  // Don't render anything if not visible
  if (!isVisible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#ff6b6b',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      <div style={{ fontWeight: 'bold' }}>⚠️ Cảnh báo giới hạn tốc độ!</div>
      <div>
        Quá nhiều yêu cầu. Vui lòng thử lại sau {remainingTime} giây.
      </div>
    </div>
  );
};

export default RateLimitAlert; 