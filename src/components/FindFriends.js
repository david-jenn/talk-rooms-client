import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { SocketContext } from '../context/socket';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

import InputField from './InputField';

function FindFriends({ auth, user, friendList }) {

  const friendInputRef = useRef(null);
  const [error, setError] = useState('');
  const [friendSearch, setFriendSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const socket = useContext(SocketContext);



  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
    fetchUsers(newValue);
  }

  function filterFriends(userList) {
  
   

    const friendIds = friendList.map((item) => {
      return item.friend?.id;
    });

  
    const updatedUserList = [];
    for (const userItem of userList) {
      if (!friendIds.includes(userItem._id) && userItem._id !== auth.userId) {
        updatedUserList.push(userItem);
      }
    }

    setSearchResults(updatedUserList);
  }

  function fetchUsers(query) {
    axios(`${process.env.REACT_APP_API_URL}/api/user/list`, {
      method: 'get',
      params: { keyword: query },
    })
      .then((res) => {
        
        filterFriends(res.data);
      })
      .catch((err) => {
        const resError = err?.response?.data?.error;
        if (resError) {
          if (typeof resError === 'string') {
            setError(resError);
          } else if (resError.details) {
            setError(_.map(resError.details, (x, index) => <div key={index}>{x.message}</div>));

            for (const detail of resError.details) {
            }
          } else {
            setError(JSON.stringify(resError));
          }
        } else {
          setError(err.message);
        }
      });
  }

  function sendFriendRequest(friend) {
    friendInputRef.current.blur();
    
   
    const sender = {
      id: user._id,
      displayName: user.displayName,
    };
    axios(`${process.env.REACT_APP_API_URL}/api/friend/send-request`, {
      method: 'put',
      data: {
        sender: sender,
        friend: { id: friend._id, displayName: friend.displayName },
        accepted: false,
        cancelled: false,
      },
      
    })
      .then((res) => {
        const friendId = friend._id;
        const userDisplayName = user.displayName;
        const userId = user._id;
        socket.emit('FRIEND_REQUEST', {friendId, userDisplayName, userId});
        toast.success(`Friend request sent to ${friend.displayName}`)
       
      })
      .catch((err) => {
        console.error(err);
    
        const resError = err?.response?.data?.error;
        if (resError) {
          if (typeof resError === 'string') {
            setError(resError);
            console.log(resError);
          } else if (resError.details) {
            setError(_.map(resError.details, (x) => <div>{x.message}</div>));
          } else {
            setError(JSON.stringify(resError));
          }
        } else {
          setError(err.message);
        }
      });
  }

  return (
    <div className="mb-3 pb-3 border-2 border-bottom">
     
      <label htmlFor="room-search-input" className="form-label d-none">
        Search Users
      </label>
      <input
        id="search-display-name"
        type="username"
        className="form-control mb-1"
        placeholder="Search Users"
        onChange={(evt) => onInputChange(evt, setFriendSearch)}
        onFocus={(evt) => fetchUsers(friendSearch)}
        onBlur={(evt) => setSearchResults([])}
        ref={friendInputRef}
      ></input>
      {searchResults && searchResults.length > 0 && (
        <div className="">
          <div className="">
            {_.map(searchResults, (result) => (
              <div key={result._id} className="friend-search-item mb-1" >
                <div className="card p-1">
                  <div className="d-flex justify-content-between">
                    <div>{result.displayName}</div>
                    <div className="text-primary common-room">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onMouseDown={(evt) => evt.preventDefault()}
                        onClick={(evt) => sendFriendRequest(result)}
                      >
                        add
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
     
    </div>
  );
}

export default FindFriends;
