import RemoveFriendModal from './RemoveFriendModal';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { socket } from '../context/socket';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function FriendListItem({ auth, user, connection, joinDirectChat }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function removeFriend() {
    axios(`${process.env.REACT_APP_API_URL}/api/friend/remove-friend`, {
      method: 'put',
      data: {
        userId: user._id,
        friendId: connection.friend.id,
      },
    })
      .then((res) => {
        console.log(res);
        const data = {
          sender: user,
          receiver: connection.friend,
        };
        socket.emit('REMOVE_FRIEND', data);
        handleClose();
      })
      .catch((err) => {
        const resError = err?.response?.data?.error;
        if (resError) {
          if (typeof resError === 'string') {
            console.log(resError);
          } else if (resError.details) {
            console.log(_.map(resError.details, (x, index) => <div key={index}>{x.message}</div>));
          } else {
            console.log(JSON.stringify(resError));
          }
        } else {
          console.log(err.message);
        }
      });
  }

  return (
    <div className="card p-2 mb-1">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="me-3">{connection.friend.displayName}</div>
          <div>
            <Button className="btn-sm" variant="danger" onClick={handleShow}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          
          <Modal show={show} onHide={handleClose}>
            <Modal.Header className="bg-dark" closeButton>
              <Modal.Title>Remove Friend</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark">
              Are you sure you want to permanently remove{' '}
              <span className="fw-bold fs-5">{connection.friend.displayName}</span> from your friends list?
            </Modal.Body>

            <Modal.Footer className="bg-dark">
              <div className="d-flex justify-content-end">
                <Button className="me-3" variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={(evt) => removeFriend()}>
                  Remove
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
          </div>
        </div>

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
  );
}

export default FriendListItem;
