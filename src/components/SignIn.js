import onInputChange from '../utils/onInputChange';
import React, { useState, useEffect, useRef } from 'react';

function SignIn({ changePage, getUsername, getRoom }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function onSignIn(evt, username, room) {
    evt.preventDefault();
    if (!username) {
      setErrorMessage('Username cannot be left blank');
      return;
    }
    if (!room) {
      setErrorMessage('Room cannot be left blank');
      return;
    }

    getUsername(username);
    getRoom(room);

    changePage('FindRooms');
  }

  return (
    <div>
    
      <form className="row">
        <div className="mb-2 col-md-6">
          <label htmlFor="message" className="form-label">
            Username
          </label>
          <input id="message" className="form-control" onChange={(evt) => onInputChange(evt, setUsername)}></input>
        </div>
        <div className="mb-2 col-md-6">
          <label htmlFor="message" className="form-label">
            Room
          </label>
          <input id="message" className="form-control" onChange={(evt) => onInputChange(evt, setRoom)}></input>
        </div>
        <div className="mb-2">
          <button className="btn btn-primary" onClick={(evt) => onSignIn(evt, username, room)}>
            Join Room
          </button>
          <div className="text-danger">{errorMessage}</div>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
