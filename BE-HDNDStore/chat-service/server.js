const cors = require("cors");
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log("Chatbot Server Running on PORT:", PORT);
});

// Initialize Gemini API with error handling
let genAI, model;
try {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log("Gemini API initialized successfully");
} catch (error) {
  console.error("Failed to initialize Gemini API:", error.message);
}

// Configuration
const CONFIG = {
  PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL || "http://localhost:5002",
  REQUEST_TIMEOUT: 5000, // 5 seconds timeout for external requests
  MAX_FEATURED_PRODUCTS: 3,
  MAX_RELATED_PRODUCTS: 3
};

/**
 * Fetch all products from product service with caching
 * @returns {Promise<Array>} - Array of products
 */
const productCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes cache TTL
};

async function fetchAllProducts() {
  // Return from cache if available and not expired
  const now = Date.now();
  if (productCache.data && productCache.timestamp && (now - productCache.timestamp < productCache.ttl)) {
    console.log("Using cached product data");
    return productCache.data;
  }

  try {
    console.log("Fetching products from product service...");
    const res = await axios.get(`${CONFIG.PRODUCT_SERVICE_URL}/products/all`, { 
      timeout: CONFIG.REQUEST_TIMEOUT 
    });
    
    if (res.data && Array.isArray(res.data)) {
      console.log(`Retrieved ${res.data.length} products from service`);
      // Update cache
      productCache.data = res.data;
      productCache.timestamp = now;
      return res.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching products:", error.message);
    // If we have cached data even though it's expired, return it as fallback
    if (productCache.data) {
      console.log("Using expired cache as fallback");
      return productCache.data;
    }
    return [];
  }
}

/**
 * Get featured product suggestions
 * @param {number} count - Number of products to return
 * @returns {Promise<Object>} - Object with text and products
 */
async function getProductSuggestions(count = CONFIG.MAX_FEATURED_PRODUCTS) {
  try {
    const products = await fetchAllProducts();
    
    if (!products || products.length === 0) {
      return {
        text: "Hiện chưa có sản phẩm nào trong kho. Bạn có thể hỏi tôi các thông tin khác về dịch vụ của chúng tôi!",
        products: []
      };
    }
    
    // Get featured products - could be improved with actual featured flag or bestseller status
    const featuredProducts = products.slice(0, count);
    
    return {
      text: "Dưới đây là một số sản phẩm nổi bật của HDND Store:",
      products: featuredProducts
    };
  } catch (error) {
    console.error("Error getting product suggestions:", error.message);
    return {
      text: "Hiện tại không thể lấy được thông tin sản phẩm. Bạn có thể hỏi tôi các thông tin khác hoặc quay lại sau!",
      products: []
    };
  }
}

/**
 * Find products related to user query using keyword matching and fuzzy search
 * @param {string} query - User query
 * @returns {Promise<Object>} - Object with text and products
 */
async function getRelatedProducts(query) {
  if (!query || typeof query !== 'string') {
    return { text: "Không tìm thấy sản phẩm liên quan.", products: [] };
  }

  try {
    const products = await fetchAllProducts();
    
    if (!products || products.length === 0) {
      return {
        text: "Hiện chưa có sản phẩm nào trong kho.",
        products: []
      };
    }
    
    // Normalize query for better matching
    const normalizedQuery = query.toLowerCase().trim();
    const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 2);
    
    // Gender detection
    const isLookingForMenProducts = normalizedQuery.includes('nam');
    const isLookingForWomenProducts = normalizedQuery.includes('nữ');
    
    // Score products based on keyword matching
    const scoredProducts = products.map(product => {
      let score = 0;
      const productText = `${product.name || ""} ${product.description || ""} ${product.category || ""} ${product.subcategories || ""}`.toLowerCase();
      const isMenProduct = productText.includes('nam');
      const isWomenProduct = productText.includes('nữ');
      
      // Penalize wrong gender matches
      if (isLookingForMenProducts && isWomenProduct && !isMenProduct) {
        return { product, score: 0 };
      }
      
      if (isLookingForWomenProducts && isMenProduct && !isWomenProduct) {
        return { product, score: 0 };
      }
      
      // Give points for exact matches
      if (productText.includes(normalizedQuery)) {
        score += 10;
      }
      
      // Give points for term matches
      queryTerms.forEach(term => {
        if (productText.includes(term)) {
          score += 3;
        }
      });
      
      // Give extra points for matching the gender
      if (isLookingForMenProducts && isMenProduct) score += 8;
      if (isLookingForWomenProducts && isWomenProduct) score += 8;
      
      // Give extra points for matches in critical fields
      if (product.name?.toLowerCase().includes(normalizedQuery)) score += 5;
      if (product.category?.toLowerCase().includes(normalizedQuery)) score += 3;
      if (product.subcategories?.toLowerCase().includes(normalizedQuery)) score += 3;
      
      return { product, score };
    });
    
    // Sort by score and get top matches
    const relatedProducts = scoredProducts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.product)
      .slice(0, CONFIG.MAX_RELATED_PRODUCTS);
    
    // If no matches, return featured products
    if (relatedProducts.length === 0) {
      const featuredProducts = products.slice(0, CONFIG.MAX_RELATED_PRODUCTS);
      return {
        text: "Tôi không tìm thấy sản phẩm nào khớp với yêu cầu của bạn, nhưng đây là một số sản phẩm bạn có thể quan tâm:",
        products: featuredProducts
      };
    }
    
    return {
      text: "Đây là các sản phẩm phù hợp với yêu cầu của bạn:",
      products: relatedProducts
    };
  } catch (error) {
    console.error("Error finding related products:", error.message);
    return {
      text: "Hiện tại không thể tìm sản phẩm. Bạn có thể hỏi tôi các thông tin khác.",
      products: []
    };
  }
}

