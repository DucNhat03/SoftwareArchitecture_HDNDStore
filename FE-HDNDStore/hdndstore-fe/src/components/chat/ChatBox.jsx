import React, { useState, useRef } from "react";
import axios from "axios";
import { flushSync } from "react-dom";
import "../App.css";
import ConversationDisplayArea from "./ConversationDisplayArea";
import Header from "./Header";
import MessageInput from "./MessageInput";

const ChatBox = () => {
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

    /** Display the answer section. */
    setAnswer("");
    showStreamdiv(true);

    /** Headers for the streaming request. */
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
    <div className="chatbox-container">
      {isChatOpen ? (
        <div className="chat-window">
          <div className="compact-chat-header">
            <div className="header-title">
              <div className="avatar-container">
                <div className="avatar">DN</div>
              </div>
              <div className="header-info">
                <div className="header-name">{'< ducnhatdev />'}</div>
                <div className="header-status">Online</div>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className={`stream-toggle ${toggled ? "active" : ""}`} 
                onClick={() => setToggled(!toggled)} 
                title={toggled ? "Streaming on" : "Streaming off"}
              >
                <span className="toggle-dot"></span>
              </button>
              <button className="close-button" onClick={toggleChat}>
                <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="chat-body">
            <ConversationDisplayArea
              data={data}
              streamdiv={streamdiv}
              answer={answer}
            />
          </div>
          
          <div className="chat-footer">
            <MessageInput
              inputRef={inputRef}
              waiting={waiting}
              handleClick={handleClick}
            />
          </div>
        </div>
      ) : (
        <button className="chat-button" onClick={toggleChat}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2C16.75 2 21 6.25 21 11.5Z" fill="currentColor"/>
            <path d="M22 22L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 11.5H11.5V8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.5 15H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatBox;