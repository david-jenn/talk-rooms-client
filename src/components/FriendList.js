import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import _, { update } from 'lodash';
import { SocketContext } from '../context/socket';

function FriendList({
  auth,
  user,
  directChatData,
  setFriendList,
  setDirectChatData,
  setDirectChatIds,
  setLoadingTalkRoom,
  setLoadingFriends,
  setFocus
}) {
  const [error, setError] = useState('');
  const [friendConnections, setFriendConnections] = useState([]);
  const [newFriendLoad, setNewFriendLoad] = useState(0);

  let connections = [];

  const socket = useContext(SocketContext);

  useEffect(() => {
    console.log(friendConnections);
    console.log('effect');
    console.log('hello');
    
      getFriends();
    

    socket.on('REQUEST_ACCEPTED_SENDER_LIST', (data) => {
      getFriends();
    });
    socket.on('REQUEST_ACCEPTED_RECEIVER_LIST', (data) => {
      getFriends();
    });
    socket.on('DIRECT_MESSAGE_RECEIVED', (data) => {
      console.log('message receieved!');
      console.log(data);
      console.log(connections);
      if (data.friendId === directChatData?.friend.id) {
        return;
      }
      // TODO UPDATE DB.
      console.log(friendConnections);
      if (connections.length > 0) {
        for (const connection of connections) {
          if (connection.friend.id === data.friendId) {
            !connection.unReadCount ? (connection.unReadCount = 1) : connection.unReadCount++;
            updateUnread(connection._id, connection.unReadCount);
          }
        }
        console.log(connections);
        setFriendConnections([...connections]);
      }
    });
    return () => {
      socket.off('REQUEST_ACCEPTED_SENDER_LIST');
      socket.off('REQUEST_ACCEPTED_RECEIVER_LIST');
      socket.off('DIRECT_MESSAGE_RECEIVED');
    };
  }, [auth, user, directChatData]);

  function getFriends() {
    setLoadingFriends(true);
    axios(`${process.env.REACT_APP_API_URL}/api/friend/friend-list/${auth.payload._id}`, {
      method: 'get',
    })
      .then((res) => {
       
        setLoadingFriends(false);
        if (res.data) {
          connections = res.data;
          setFriendConnections([...connections]);
        }

        console.log('setting connections from db');
        console.log(res.data);
        setFriendList(res.data);
        const chatIds = res.data.map((friend) => {
          const connectionArray = [friend._id, user._id];
          const connectionSorted = connectionArray.sort();
          return `${connectionSorted[0]};${connectionSorted[1]}`;
        });
        setDirectChatIds(chatIds);
      })
      .catch((err) => {
        const resError = err?.response?.data?.error;
        if (resError) {
          if (typeof resError === 'string') {
            setError(resError);
            console.log(resError);
          } else if (resError.details) {
            setError(_.map(resError.details, (x, index) => <div key={index}>{x.message}</div>));
          } else {
            setError(JSON.stringify(resError));
          }
        } else {
          setError(err.message);
        }
      });
  }

  function joinDirectChat(friend) {
    setLoadingTalkRoom(true);
    setDirectChatData(null);
    const connections = [...friendConnections];
    const connection = connections.find((connection) => connection.friend.id === friend.id);
    console.log(connection);
    updateUnread(connection._id, 0);
    connection.unReadCount = 0;
    setFriendConnections([...connections]);

    if (!friend || !user) {
      return;
    }
    const idArray = [user._id, friend.id].sort();
    const directChatId = `${idArray[0]};${idArray[1]}`;

    axios(`${process.env.REACT_APP_API_URL}/api/room/join/direct-chat`, {
      method: 'put',
      data: { id: directChatId },
    })
      .then((res) => {
        console.log(res);
        const chatData = {
          directChatId,
          friend: {
            id: friend.id,
            displayName: friend.displayName,
          },
        };
        setLoadingTalkRoom(false);
        setDirectChatData(chatData);
        setFocus('room')
      })
      .catch((err) => {
        const resError = err?.response?.data?.error;
        if (resError) {
          if (typeof resError === 'string') {
            setError(resError);
            console.log(resError);
          } else if (resError.details) {
            setError(_.map(resError.details, (x, index) => <div key={index}>{x.message}</div>));
          } else {
            setError(JSON.stringify(resError));
          }
        } else {
          setError(err.message);
        }
      });
  }

  function updateUnread(connectionId, unreadCount) {
    console.log('in update');
    console.log(connectionId);
    console.log(unreadCount);
    // if(!connectionId) {
    //   return;
    // }
    // if(!unreadCount || unreadCount !== 0) {
    //   return;
    // }
    axios(`${process.env.REACT_APP_API_URL}/api/friend/update-unread`, {
      method: 'put',
      data: { connectionId, unreadCount },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        const resError = err?.response?.data?.error;
        if (resError) {
          if (typeof resError === 'string') {
            setError(resError);
            console.log(resError);
          } else if (resError.details) {
            setError(_.map(resError.details, (x, index) => <div key={index}>{x.message}</div>));
          } else {
            setError(JSON.stringify(resError));
          }
        } else {
          setError(err.message);
        }
      });
  }

  return (
    <div className="mb-1 border-bottom border-2">
      {friendConnections &&
        friendConnections.length > 0 &&
        _.map(friendConnections, (connection) => (
          <div className="card p-2 mb-1">
            <div className="d-flex justify-content-between align-items-center">
              <div>{connection.friend.displayName}</div>

              <div>
                {connection.unReadCount !== 0 && (
                  <span className="me-3 badge rounded-pill bg-danger">{connection.unReadCount}</span>
                )}
                <button
                  className="btn btn-sm btn-primary position-relative"
                  onClick={(evt) => joinDirectChat(connection.friend)}
                >
                  Chat
                </button>
              </div>
            </div>
          </div>
        ))}

      {!friendConnections || (friendConnections.length === 0 && <div className="fst-italic">No Friends Found</div>)}
      <div className="mb-3"></div>
    </div>
  );
}

export default FriendList;
