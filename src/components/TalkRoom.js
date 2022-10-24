import '../App.scss';
import React, { useState, useEffect, useRef, useContext } from 'react';
import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';
import 'animate.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';


import LoadingIcon from './LoadingIcon';
import TypingIcon from './TypingIcon';
import { SocketContext } from '../context/socket';




function TalkRoom({ changePage, auth, user, directChatData, setDirectChatData, loadingTalkRoom, setFocus, fetchRoomMessages, messageList, setMessageList, messages }) {
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const ccUsername = auth.payload.displayName;
  

  const [message, setMessage] = useState('');
  const [typingMessage, setTypingMessage] = useState('');
  //const [messageList, setMessageList] = useState([]);

  const [firstMessage, setFirstMessage] = useState(false);
  

  const [roomData, setRoomData] = useState(null);
  const [userList, setUserList] = useState([]);

  const currentTypers = [];
  const [signedIn, setSignedIn] = useState(false);
  const [render, setRender] = useState(0);
  const [scrolledDown, setScrolledDown] = useState(false);
 


  const socket = useContext(SocketContext);

  useEffect(() => {
    
    if (directChatData && directChatData?.directChatId && !loadingTalkRoom) {
      scrollToBottom();
      setTimeout(() => {
        setScrolledDown(true)
      }, 25)
      
    }
  });

  useEffect(() => {
    console.log(messageList)
    console.log(directChatData);
    console.log(socket);
    if (!directChatData) {
      return;
    }
    if (!directChatData.directChatId) {
      return;
    }

    // if (!messagesLoaded) {
    //   setFirstMessage(false);
    //   fetchRoomMessages();
    // }

    const username = auth.payload.displayName;
    const room = directChatData.directChatId;

    if (socket) {
       socket.emit('joinRoom', { username, room });
     

      socket.on('message', (message) => {
        console.log(message);
        if (message.room === directChatData.directChatId) {
          setFirstMessage(true);
          outputMessage(message);
        }
      });
      socket.on('roomUsers', ({ room, users }) => {
        setUserList(users);
        setRoomData(room);
      });

      socket.on('typingOutput', (id) => {
        console.log(id);
        if(id && id !== user._id ) {
          setTypingMessage(id);
        } else {
          setTypingMessage('');
        }
        
      });

      return () => {
        socket.off('message');
        socket.off('roomUsers');
        socket.off('typingOutput');
      };
    }
  }, [socket?.connected, directChatData]);

  

  function saveNewMessage(message) {
    console.log(message);
    axios(`${process.env.REACT_APP_API_URL}/api/comment/new`, {
      method: 'put',
      data: message,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  

  function onSendMessage(evt) {
    setFirstMessage(true);
    evt.preventDefault();
    if (!message) {
      return;
    }
    const data = {friendId: directChatData.friend.id, message, userId: user._id, directChatId: directChatData.directChatId}
    socket.emit('CHAT_MESSAGE', user.displayName, user._id, message, directChatData.directChatId);
    socket.emit('DIRECT_MESSAGE', data)
    setMessage('');
    messageInputRef.current.blur();
    const comment = {
      userId: user._id,
      displayName: user.displayName,
      room: directChatData.directChatId,
      msg: message,
    };
    saveNewMessage(comment);
  }

  function outputMessage(msgObj) {
    console.log(messageList);
    console.log([...messageList, msgObj])
    setMessageList([...messageList, msgObj]);
  }

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
  }

  function scrollToBottom() {
    if (directChatData && directChatData.directChatId) {
      messagesEndRef.current.scrollIntoView();
    }
  }

  function setInputFocused(typing) {
    const userId = user._id;
    socket.emit('typing', userId, typing, directChatData.directChatId);
  }
  function onLeaveRoom() {
    console.log('leaving');
    setDirectChatData(null);
    setFocus('friends');
  }

  return (
    <div className="container main-wrapper">
      <div>
        <div className="row">
          
            <div className="">
              <div className="mb-1 d-flex align-items-center mb-3">
                <button className="btn btn-primary btn-sm me-3" onClick={(evt) => onLeaveRoom()}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className="">{directChatData.friend?.displayName}</div>
              </div>

              <div className="scroll-item  border border-dark mb-3   p-3">
                <div>
                  {_.map(messageList, (messageListItem, index) => (
                    <div>
                      <div className={scrolledDown ? "item mb-2" : "item mb-2 hidden"}>
                        <div className="item-header d-flex justify-content-between">
                          <div>{messageListItem.username}</div>
                        </div>
                        <div
                          className={
                            messageListItem.userId === user._id
                              ? 'd-flex flex-column align-items-end'
                              : 'd-flex flex-column align-items-start'
                          }
                        >
                          {index !== messageList.length - 1 && (
                            <div
                              className={
                                messageListItem.userId === user._id
                                  ? 'outbound-msg text-break'
                                  : 'inbound-msg text-break'
                              }
                            >
                              {messageListItem.msg}
                            </div>
                          )}
                          {!firstMessage && index === messageList.length - 1 && (
                            <div
                              className={
                                messageListItem.userId === user._id
                                  ? 'outbound-msg text-break'
                                  : 'inbound-msg text-break'
                              }
                            >
                              {messageListItem.msg}
                            </div>
                          )}

                          {firstMessage && index === messageList.length - 1 && (
                            <div
                              className={
                                messageListItem.userId === user._id
                                  ? 'outbound-msg text-break animate__animated animate__fadeIn'
                                  : 'inbound-msg text-break animate__animated animate__fadeIn'
                              }
                            >
                              {messageListItem.msg}
                            </div>
                          )}
                          <div className="timestamp">{moment(messageListItem.timestamp).fromNow()}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="messages-end"></div>
                  <div ref={messagesEndRef}></div>
                </div>
              </div>

              <form className="">
                <div className="mb-2">
                  <label htmlFor="message" className="form-label visually-hidden">
                    Your Message
                  </label>
                  <div className="input-group">
                    <input
                      id="message"
                      className="form-control"
                      placeholder=""
                      value={message}
                      ref={messageInputRef}
                      onChange={(evt) => onInputChange(evt, setMessage)}
                      onBlur={(evt) => setInputFocused(false)}
                      onFocus={(evt) => setInputFocused(true)}
                    ></input>
                    <button type="submit" className="btn btn-primary" onClick={(evt) => onSendMessage(evt)}>
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </div>
                </div>
                <div className="mb-2 d-flex">
                 {typingMessage && <TypingIcon />} 
                </div>
              </form>
            </div>
          
        </div>
      </div>
    </div>
  );
}

export default TalkRoom;
