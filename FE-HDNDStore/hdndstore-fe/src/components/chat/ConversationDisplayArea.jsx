import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import userIcon from '../../assets/user.png';
import chatbotIcon from '../../assets/chaticon.png';
import api from '../../services/api'; // Make sure this import path is correct

const ConversationDisplayArea = ({ data, streamdiv, answer }) => {
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Chưa có token, vui lòng đăng nhập!");
          return;
        }

        const response = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        
        setFullName(response.data.fullName);
        if (response.data.avatar) {
          setAvatarUrl(response.data.avatar);
        }

        console.log("Avatar URL:", response.data.avatar);
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin user:",
          error.response?.data || error
        );
      }
    };

    fetchUserData();
  }, []);

  // Get first name for greeting
  const firstName = fullName ? fullName.split(' ').pop() : 'there';

  return (
    <div className="d-flex flex-column gap-3">
      {data?.length <= 0 ? (
        <div className="text-center my-3">
          <p className="fs-5 fw-semibold mb-1">Hi {firstName},</p>
          <p className="text-secondary">How can I help you today?</p>
        </div>
      ) : (
        <div className="d-none"></div>
      )}

      {data.map((element, index) => (
        <div key={index} className={`d-flex align-items-start gap-2 ${element.role === "user" ? "flex-row-reverse align-self-end" : ""}`}>
          <img 
            src={element.role === "user" ? (avatarUrl || userIcon) : chatbotIcon} 
            alt={element.role === "user" ? "User" : "Bot"}
            className="rounded-circle p-1 flex-shrink-0"
            style={{
              width: "28px", 
              height: "28px", 
              backgroundColor: element.role === "user" ? "#e9f5ff" : "#f0f0f0",
              objectFit: "cover"
            }}
          />
          <div 
            className={`p-3 rounded-4 ${element.role === "user" 
              ? "bg-primary text-white rounded-bottom-end-0" 
              : "bg-white rounded-bottom-start-0 border"}`}
            style={{maxWidth: "85%"}}
          >
            <Markdown>{element.parts[0].text}</Markdown>
          </div>
        </div>
      ))}

      {streamdiv && (
        <div className="d-flex align-items-start gap-2">
          <img 
            src={chatbotIcon} 
            alt="Bot"
            className="rounded-circle p-1 flex-shrink-0"
            style={{width: "28px", height: "28px", backgroundColor: "#f0f0f0"}}
          />
          {answer && (
            <div className="p-3 rounded-4 rounded-bottom-start-0 bg-white border" style={{maxWidth: "85%"}}>
              <Markdown>{answer}</Markdown>
            </div>
          )}
        </div>
      )}

      <span id="checkpoint"></span>
    </div>
  );
};

export default ConversationDisplayArea;