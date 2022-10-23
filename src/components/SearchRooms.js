
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import _ from 'lodash';

function SearchRooms({onJoinRoom}) {
  const searchRoomRef = useRef(null);
  const [roomSearch, setRoomSearch] = useState('');
  const [error, setError] = useState('');
  const [roomSearchResults, setRoomSearchResults] = useState([]);

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
    fetchRooms(newValue);
  }
  

  function fetchRooms(roomSearch) {
    axios(`${process.env.REACT_APP_API_URL}/api/room/list`, {
      method: 'get',
      params: { keyword: roomSearch },
    })
      .then((res) => {
        console.log(res);
        setRoomSearchResults(res.data);
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
  return (
    <div>
      <h2>Search Public Rooms</h2>
      <div className="">
        <div>
          <label htmlFor="room-search-input" className="form-label">
            Room Name
          </label>
          <input
            id="room-search-input"
            className="form-control"
            onChange={(evt) => onInputChange(evt, setRoomSearch)}
            onFocus={(evt) => fetchRooms(roomSearch)}
            onBlur={(evt) => setRoomSearchResults([])}
            ref={searchRoomRef}
          ></input>
        </div>
        {roomSearchResults && roomSearchResults.length > 0 && (
          <div>
            {
              _.map(roomSearchResults, (room) => (
                <div className="common-room">
                <div className="card p-1" onMouseDown={(evt) => evt.preventDefault()} onClick={(evt) => onJoinRoom(evt, room.name).then(() => searchRoomRef.current.blur())}>{room.name}</div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchRooms;
