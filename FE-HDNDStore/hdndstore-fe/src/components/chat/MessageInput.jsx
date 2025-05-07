import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

/** Chat message input with send button */
const MessageInput = ({ inputRef, waiting, handleClick, placeholder = "Nhập tin nhắn..." }) => {
  return (
    <div className="input-group">
      <input
        className="form-control rounded-start"
        type="text"
        name="chat"
        placeholder={waiting ? "Đang xử lý..." : placeholder}
        ref={inputRef}
        disabled={waiting}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleClick();
        }}
      />
      <button 
        className="btn btn-primary" 
        onClick={handleClick}
        disabled={waiting}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  );
};

MessageInput.propTypes = {
  inputRef: PropTypes.object.isRequired,
  waiting: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default MessageInput;