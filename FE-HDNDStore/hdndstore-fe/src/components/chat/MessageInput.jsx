import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

/** Submission using the Enter key or button. */
const MessageInput = ({ inputRef, waiting, handleClick }) => {
  return (
    <div className="input-group">
      <input
        className="form-control rounded-pill me-2"
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
        className="btn btn-primary rounded-circle" 
        onClick={handleClick}
        disabled={waiting}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  );
};

export default MessageInput;