/**
 * Intent detection system
 */
const intents = {
  GREETING: 'greeting',
  PRODUCT_INQUIRY: 'product_inquiry',
  PRICE_INQUIRY: 'price_inquiry',
  STORE_INFO: 'store_info',
  SHIPPING: 'shipping',
  SIZE_GUIDE: 'size_guide',
  UNKNOWN: 'unknown'
};

/**
 * Detects user intent from message
 * @param {string} message - User message
 * @returns {string} - Detected intent
 */
function detectUserIntent(message) {
  if (!message) return intents.UNKNOWN;
  
  const normalizedMsg = message.toLowerCase().trim();
  
  // Simple greeting detection
  const greetingPatterns = [
    /^(hi|hello|hey|chào|xin chào|chao|alo)(\s|$)/i,
    /^(chào bạn|xin chào bạn|chào shop|xin chào shop)(\s|$)/i
  ];
  
  if (greetingPatterns.some(pattern => pattern.test(normalizedMsg))) {
    return intents.GREETING;
  }
  
  // Product inquiry detection
  const productKeywords = [
    'mua', 'giày', 'dép', 'sandal', 'sản phẩm', 'hàng', 
    'sneaker', 'order', 'đặt', 'size', 'màu', 'sale', 'khuyến mãi',
    'thể thao', 'nam', 'nữ', 'trẻ em', 'có', 'còn'
  ];
  
  if (productKeywords.some(keyword => normalizedMsg.includes(keyword))) {
    return intents.PRODUCT_INQUIRY;
  }
  
  // Price inquiry detection
  const priceKeywords = ['giá', 'bao nhiêu', 'giá cả', 'tiền', 'đắt', 'rẻ', 'trả giá', 'giảm'];
  if (priceKeywords.some(keyword => normalizedMsg.includes(keyword))) {
    return intents.PRICE_INQUIRY;
  }
  
  // Store information detection
  const storeKeywords = ['cửa hàng', 'địa chỉ', 'shop', 'store', 'ở đâu', 'chỗ nào', 'mở cửa', 'giờ mở cửa'];
  if (storeKeywords.some(keyword => normalizedMsg.includes(keyword))) {
    return intents.STORE_INFO;
  }
  
  // Shipping detection
  const shippingKeywords = ['giao hàng', 'ship', 'vận chuyển', 'gửi hàng', 'nhận hàng', 'cod'];
  if (shippingKeywords.some(keyword => normalizedMsg.includes(keyword))) {
    return intents.SHIPPING;
  }
  
  // Size guide detection
  const sizeKeywords = ['size', 'kích cỡ', 'số', 'chọn size', 'đo', 'vừa', 'rộng', 'chật'];
  if (sizeKeywords.some(keyword => normalizedMsg.includes(keyword))) {
    return intents.SIZE_GUIDE;
  }
  
  return intents.UNKNOWN;
}

/**
 * Generate greeting response based on intent
 * @returns {string} - Greeting response
 */
