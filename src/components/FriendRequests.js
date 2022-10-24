import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import _, { set } from 'lodash';
import { SocketContext } from '../context/socket';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FriendRequests({ auth, user, showSuccess }) {
  const [error, setError] = useState('');
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentFriendRequests, setSentFriendRequests] = useState([]);

  const socket = useContext(SocketContext);

  let sentRequests = [];
  let receivedRequests = [];

  const requestCancelSender = useCallback((data) => {
    console.log('cancel sender');
    const updatedRequests = [];
    for (const request of sentRequests) {
      if (request.sender?.id === data.sender._id && request.friend?.id !== data.receiver?.id) {
        updatedRequests.push(request);
      }
    }
    sentRequests = [...updatedRequests];
    setSentFriendRequests(updatedRequests);
  });

  const requestCancelReceiver = useCallback((data) => {
    console.log('cancel receiver')
    const updatedRequests = [];
    for (const request of receivedRequests) {
      if (request.sender?.id === data.sender._id && request.friend?.id !== data.receiver?.id) {
        updatedRequests.push(request);
      }
    }
    sentRequests = [...updatedRequests];
    setFriendRequests(updatedRequests);
  });

  const requestAcceptedSender = useCallback((data) => {
    console.log('in sender')
    const updatedRequests = [];
    for (const request of receivedRequests) {
      if (request.sender?.id === data.sender._id && request.friend?.id !== data.receiver?.id) {
        updatedRequests.push(request);
      }
    }
    sentRequests = [...updatedRequests];
    setFriendRequests(updatedRequests);
    toast.success(`You are now friends with ${data.receiver?.displayName}`);
  });

  const requestAcceptedReceiver = useCallback((data) => {
    console.log('in receiver');
    const updatedRequests = [];
    console.log(data)
    console.log(sentRequests);
    for (const request of sentRequests) {
      if (request.friend?.id !== data.sender?._id) {
        updatedRequests.push(request);
      }
    }
    sentRequests = [...updatedRequests];
    setSentFriendRequests(updatedRequests);
    toast.success(`You are now friends with ${data.sender?.displayName}`);
  });

  const requestRejectReceiver = useCallback((data) => {
    const updatedRequests = [];
    for (const request of sentRequests) {
      if (request.sender?.id === data.receiver.id && request.friend?.id !== data.sender?._id) {
        updatedRequests.push(request);
      }
    }
    sentRequests = [...updatedRequests];
    setSentFriendRequests(updatedRequests);
  });
  const requestRejectSender = useCallback((data) => {
    const updatedRequests = [];
    for (const request of receivedRequests) {
      if (request.sender?.id === data.sender._id && request.friend?.id !== data.receiver?.id) {
        updatedRequests.push(request);
      }
    }
    sentRequests = [...updatedRequests];
    setFriendRequests(updatedRequests);
  });

  useEffect(() => {
    getFriendRequests();
    getSentFriendRequests();

    socket.on('REQUEST_ACCEPTED_SENDER', requestAcceptedSender);
    socket.on('REQUEST_ACCEPTED_RECEIVER', requestAcceptedReceiver);
    socket.on('REQUEST_REJECTED_RECEIVER', requestRejectReceiver);
    socket.on('REQUEST_REJECTED_SENDER', requestRejectSender);

    socket.on('REQUEST_RECEIVED', (message) => {
      getFriendRequests();
      toast.success(message);
    });

    socket.on('REQUEST_SENT', (message) => {
      getSentFriendRequests();
    });

    socket.on('REQUEST_CANCELED_SENDER', requestCancelSender);

    socket.on('REQUEST_CANCELED_RECEIVER', requestCancelReceiver);

    return () => {
      socket.off('REQUEST_ACCEPTED_SENDER');
      socket.off('REQUEST_ACCEPTED_RECEIVER');
      socket.off('REQUEST_REJECTED_RECEIVER');
      socket.off('REQUEST_REJECTED_SENDER');
      socket.off('REQUEST_RECEIVED');
      socket.off('REQUEST_SENT');
      socket.off('REQUEST_CANCELED_SENDER');
      socket.off('REQUEST_CANCELED_RECEIVER');
    };
  }, [auth, socket]);

  function getFriendRequests() {
    axios(`${process.env.REACT_APP_API_URL}/api/friend/requests/${auth.payload._id}`, {
      method: 'get',
    })
      .then((res) => {
        setFriendRequests(res.data);
        receivedRequests = [...res.data];
      })
      .catch((err) => {
        const resError = err?.response?.data?.error;
        if (resError) {
          if (typeof resError === 'string') {
            setError(resError);
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

  function getSentFriendRequests() {
    axios(`${process.env.REACT_APP_API_URL}/api/friend/sent-requests/${auth.payload._id}`, {
      method: 'get',
    })
      .then((res) => {
        setSentFriendRequests(res.data);
        sentRequests = [...res.data];
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

  function acceptRequest(friend) {
    const userData = {
      id: user._id,
      displayName: user.displayName,
    };
    axios(`${process.env.REACT_APP_API_URL}/api/friend/accept-request`, {
      method: 'put',
      data: {
        connectionOne: userData,
        connectionTwo: friend,
      },
    })
      .then((res) => {
        const data = {
          sender: user,
          receiver: friend,
        };
        socket.emit('ACCEPT_REQUEST', data);
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

  function rejectRequest(friend) {
    const userData = {
      id: user._id,
      displayName: user.displayName,
    };
    axios(`${process.env.REACT_APP_API_URL}/api/friend/cancel-request`, {
      method: 'put',
      data: {
        connectionOne: userData,
        connectionTwo: friend,
      },
    })
      .then((res) => {
        const data = {
          sender: user,
          receiver: friend,
        };
        toast.warning(`Friend request from ${friend.displayName} rejected`);
        socket.emit('REJECT_REQUEST', data);
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

  function cancelSentRequest(friend) {
    console.log(friend);
    const userData = {
      id: user._id,
      displayName: user.displayName,
    };
    axios(`${process.env.REACT_APP_API_URL}/api/friend/cancel-request`, {
      method: 'put',
      data: {
        connectionOne: friend,
        connectionTwo: userData,
      },
    })
      .then((res) => {
        const data = {
          sender: user,
          receiver: friend,
        };

        socket.emit('CANCEL_REQUEST', data);
        toast.warning(`Friend request to ${friend.displayName} canceled`);
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
    <div>
      <h3 className="fs-5">Friend Requests</h3>
      {friendRequests &&
        friendRequests.length > 0 &&
        _.map(friendRequests, (request) => (
          <div className="card p-1">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex">
                <div className="me-3">{request.sender.displayName}</div>
                <button class="btn btn-primary btn-sm" onClick={(evt) => acceptRequest(request.sender)}>
                  Accept
                </button>
              </div>
              <button class="btn btn-danger btn-sm" onClick={(evt) => rejectRequest(request.sender)}>
                Reject
              </button>
            </div>
          </div>
        ))}
      {!friendRequests ||
        (friendRequests.length === 0 && <div className="fst-italic">No incoming requests pending</div>)}
        <div className="mb-3"></div>
      <div className="mb-1 border-bottom border-secondary border-2"></div>
      <h3 className="fs-5">Sent Requests</h3>
      {!sentFriendRequests ||
        (sentFriendRequests.length === 0 && <div className="fst-italic">No sent requests pending</div>)}
      {sentFriendRequests &&
        sentFriendRequests.length > 0 &&
        _.map(sentFriendRequests, (sentRequest) => (
          <div>
            <div className="card p-1 mb-1">
              <div className="d-flex justify-content-between align-items-center">
                <div>{sentRequest.friend.displayName}</div>
                <button class="btn btn-warning btn-sm" onClick={(evt) => cancelSentRequest(sentRequest.friend)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default FriendRequests;
