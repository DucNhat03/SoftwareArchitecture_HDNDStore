import { useState, useEffect, useRef } from "react";
import { FaComment } from "react-icons/fa"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/ZaloButton.css";
import axios from "axios";
import { flushSync } from "react-dom";
import ConversationDisplayArea from "../chat/ConversationDisplayArea";
import MessageInput from "../chat/MessageInput";
import ProductCard from "../chat/ProductCard";
import logo from "../../assets/img-shop/logo.png";

const ZaloButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef();
  const host = "http://localhost:5005";
  const chatUrl = host + "/chat";
  const [data, setData] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [greeting, setGreeting] = useState(null);
  const [currentProducts, setCurrentProducts] = useState([]);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(true); 
    };

    setIsVisible(true);
    
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Initial greeting when opening chat
  useEffect(() => {
    if (isChatOpen && data.length === 0) {
      axios.post(chatUrl, { history: [], chat: "", stream: false })
        .then(res => {
          setGreeting(res.data.text);
          setCurrentProducts(res.data.products || []);
        })
        .catch(() => {
          setGreeting("HDND Store xin chào! Hiện tại không lấy được dữ liệu sản phẩm. Bạn có thể hỏi tôi thông tin khác.");
        });
    }
  }, [isChatOpen]);

  /** Function to toggle chat visibility */
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  function executeScroll() {
    const element = document.getElementById("checkpoint");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  function validationCheck(str) {
    return str === null || str.match(/^\s*$/) !== null;
  }

  /** Handle form submission. */
  const handleClick = () => {
    if (validationCheck(inputRef.current.value)) {
      console.log("Empty or invalid entry");
    } else {
      handleChatRequest();
    }
  };

  /** Handle chat request */
  const handleChatRequest = async () => {
    const userMessage = inputRef.current.value;
    const chatData = {
      chat: userMessage,
      history: data,
      stream: false
    };

    /** Add current user message to history. */
    const ndata = [
      ...data,
      { role: "user", parts: [{ text: userMessage }] },
    ];

    flushSync(() => {
      setData(ndata);
      setCurrentProducts([]);
      inputRef.current.value = "";
      inputRef.current.placeholder = "Đang xử lý...";
      setWaiting(true);
    });

    executeScroll();

    /** Headers for the POST request. */
    let headerConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    };

    try {
      const response = await axios.post(chatUrl, chatData, headerConfig);
      const modelResponse = response.data.text;
      setCurrentProducts(response.data.products || []);
      
      const updatedData = [
        ...ndata,
        { role: "model", parts: [{ text: modelResponse }] },
      ];
      
      flushSync(() => {
        setData(updatedData);
        inputRef.current.placeholder = "Nhập tin nhắn...";
        setWaiting(false);
      });
      
    } catch (apiError) {
      console.error("Error fetching response:", apiError);
      const errorMessage = "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";
      
      const updatedData = [
        ...ndata,
        { role: "model", parts: [{ text: errorMessage }] },
      ];
      
      flushSync(() => {
        setData(updatedData);
        inputRef.current.placeholder = "Nhập tin nhắn...";
        setWaiting(false);
      });
    }

    executeScroll();
  };

  return (
    <div className={`zalo-chatbox-container ${isVisible ? "visible" : ""}`}>
      {isChatOpen ? (
        <div className="card shadow chat-window">
          <div className="card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="avatar-container me-2">
                <img 
                  src={logo} 
                  alt="HDND Store" 
                  className="rounded-circle"
                  style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div className="fw-bold">HDND Store</div>
                <div className="small opacity-75">Hỗ trợ trực tuyến</div>
              </div>
            </div>
            <button 
              className="btn-close btn-close-white" 
              onClick={toggleChat} 
              aria-label="Đóng chat"
            ></button>
          </div>
          
          <div className="card-body p-3 overflow-auto bg-light" style={{maxHeight: '400px'}}>
            <ConversationDisplayArea
              data={data}
              greeting={greeting}
            />
            
            {currentProducts && currentProducts.length > 0 && (
              <div className="products-container mt-3">
                <div className="row g-2">
                  {currentProducts.map((product, index) => (
                    <div key={index} className="col-6">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="card-footer p-2 bg-white border-top">
            <MessageInput
              inputRef={inputRef}
              waiting={waiting}
              handleClick={handleClick}
              placeholder="Nhập tin nhắn..."
            />
          </div>
        </div>
      ) : (
        <button 
          className="btn btn-primary rounded-circle position-fixed chat-toggle-btn shadow"
          onClick={toggleChat}
          title="Hỗ trợ mua hàng"
        >
          <FaComment />
        </button>
      )}
    </div>
  );
};

export default ZaloButton;