function createGreetingResponse() {
  const greetings = [
    "HDND Store xin chào! Bạn đang tìm giày dép gì ạ?",
    "Chào bạn! HDND Store hân hạnh được phục vụ. Bạn cần tư vấn gì ạ?",
    "Xin chào! HDND Store có thể giúp gì cho bạn hôm nay?",
    "Chào mừng đến với HDND Store! Bạn đang tìm loại giày nào ạ?"
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Create an optimized prompt for Gemini based on user intent and context
 * @param {Object} productInfo - Product information
 * @param {string} query - User query
 * @param {string} intent - Detected intent
 * @returns {string} - Optimized prompt
 */
function createContextualPrompt(productInfo, query, intent) {
  try {
    // Sanitize inputs
    const safeQuery = (query && typeof query === 'string' && query.trim()) 
      ? query.trim() 
      : "hỗ trợ mua giày";
    
    const safeIntent = intent || intents.UNKNOWN;
    
    // For simple greetings, return a short prompt
    if (safeIntent === intents.GREETING) {
      const greetingPrompt = `Bạn là trợ lý mua sắm từ HDND Store. Người dùng chào bạn: "${safeQuery}".
      Hãy chào lại ngắn gọn, thân thiện như bạn bè và gợi ý họ xem những mẫu giày mới.
      Giọng điệu trẻ trung, không quá formal. Trả lời trong 1 câu ngắn.`;
      
      console.log("Generated greeting prompt");
      return greetingPrompt;
    }
    
    // Default product data in case something is missing
    const defaultProduct = {
      name: "Giày thể thao HDND Classic",
      price: "350000",
      description: "Giày thể thao nam nữ chất lượng cao, phù hợp đi hàng ngày",
      category: "Giày thể thao"
    };
    
    // Format product data for the prompt with robust fallbacks
    let productsText = "";
    if (productInfo && Array.isArray(productInfo.products) && productInfo.products.length > 0) {
      // Map products with fallbacks for each field
      productsText = productInfo.products.map(p => {
        const product = p || {}; // Handle null product
        return `- Tên: ${product.name || defaultProduct.name}
  Giá: ${(product.price?.toLocaleString?.() || product.price || defaultProduct.price) + 'đ'}
  Mô tả: ${(product.description?.substring?.(0, 80) || product.description || defaultProduct.description) + '...'}
  Danh mục: ${product.category || defaultProduct.category}`;
      }).join("\n\n");
    } else {
      // Use default product if no products available
      productsText = `- Tên: ${defaultProduct.name}
  Giá: ${defaultProduct.price}đ
  Mô tả: ${defaultProduct.description}...
  Danh mục: ${defaultProduct.category}`;
    }

    // Build base context with validated inputs
    const systemInstruction = `Bạn là trợ lý mua sắm giày dép HDND, nói chuyện như người thật.

SẢN PHẨM LIÊN QUAN:
${productsText}

CÂU HỎI: "${safeQuery}"`;

    // Content guidance based on intent
    let contextualGuidance = '';
    
    switch (safeIntent) {
      case intents.PRODUCT_INQUIRY:
        contextualGuidance = `
TRẢ LỜI VỀ SẢN PHẨM:
- Nói về ưu điểm sản phẩm phù hợp
- Nhắc đến giá cụ thể
- Dùng ngôn ngữ hào hứng, khơi gợi hình ảnh`;
        break;
        
      case intents.PRICE_INQUIRY:
        contextualGuidance = `
TRẢ LỜI VỀ GIÁ:
- Đưa thông tin giá chính xác
- Nhấn mạnh giá trị sản phẩm so với giá
- Không tự ý giảm giá`;
        break;
        
      case intents.STORE_INFO:
        contextualGuidance = `
THÔNG TIN CỬA HÀNG:
- Địa chỉ: 123 Nguyễn Trãi, Q.1, TP.HCM
- Giờ mở cửa: 8h30-21h30 hàng ngày
- Website: hdndstore.com`;
        break;
        
      case intents.SHIPPING:
        contextualGuidance = `
THÔNG TIN GIAO HÀNG:
- Phí ship: 30.000đ (< 500K), miễn phí (≥ 500K)
- Thời gian: 2-3 ngày TP.HCM, 3-5 ngày tỉnh
- Có COD, đổi trả trong 7 ngày`;
        break;
        
      default:
        contextualGuidance = `
HƯỚNG DẪN CHUNG:
- Hiểu nhu cầu khách hàng
- Đề xuất sản phẩm phù hợp
- Nhắc số hotline 1900 1234 nếu cần`;
        break;
    }

    // Common style guidance
    const toneGuidance = `
PHONG CÁCH TRẢ LỜI:
- Ngắn gọn (1-2 câu)
- Nói như người bạn tư vấn mua sắm
- Không dùng từ ngữ "dạ", "ạ", "quý khách", "chúng tôi"
- Không nhắc lại câu hỏi, đi thẳng vào trả lời
- LUÔN TRẢ LỜI NGẮN GỌN DƯỚI 50 TỪ`;

    const finalPrompt = systemInstruction + contextualGuidance + toneGuidance;
    
    // Ensure we're returning a non-empty string
    if (!finalPrompt || typeof finalPrompt !== 'string' || finalPrompt.trim() === '') {
      console.error("Warning: Generated an empty prompt, using fallback");
      return "Hãy trả lời câu hỏi về giày dép một cách ngắn gọn, thân thiện.";
    }
    
    return finalPrompt;
  } catch (error) {
    console.error("Error generating prompt:", error);
    return "Trả lời ngắn gọn: Bạn cần tư vấn loại giày nào?";
  }
}

/**
 * Detect if user is asking about bot identity
 * @param {string} message - User message
 * @returns {boolean} - True if asking about identity
 */
function isAskingAboutIdentity(message) {
  if (!message) return false;
  
  const identityPatterns = [
    /bạn tên (gì|là|gi|la)/i,
    /tên (gì|là|gi|la)/i,
    /bạn là (ai|gì)/i,
    /là (ai|gì)/i,
    /tên của bạn/i,
    /bạn là bot/i,
    /\bai\b.*\bđang\b.*\bnói\b/i,
    /\bai\b.*\btrả lời\b/i
  ];
  
  return identityPatterns.some(pattern => pattern.test(message));
}

/**
 * Generate bot identity response
 * @returns {string} - Identity response
 */
function createIdentityResponse() {
  return "HDND Store xin chào! Tôi là trợ lý ảo của HDND Store, luôn sẵn sàng tư vấn giày dép phù hợp cho bạn. Bạn cần tìm mẫu giày nào ạ?"
}

/**
 * Process and respond to user chat request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.post("/chat", async (req, res) => {
  const chatHistory = req.body.history || [];
  const msg = req.body.chat?.trim();
  const isStream = req.body.stream === true;
  
  // Initial greeting when opening chat
  if (!msg) {
    try {
      const suggestions = await getProductSuggestions(2);
      const greeting = "HDND Store xin chào! Bạn cần tư vấn mẫu giày nào ạ?";
      
      return res.json({
        text: greeting,
        products: suggestions.products
      });
    } catch (error) {
      console.error("Error handling initial greeting:", error);
      return res.status(500).json({
        text: "Xin lỗi, hệ thống đang gặp trục trặc. Vui lòng thử lại sau!",
        products: []
      });
    }
  }

  try {
    // Detect user intent
    const intent = detectUserIntent(msg);
    console.log(`Detected intent for "${msg}": ${intent}`);
    
    // Check if asking about bot identity
    if (isAskingAboutIdentity(msg)) {
      console.log("User is asking about bot identity");
      const identityResponse = createIdentityResponse();
      const suggestions = await getProductSuggestions(2);
      
      return res.json({
        text: identityResponse,
        products: suggestions.products
      });
    }
    
    // Handle greetings with simple response
    if (intent === intents.GREETING) {
      const greetingResponse = createGreetingResponse();
      const suggestions = await getProductSuggestions(2);
      
      return res.json({
        text: greetingResponse,
        products: suggestions.products
      });
    }
    
    // Get products related to user query
    const productInfo = await getRelatedProducts(msg);
    
    // Create optimized prompt for LLM
    const prompt = createContextualPrompt(productInfo, msg, intent);
    
    // Debug output to help diagnose issues
    console.log(`Generated prompt length: ${prompt ? prompt.length : 0} characters`);
    console.log(`First 50 chars: ${prompt ? prompt.substring(0, 50) : 'NULL PROMPT'}`);

    // Final safety check - use a default prompt if something went wrong
    const safePrompt = prompt && prompt.trim() ? prompt : "Hãy trả lời: Bạn muốn tìm giày nào? HDND Store có nhiều mẫu giày đẹp đấy.";

    // Send prompt to Gemini
    const chat = model.startChat({ history: chatHistory });
    
    if (isStream) {
      try {
        // Validate prompt is not empty (extra check)
        if (!safePrompt || safePrompt.trim() === '') {
          throw new Error('Empty prompt generated after safety checks');
        }

        // Set appropriate headers for SSE
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        
        // First send the products as a complete data event
        res.write(`data: ${JSON.stringify({
          event: 'products',
          products: productInfo.products
        })}\n\n`);
        
        // Then stream the text chunks
        console.log("Sending streaming request to Gemini API...");
        
        try {
          const result = await chat.sendMessageStream(safePrompt);
          
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              res.write(`data: ${JSON.stringify({
                event: 'text',
                text: chunkText
              })}\n\n`);
            }
          }
        } catch (geminiError) {
          console.error("Gemini API error:", geminiError.message);
          
          // Check if it's the empty parameter error
          if (geminiError.message.includes('empty text parameter')) {
            // Try with a very simple fallback prompt
            const fallbackPrompt = "Trả lời: Bạn muốn mua giày loại nào?";
            console.log("Trying with fallback prompt:", fallbackPrompt);
            
            try {
              // Create a new chat to avoid any state issues
              const fallbackChat = model.startChat();
              const fallbackResult = await fallbackChat.sendMessageStream(fallbackPrompt);
              
              for await (const chunk of fallbackResult.stream) {
                const chunkText = chunk.text();
                if (chunkText) {
                  res.write(`data: ${JSON.stringify({
                    event: 'text',
                    text: chunkText
                  })}\n\n`);
                }
              }
            } catch (fallbackError) {
              console.error("Fallback prompt also failed:", fallbackError.message);
              res.write(`data: ${JSON.stringify({
                event: 'text',
                text: "HDND có nhiều mẫu giày đẹp. Bạn cần tìm loại nào ạ?"
              })}\n\n`);
            }
          } else {
            // For other Gemini errors, send a generic response
            res.write(`data: ${JSON.stringify({
              event: 'text',
              text: "Xin lỗi, hệ thống trả lời đang gặp vấn đề. Bạn cần tìm giày gì nào?"
            })}\n\n`);
          }
        }
        
        // Signal end of stream
        res.write(`data: ${JSON.stringify({ event: 'done' })}\n\n`);
        res.end();
      } catch (error) {
        console.error("Error in streaming response:", error.message);
        
        // Only try to send headers if they haven't been sent yet
        if (!res.headersSent) {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          });
        }
        
        // Send error event
        res.write(`data: ${JSON.stringify({
          event: 'error',
          text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline 1900 1234 để được hỗ trợ!"
        })}\n\n`);
        res.end();
      }
    } else {
      // Non-streaming mode
      try {
        if (!safePrompt || safePrompt.trim() === '') {
          throw new Error('Empty prompt generated after safety checks');
        }
        
        try {
          const result = await chat.sendMessage(safePrompt);
          const response = await result.response;
          const text = response.text();
          
          res.json({
            text: text,
            products: productInfo.products
          });
        } catch (geminiError) {
          console.error("Gemini API error:", geminiError.message);
          
          // Check if it's the empty parameter error
          if (geminiError.message.includes('empty text parameter')) {
            // Try with a very simple fallback prompt
            const fallbackPrompt = "Trả lời: Bạn muốn mua giày loại nào?";
            console.log("Trying with fallback prompt:", fallbackPrompt);
            
            try {
              // Create a new chat to avoid any state issues
              const fallbackChat = model.startChat();
              const fallbackResult = await fallbackChat.sendMessage(fallbackPrompt);
              const fallbackResponse = await fallbackResult.response;
              const fallbackText = fallbackResponse.text();
              
              res.json({
                text: fallbackText,
                products: productInfo.products
              });
            } catch (fallbackError) {
              console.error("Fallback prompt also failed:", fallbackError.message);
              res.json({
                text: "HDND có nhiều mẫu giày đẹp. Bạn cần tìm loại nào ạ?",
                products: productInfo.products
              });
            }
          } else {
            // For other Gemini errors, send a generic response
            res.json({
              text: "Xin lỗi, hệ thống trả lời đang gặp vấn đề. Bạn cần tìm giày gì nào?",
              products: productInfo.products
            });
          }
        }
      } catch (error) {
        console.error("Error in non-streaming response:", error.message);
        res.status(500).json({
          error: "Đã xảy ra lỗi xử lý yêu cầu",
          text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline 1900 1234 để được hỗ trợ!",
          products: []
        });
      }
    }
  } catch (error) {
    console.error("Error processing chat request:", error.message);
    
    if (isStream) {
      // Only try to send headers if they haven't been sent yet
      if (!res.headersSent) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
      }
      
      res.write(`data: ${JSON.stringify({
        event: 'error',
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline 1900 1234 để được hỗ trợ!"
      })}\n\n`);
      res.end();
    } else {
      res.status(500).json({
        error: "Đã xảy ra lỗi xử lý yêu cầu",
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline 1900 1234 để được hỗ trợ!",
        products: []
      });
    }
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Chatbot service is running",
    timestamp: new Date().toISOString()
  });
});

// Export app for testing
module.exports = app;