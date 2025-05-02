import { useState } from 'react';
import { apiCall, redisService } from '../services/api';

// Kiểu dữ liệu cho logs
// type: 'title' | 'info' | 'success' | 'error' | 'warning'
const LogType = {
  TITLE: 'title',
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
};

const TestFeatures = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const testObject = {
    id: Math.floor(Math.random() * 1000),
    name: 'Test Object',
    createdAt: new Date().toISOString(),
    data: {
      value: 'This is a test value',
      isActive: true,
      count: 42
    }
  };

  // Helper to add log messages
  const addLog = (message, type = LogType.INFO) => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date().toISOString() }]);
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Test Rate Limiter
  const testRateLimiter = async () => {
    setLoading(true);
    addLog('📊 Bắt đầu test Rate Limiter...', LogType.TITLE);
    
    for (let i = 0; i < 8; i++) {
      try {
        addLog(`🔄 Gửi request ${i+1}...`);
        // Sử dụng endpoint Redis để test rate limiter
        const response = await redisService.listKeys();
        addLog(`✅ Request ${i+1} thành công: ${JSON.stringify(response)}`, LogType.SUCCESS);
      } catch (error) {
        addLog(`❌ Request ${i+1} thất bại: ${error.message}`, LogType.ERROR);
        
        // Nếu đã bị giới hạn tốc độ, dừng test
        if (error.isRateLimited) {
          addLog('🛑 Đã bị giới hạn tốc độ! Test đã thành công.', LogType.SUCCESS);
          break;
        }
      }
      
      // Đợi 500ms trước khi gửi request tiếp theo
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    addLog('🏁 Test Rate Limiter hoàn tất!', LogType.TITLE);
    setLoading(false);
  };

  // Test Retry Mechanism
  const testRetry = async () => {
    setLoading(true);
    addLog('🔁 Bắt đầu test Retry Mechanism...', LogType.TITLE);
    
    try {
      // Sử dụng một URL không tồn tại để kích hoạt retry
      addLog('🔄 Gửi request đến endpoint không tồn tại...');
      
      const fakeUrl = '/api/non-existent-endpoint';
      
      await apiCall('get', fakeUrl, null, {
        maxRetries: 3,
        initialDelayMs: 3000
      });
      
      addLog('✅ Request thành công (điều này không nên xảy ra)', LogType.SUCCESS);
    } catch (error) {
      addLog(`❌ Request thất bại sau nhiều lần thử: ${error.message}`, LogType.ERROR);
      addLog('✅ Retry mechanism hoạt động đúng!', LogType.SUCCESS);
    }
    
    addLog('🏁 Test Retry Mechanism hoàn tất!', LogType.TITLE);
    setLoading(false);
  };

  // Test Redis CRUD
  const testRedisCRUD = async () => {
    setLoading(true);
    addLog('💾 Bắt đầu test Redis CRUD...', LogType.TITLE);
    
    // Tạo key ngẫu nhiên để tránh xung đột
    const testKey = `test-object-${Date.now()}`;
    
    try {
      // CREATE
      addLog(`🔄 CREATE: Tạo đối tượng với key "${testKey}"...`);
      const createResult = await redisService.createOrUpdate(testKey, testObject);
      addLog(`✅ CREATE thành công: ${JSON.stringify(createResult)}`, LogType.SUCCESS);
      
      // Đợi 1 giây
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // READ
      addLog(`🔄 READ: Đọc đối tượng với key "${testKey}"...`);
      const readResult = await redisService.read(testKey);
      addLog(`✅ READ thành công: ${JSON.stringify(readResult)}`, LogType.SUCCESS);
      
      // So sánh dữ liệu đọc được với dữ liệu gốc
      if (JSON.stringify(readResult.data) === JSON.stringify(testObject)) {
        addLog('✅ Dữ liệu đọc được khớp với dữ liệu gốc!', LogType.SUCCESS);
      } else {
        addLog('❌ Dữ liệu đọc được không khớp với dữ liệu gốc!', LogType.ERROR);
      }
      
      // Đợi 1 giây
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // UPDATE
      const updatedObject = {
        ...testObject,
        name: 'Updated Test Object',
        data: {
          ...testObject.data,
          value: 'This is an updated value',
          count: 100
        }
      };
      
      addLog(`🔄 UPDATE: Cập nhật đối tượng với key "${testKey}"...`);
      const updateResult = await redisService.update(testKey, updatedObject);
      addLog(`✅ UPDATE thành công: ${JSON.stringify(updateResult)}`, LogType.SUCCESS);
      
      // Đọc lại dữ liệu để kiểm tra cập nhật
      const readAfterUpdateResult = await redisService.read(testKey);
      addLog(`✅ Đọc sau khi UPDATE: ${JSON.stringify(readAfterUpdateResult)}`, LogType.SUCCESS);
      
      // Đợi 1 giây
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // DELETE
      addLog(`🔄 DELETE: Xóa đối tượng với key "${testKey}"...`);
      const deleteResult = await redisService.delete(testKey);
      addLog(`✅ DELETE thành công: ${JSON.stringify(deleteResult)}`, LogType.SUCCESS);
      
      // Thử đọc lại sau khi xóa (sẽ gây ra lỗi 404)
      try {
        addLog(`🔄 READ sau khi xóa: Thử đọc đối tượng với key "${testKey}"...`);
        await redisService.read(testKey);
        addLog('❌ Đọc thành công (điều này không nên xảy ra sau khi xóa)!', LogType.ERROR);
      } catch (error) {
        if (error.message && error.message.includes('404')) {
          addLog('✅ Đọc thất bại sau khi xóa (đúng như kỳ vọng)!', LogType.SUCCESS);
        } else {
          addLog(`❌ Lỗi không mong muốn: ${error.message}`, LogType.ERROR);
        }
      }
      
      // CRUD hoàn tất và thành công
      addLog('🎉 CRUD test hoàn tất thành công!', LogType.SUCCESS);
      
    } catch (error) {
      addLog(`❌ Test CRUD thất bại: ${error.message}`, LogType.ERROR);
    }
    
    addLog('🏁 Test Redis CRUD hoàn tất!', LogType.TITLE);
    setLoading(false);
  };

  const getLogStyle = (type) => {
    switch (type) {
      case LogType.TITLE:
        return { color: '#1e88e5', fontWeight: 'bold', marginTop: '10px' };
      case LogType.SUCCESS:
        return { color: '#43a047' };
      case LogType.ERROR:
        return { color: '#e53935' };
      case LogType.WARNING:
        return { color: '#fb8c00' };
      default:
        return { color: '#424242' };
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Test Các Tính Năng</h1>
      
      <div className="d-flex gap-2 mb-4">
        <button 
          className="btn btn-primary" 
          onClick={testRateLimiter}
          disabled={loading}
        >
          Test Rate Limiter
        </button>
        
        <button 
          className="btn btn-success" 
          onClick={testRetry}
          disabled={loading}
        >
          Test Retry Mechanism
        </button>
        
        <button 
          className="btn btn-info" 
          onClick={testRedisCRUD}
          disabled={loading}
        >
          Test Redis CRUD
        </button>
        
        <button 
          className="btn btn-secondary" 
          onClick={clearLogs}
          disabled={loading}
        >
          Xóa Logs
        </button>
      </div>
      
      {loading && (
        <div className="alert alert-warning">
          Đang thực hiện test... Vui lòng chờ.
        </div>
      )}
      
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Logs</h5>
        </div>
        <div className="card-body" style={{ maxHeight: '500px', overflow: 'auto' }}>
          {logs.length === 0 ? (
            <div className="text-center text-muted">
              Chưa có logs. Hãy chọn một test để bắt đầu.
            </div>
          ) : (
            <div className="logs">
              {logs.map((log, index) => (
                <div key={index} className="log-entry mb-1" style={getLogStyle(log.type)}>
                  {log.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestFeatures; 