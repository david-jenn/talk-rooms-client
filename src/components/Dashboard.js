import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/socket';
import axios from 'axios';
import _ from 'lodash';

import Friends from './Friends';
import TalkRoom from './TalkRoom';
import LoadingIcon from './LoadingIcon';

function Dashboard({ auth, changePage, changeSubPage, user, showSuccess }) {
  const socket = useContext(SocketContext);
  const [directChatData, setDirectChatData] = useState(null);
  const [loadingTalkRoom, setLoadingTalkRoom] = useState(false);
  const [directChatIds, setDirectChatIds] = useState(null);
  const [messagesPending, setMessagesPending] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [smallDisplay, setSmallDisplay] = useState(false);
  const [messageList, setMessageList] = useState(null);
  const [focus, setFocus] = useState('friends');

  let messages = [];

  const username = user.displayName;
  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (directChatIds) {
      for (const friend of directChatIds) {
        if (!friend.endsWith('undefined')) {
          socket.emit('joinRoom', { username, friend });
        }
      }
    }

    return () => {};
  }, [directChatIds]);

  useEffect(() => {
    if (directChatData?.directChatId) {
      fetchRoomMessages();
    }
  }, [directChatData?.directChatId]);

  function fetchRoomMessages() {
    console.log('fetching messages');
    setMessagesPending(true);
    axios(`${process.env.REACT_APP_API_URL}/api/comment/${directChatData.directChatId}/list`, {
      method: 'get',
    })
      .then((res) => {
        if (_.isArray(res.data)) {
          messages = res.data;
          setMessagesLoaded(true);
          console.log(messages);
          setMessagesPending(false);
          setMessageList(messages);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="row dashboard">
      {(focus === 'friends' || windowSize.innerWidth >= 768) && (
        <div className="friend-container col-md-3">
          <div className="friend-wrapper">
            <Friends
              auth={auth}
              user={user}
              directChatData={directChatData}
              setDirectChatData={setDirectChatData}
              setDirectChatIds={setDirectChatIds}
              showSuccess={showSuccess}
              setLoadingTalkRoom={setLoadingTalkRoom}
              setFocus={setFocus}
            />
          </div>
        </div>
      )}
      {(focus === 'room' || windowSize.innerWidth >= 768) && (
        <div className="friend-container col-md-9">
          {messagesPending && (
            <div className="d-flex justify-content-center mt-5 align-items-center loading">
              <LoadingIcon />
            </div>
          )}
          <div>
            {messageList && messagesLoaded && !messagesPending && directChatData?.directChatId && (
              <TalkRoom
                changePage={changePage}
                auth={auth}
                user={user}
                directChatData={directChatData}
                setDirectChatData={setDirectChatData}
                loadingTalkRoom={loadingTalkRoom}
                setFocus={setFocus}
                fetchRoomMessages={fetchRoomMessages}
                messagesLoaded={messagesLoaded}
                setMessageList={setMessageList}
                messageList={messageList}
                message={messages}
              />
            )}
          </div>
        </div>
      )}
      {/* <div className="friend-container col-md-3">
        <div>Other data</div>
      </div> */}
    </div>
  );
}

export default Dashboard;
