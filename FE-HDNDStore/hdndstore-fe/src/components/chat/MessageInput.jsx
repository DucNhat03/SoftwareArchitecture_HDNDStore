import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

/** Submission using the Enter key or button. */
const MessageInput = ({ inputRef, waiting, handleClick }) => {
  return (
    <div className="message-input">
      <input
        className="chat_msg_input"
        type="text"
        name="chat"
        placeholder={waiting ? "Waiting for response..." : "Type a message..."}
        ref={inputRef}
        disabled={waiting}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleClick();
        }}
      />
      <button 
        className="chat_msg_btn" 
        onClick={handleClick}
        disabled={waiting}
      >
        <span className="fa-span-send">
          <FontAwesomeIcon icon={faPaperPlane} />
        </span>
      </button>
    </div>
  );
};

export default MessageInput;