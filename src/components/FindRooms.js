import onInputChange from '../utils/onInputChange';
import React, { useState, useEffect, useRef } from 'react';

import CommonRoom from './CommonRoom';
import CreateRoom from './CreateRoom';
import SearchRooms from './SearchRooms';

function FindRooms({ getRoom, changePage, changeSubPage }) {
  const [room, setRoom] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [roomStatus, setRoomStatus] = useState('public');

  function onJoinRoom(evt, room, onInputChange) {
    evt.preventDefault();
    if (!room) {
      setErrorMessage('room cannot be left blank');
      return;
    }

    getRoom(room);
    changeSubPage('TalkRoom');
  }

  return (
    <div>
      <h1>Find Rooms</h1>
      <div className="bg-light p-3">
        <div>
          <h2>Common Rooms</h2>
          <div className="common-room-wrapper row">
            <CommonRoom
              onJoinRoom={onJoinRoom}
              name="Coding"
              description="A common room to discuss coding languages and project ideas"
            />
            <CommonRoom
              onJoinRoom={onJoinRoom}
              name="Gaming"
              description="A common room to discuss game strategies and upcoming games"
            />
            <CommonRoom
              onJoinRoom={onJoinRoom}
              name="Sports"
              description="A common room to discuss sports related topics"
            />
            <CommonRoom
              onJoinRoom={onJoinRoom}
              name="Casual"
              description="A casual common room to discuss a variety of topics"
            />
          </div>
        </div>
        <div className="row">
        <div className="search-room-container col-md-6 p-3">
            <SearchRooms onJoinRoom={onJoinRoom} />
          </div>
          <div className="create-room-wrapper col-md-6 p-3">
            <CreateRoom onJoinRoom={onJoinRoom} />
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default FindRooms;
