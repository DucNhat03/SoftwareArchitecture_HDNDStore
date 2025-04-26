import { useState, useEffect, useRef } from "react";
import { FaComment } from "react-icons/fa"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/ZaloButton.css"; // Still keep minimal custom styling
import axios from "axios";
import { flushSync } from "react-dom";
import ConversationDisplayArea from "../chat/ConversationDisplayArea";
import MessageInput from "../chat/MessageInput";

const ZaloButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef();
  const host = "http://localhost:5005";
  const url = host + "/chat";
  const streamUrl = host + "/stream";
  const [data, setData] = useState([]);
  const [answer, setAnswer] = useState("");
  const [streamdiv, showStreamdiv] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const is_stream = toggled;

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(true); 
    };

    setIsVisible(true);
    
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

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
      if (!is_stream) {
        handleNonStreamingChat();
      } else {
        handleStreamingChat();
      }
    }
  };

  /** Handle non-streaming chat. */
  const handleNonStreamingChat = async () => {
    const chatData = {
      chat: inputRef.current.value,
      history: data,
    };

    /** Add current user message to history. */
    const ndata = [
      ...data,
      { role: "user", parts: [{ text: inputRef.current.value }] },
    ];

    flushSync(() => {
      setData(ndata);
      inputRef.current.value = "";
      inputRef.current.placeholder = "Waiting for model's response";
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

    /** Function to perform POST request. */
    const fetchData = async () => {
      var modelResponse = "";
      try {
        const response = await axios.post(url, chatData, headerConfig);
        modelResponse = response.data.text;
      } catch (error) {
        modelResponse = "Error occurred";
      } finally {
        const updatedData = [
          ...ndata,
          { role: "model", parts: [{ text: modelResponse }] },
        ];
        flushSync(() => {
          setData(updatedData);
          inputRef.current.placeholder = "Enter a message.";
          setWaiting(false);
        });
        executeScroll();
      }
    };

    fetchData();
  };

  /** Handle streaming chat. */
  const handleStreamingChat = async () => {
    // Same as before
    const chatData = {
      chat: inputRef.current.value,
      history: data,
    };

    const ndata = [
      ...data,
      { role: "user", parts: [{ text: inputRef.current.value }] },
    ];

    flushSync(() => {
      setData(ndata);
      inputRef.current.value = "";
      inputRef.current.placeholder = "Waiting for model's response";
      setWaiting(true);
    });

    executeScroll();
    setAnswer("");
    showStreamdiv(true);

    const headerConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    };

    try {
      const response = await fetch(streamUrl, {
        method: "POST",
        headers: headerConfig.headers,
        body: JSON.stringify(chatData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let streamedAnswer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamedAnswer += chunk;
        setAnswer(streamedAnswer);
      }

      const updatedData = [
        ...ndata,
        { role: "model", parts: [{ text: streamedAnswer }] },
      ];

      flushSync(() => {
        setData(updatedData);
        showStreamdiv(false);
        inputRef.current.placeholder = "Enter a message.";
        setWaiting(false);
      });
    } catch (error) {
      console.error("Error during streaming:", error);
      const errorMessage = "Error occurred during streaming";
      const updatedData = [
        ...ndata,
        { role: "model", parts: [{ text: errorMessage }] },
      ];
      
      flushSync(() => {
        setData(updatedData);
        showStreamdiv(false);
        inputRef.current.placeholder = "Enter a message.";
        setWaiting(false);
      });
    }

    executeScroll();
  };

  return (
    <div className={`zalo-chatbox-container ${isVisible ? "visible" : ""}`}>
      {isChatOpen ? (
        <div className="card shadow chat-window">
          <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="avatar-container me-2">
                <div className="avatar bg-white bg-opacity-25 text-white d-flex align-items-center justify-content-center">DN</div>
              </div>
              <div>
                <div className="fw-bold">{'< ducnhatdev />'}</div>
                <div className="small opacity-75">Online</div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="form-check form-switch me-2">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  role="switch" 
                  id="streamToggle" 
                  checked={toggled}
                  onChange={() => setToggled(!toggled)}
                />
                <label className="form-check-label visually-hidden" htmlFor="streamToggle">
                  {toggled ? "Streaming on" : "Streaming off"}
                </label>
              </div>
              <button 
                className="btn-close btn-close-white" 
                onClick={toggleChat} 
                aria-label="Close chat"
              ></button>
            </div>
          </div>
          
          <div className="card-body p-3 overflow-auto bg-light" style={{maxHeight: '350px'}}>
            <ConversationDisplayArea
              data={data}
              streamdiv={streamdiv}
              answer={answer}
            />
          </div>
          
          <div className="card-footer p-2 bg-white border-top">
            <MessageInput
              inputRef={inputRef}
              waiting={waiting}
              handleClick={handleClick}
            />
          </div>
        </div>
      ) : (
        <button 
          className="btn btn-primary rounded-circle position-fixed chat-toggle-btn shadow"
          onClick={toggleChat}
          title="Chat now"
        >
          <FaComment />
        </button>
      )}
    </div>
  );
};

export default ZaloButton;