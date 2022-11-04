import RemoveFriendModal from './RemoveFriendModal';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { socket } from '../context/socket';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';

function FriendListItem({ auth, user, connection, joinDirectChat }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (evt) => {
    evt.preventDefault()
    setShow(true);
  }
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
    <div className="card p-2 mb-1 border border-secondary">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="me-3 align-self-center fw-bold">{connection.friend.displayName}</div>
          <div>
            <div className="friend-option fs-5 ps-2 pe-2" data-bs-toggle="dropdown" aria-expanded="false">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </div>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="/" onClick={(evt) => joinDirectChat(evt, connection.friend)}>
                  Chat
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="." onClick={(evt) => handleShow(evt)}>
                  Remove Friend
                </a>
              </li>
            </ul>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header className="" closeButton>
                <Modal.Title>Remove Friend</Modal.Title>
              </Modal.Header>

              <Modal.Body className="">
                Are you sure you want to permanently remove{' '}
                <span className="fw-bold">{connection.friend.displayName}</span> from your friends list?
              </Modal.Body>

              <Modal.Footer className="">
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
            onClick={(evt) => joinDirectChat(evt, connection.friend)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendListItem;
