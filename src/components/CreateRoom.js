import onInputChange from '../utils/onInputChange';
import React, { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';

function CreateRoom({onJoinRoom}) {
  const [room, setRoom] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [roomStatus, setRoomStatus] = useState('public');

  function onCreateRoom(evt) {
    evt.preventDefault();
    if (!room) {
      setError('Room must have a name');
      setSuccess('');
      return;
    }

    axios(`${process.env.REACT_APP_API_URL}/api/room/new`, {
      method: 'put',
      data: {
        name: room,
        public: roomStatus,
      },
    })
      .then((res) => {
        console.log(res.data.message);
        setSuccess(res.data.message);
        setError('');
        onJoinRoom(evt, room);
      })
      .catch((err) => {
        setSuccess('');
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
    <div>
      <h2>Create Private Room</h2>
      <div class="form-check">
        <input
          class="form-check-input"
          value="public"
          type="radio"
          checked={roomStatus === 'public' ? true : false}
          onChange={(evt) => onInputChange(evt, setRoomStatus)}
          name="flexRadioDefault"
          id="flexRadioDefault1"
        />
        <label class="form-check-label" for="flexRadioDefault1">
          Public
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          value="private"
          type="radio"
          checked={roomStatus === 'private' ? true : false}
          onChange={(evt) => onInputChange(evt, setRoomStatus)}
          name="flexRadioDefault"
          id="flexRadioDefault2"
        />
        <label class="form-check-label" for="flexRadioDefault2">
          Private
        </label>
      </div>

      <div className="mb-3">
        <div>
          <label htmlFor="room-name" className="form-label">
            Room Name
          </label>
          <input id="room-name" className="form-control" onChange={(evt) => onInputChange(evt, setRoom)}></input>
        </div>
        {roomStatus === 'private' && (
          <div>
            <label htmlFor="room-password" className="form-label">
              Room Password
            </label>
            <input
              id="room-password"
              className="form-control"
              onChange={(evt) => onInputChange(evt, setRoomPassword)}
            ></input>
          </div>
        )}
      </div>

      <div className="mb-2">
        <button className="btn btn-primary" onClick={(evt) => onCreateRoom(evt)}>
          Create Room
        </button>
        <div className="text-danger">{error}</div>
        <div className="text-success">{success}</div>
      </div>
    </div>
  );
}

export default CreateRoom;
