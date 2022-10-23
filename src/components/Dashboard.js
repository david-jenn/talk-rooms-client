import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/socket';

import Friends from './Friends';
import TalkRoom from './TalkRoom';
import LoadingIcon from './LoadingIcon';

function Dashboard({ auth, changePage, changeSubPage, user, showSuccess }) {
  const socket = useContext(SocketContext);
  const [directChatData, setDirectChatData] = useState(null);
  const [loadingTalkRoom, setLoadingTalkRoom] = useState(false);
  const [directChatIds, setDirectChatIds] = useState(null);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [smallDisplay, setSmallDisplay] = useState(false);
  const [focus, setFocus] = useState('friends');

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
          {loadingTalkRoom && (
            <div className="d-flex justify-content-center mt-5">
              <LoadingIcon />
            </div>
          )}
          <div>
            <TalkRoom
              changePage={changePage}
              auth={auth}
              user={user}
              directChatData={directChatData}
              setDirectChatData={setDirectChatData}
              loadingTalkRoom={loadingTalkRoom}
              setFocus={setFocus}
            />
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
