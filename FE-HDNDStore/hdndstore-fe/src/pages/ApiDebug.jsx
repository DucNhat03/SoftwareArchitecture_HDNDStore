import { useState } from 'react';
import { Container, Button, Form, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { apiCall } from '../services/api';

const ApiDebug = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [productId, setProductId] = useState('');
  const [directApiUrl, setDirectApiUrl] = useState('http://localhost:5002/products/');

  const testApi = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // Test sử dụng apiCall (với retry + rate limit)
      const response = await apiCall('get', `/products/${productId}`);
      setResult({
        source: 'apiCall',
        data: response
      });
    } catch (err) {
      setError({
        source: 'apiCall',
        message: err.message || 'Lỗi không xác định',
        details: JSON.stringify(err, null, 2)
      });
      
      // Nếu apiCall thất bại, thử gọi trực tiếp
      try {
        const directResponse = await axios.get(`${directApiUrl}${productId}`);
        setResult({
          source: 'directCall',
          data: directResponse.data
        });
      } catch (directErr) {
        setError({
          source: 'directCall',
          message: directErr.message || 'Lỗi không xác định khi gọi trực tiếp',
          details: JSON.stringify(directErr, null, 2)
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const testRedisConnection = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // Thử tạo một key test trước
      const createResponse = await axios.post('http://localhost:5006/api/redis', {
        key: 'test-key',
        data: { message: 'Test data created at ' + new Date().toISOString() }
      }, { timeout: 5000 });
      
      console.log('Redis SET success:', createResponse.data);
      
      // Sau đó thử lấy key đó
      const response = await axios.get('http://localhost:5006/api/redis/test-key', { timeout: 5000 });
      
      setResult({
        source: 'redisTest',
        data: {
          createResponse: createResponse.data,
          getResponse: response.data,
          status: 'Redis service đang chạy tốt và trả về đúng dữ liệu'
        }
      });
    } catch (error) {
      console.log('Redis test error:', error.message);
      setError({
        source: 'redisTest',
        message: error.message || 'Lỗi kết nối Redis',
        details: JSON.stringify(error, null, 2)
      });
      
      // Thêm thông tin hướng dẫn khắc phục
      setResult({
        source: 'redisHelp',
        data: {
          message: 'Không thể kết nối đến Redis service. Có thể Redis service chưa được khởi động.',
          possibleSolutions: [
            '1. Khởi động Redis service: cd BE-HDNDStore/redis-service && node server.js',
            '2. Ứng dụng vẫn hoạt động được với Redis giả lập, không cần Redis server thật.',
            '3. Đảm bảo không có ứng dụng nào khác đang sử dụng cổng 5006.'
          ],
          note: 'Bạn vẫn có thể xem chi tiết sản phẩm với Redis giả lập.'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getAllProducts = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:5002/products/all');
      setResult({
        source: 'allProducts',
        data: response.data
      });
    } catch (err) {
      setError({
        source: 'allProducts',
        message: err.message || 'Lỗi lấy tất cả sản phẩm',
        details: JSON.stringify(err, null, 2)
      });
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm chuyển đến trang chi tiết sản phẩm
  const goToProductDetail = () => {
    if (!productId) {
      alert('Vui lòng nhập ID sản phẩm trước');
      return;
    }
    
    // Lưu sản phẩm vào localStorage (phương pháp cũ)
    if (result && (result.data.data || result.data)) {
      const productData = result.data.data || result.data;
      localStorage.setItem('selectedProduct', JSON.stringify(productData));
      
      // Mở trang chi tiết sản phẩm
      window.open(`/chi-tiet-san-pham?id=${productId}`, '_blank');
    } else {
      alert('Vui lòng lấy thông tin sản phẩm trước');
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">API Debug Tool</h1>
      
      <Card className="mb-4">
        <Card.Header>Test Product API</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Product ID</Form.Label>
            <Form.Control 
              type="text" 
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Nhập ID sản phẩm"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Direct API URL</Form.Label>
            <Form.Control 
              type="text" 
              value={directApiUrl}
              onChange={(e) => setDirectApiUrl(e.target.value)}
              placeholder="URL API trực tiếp"
            />
          </Form.Group>
          
          <div className="d-flex gap-2 mb-3">
            <Button 
              variant="primary" 
              onClick={testApi}
              disabled={loading || !productId}
            >
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Đang kiểm tra...
                </>
              ) : 'Kiểm tra API sản phẩm'}
            </Button>
            
            <Button 
              variant="info" 
              onClick={getAllProducts}
              disabled={loading}
            >
              Lấy tất cả sản phẩm
            </Button>
            
            <Button 
              variant="warning" 
              onClick={testRedisConnection}
              disabled={loading}
            >
              Kiểm tra Redis
            </Button>
          </div>
          
          {result && result.source.includes('product') && (
            <Button
              variant="success"
              onClick={goToProductDetail}
              disabled={!result || !productId}
              className="mt-2"
            >
              Xem chi tiết sản phẩm
            </Button>
          )}
        </Card.Body>
      </Card>
      
      {error && (
        <Alert variant="danger">
          <h5>Lỗi từ {error.source}</h5>
          <p>{error.message}</p>
          <pre className="bg-light p-3 rounded small">
            {error.details}
          </pre>
        </Alert>
      )}
      
      {result && (
        <Card className="mb-4">
          <Card.Header>Kết quả từ {result.source}</Card.Header>
          <Card.Body>
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ApiDebug; 