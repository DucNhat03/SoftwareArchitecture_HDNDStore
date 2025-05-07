import { Card, Button } from 'react-bootstrap';
import { formatCurrency } from '../../utils/formatters';
import defaultImage from '../../assets/img-shop/big-sale.png';
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
  // Format giá hiển thị
  const price = product?.price ? formatCurrency(product.price) : 'Liên hệ';
  
  // Xử lý ảnh sản phẩm hoặc dùng ảnh mặc định
  const productImage = product?.image?.[0] || product?.image || defaultImage;
  
  // Handle view product details by storing product in localStorage
  const handleViewProduct = () => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.open(`/chi-tiet-san-pham`, '_blank');
  };
  
  return (
    <Card className="h-100 product-card shadow-sm" style={{ borderRadius: '8px' }}>
      <div className="product-image-container position-relative" style={{ paddingTop: '80%', overflow: 'hidden' }}>
        <Card.Img 
          variant="top" 
          src={productImage}
          alt={product?.name || 'Sản phẩm'} 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
        {product?.price && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-primary fw-semibold">{price}</span>
          </div>
        )}
      </div>
      <Card.Body className="p-2">
        <Card.Title 
          className="fs-6 fw-semibold mb-1 text-truncate" 
          title={product?.name}
        >
          {product?.name || 'Sản phẩm không tên'}
        </Card.Title>
        <div className="d-flex justify-content-between align-items-center mb-2">
          {product?.category && (
            <small className="text-muted">
              {product.category}
            </small>
          )}
          {product?.status && (
            <small className={`text-${product.status === "Còn hàng" ? "success" : "danger"}`}>
              {product.status}
            </small>
          )}
        </div>
        <Button 
          variant="outline-primary" 
          size="sm" 
          className="w-100" 
          onClick={handleViewProduct}
        >
          Xem chi tiết
        </Button>
      </Card.Body>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    category: PropTypes.string,
    status: PropTypes.string
  }).isRequired
};

export default ProductCard; 