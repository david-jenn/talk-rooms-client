import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { socket } from '../context/socket';

import onInputChange from '../utils/onInputChange';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function CreateGroup({auth, user}) {

  const [show, setShow] = useState(false);

  const [groupName, setGroupName] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function createGroup() {
    axios(`${process.env.REACT_APP_API_URL}/api/group/create-group`, {
      method: 'put',
      data: {
        user: user,
        groupName: groupName,
      }
    })
    .then((res) => {
      console.log(res);
      //TODO Show Toast..
      handleClose();
    
    })
    .catch((err) => {
      console.log(err);
      //TO DO Buff Catch..
      handleClose();
     
    })
  }

  return (
    <div className="mb-3">
      <Button className="btn-sm" variant="primary" onClick={handleShow}>
              Create Group +
            </Button>

            <Modal show={show} onHide={handleClose}>
            <Modal.Header className="bg-dark" closeButton>
              <Modal.Title>Create Group</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark">
              <div className="">
                <label for="group-name" className="form-label">Group Name</label>
                <input type="text" id="group-name" className="form-control" onChange={(evt) => onInputChange(evt, setGroupName)}></input>
              </div>
            </Modal.Body>

            <Modal.Footer className="bg-dark">
              <div className="d-flex justify-content-end">
                <Button className="me-3" variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={(evt) => createGroup()}>
                  Create Group
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
    </div>
  )
}

export default CreateGroup;