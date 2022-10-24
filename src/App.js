import './App.scss';
import React, { useState, useEffect, useRef } from 'react';

import _ from 'lodash';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import TalkRoom from './components/TalkRoom';
import Footer from './components/Footer';
import Login from './components/Login';
import FindRooms from './components/FindRooms';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Container from './components/Container';

import { io } from 'socket.io-client';

function App() {
  const [auth, setAuth] = useState(null);
  const [page, setPage] = useState('SignIn');
  const [subPage, setSubPage] = useState('Dashboard')
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  let roomName;
  let usernameHolder;

  function onLogin(auth) {
    setAuth(auth);
    setPage('Container');
    setSubPage('Dashboard')
  }

  function onLogout(auth) {
    setAuth(null);
    setPage('SignIn');
    if (localStorage) {
      localStorage.removeItem('authToken');
    }
  }

  function changePage(pageName) {
    setPage(pageName);
  }
  function changeSubPage(subPageName) {
    setPage('Container')
    setSubPage(subPageName);
  }

  function getRoom(room) {
    setRoom(room);
    roomName = room;
  }

  function getUsername(username) {
    setUsername(username);
    usernameHolder = username;
  }

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
  }

  function showError(message) {
    toast(message, { type: 'error', position: 'bottom-right' });
  }

  function showSuccess(message) {
    toast(message, { type: 'success', position: 'bottom-right' });
  }

  //const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100 background text-light">
      <Navbar auth={auth} onLogout={onLogout} changePage={changePage} changeSubPage={changeSubPage} />
      <ToastContainer />
      <main className="container-fluid flex-grow-1">
        {page === 'SignIn' && <Login onLogin={onLogin} getUsername={getUsername} getRoom={getRoom}  />}
        {page === 'Register' && <Register onLogin={onLogin}/>}
        {page === 'Container' && <Container changePage={changePage} auth={auth} getRoom={getRoom} room={room} onInputChange={onInputChange} changeSubPage={changeSubPage} subPage={subPage} showSuccess={showSuccess}  />}
        
        
        
        
        

      </main>
      <Footer />
    </div>
  );
}

export default App;
