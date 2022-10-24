import { divide } from 'lodash';

import '../css/typingIcon.css';

function TypingIcon() {
  return (
    <div class="chat-bubble">
      <div class="typing">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  );
}

export default TypingIcon;
