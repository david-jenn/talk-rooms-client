import { useEffect, useState } from "react";

function RemoveFriendModal({connection}) {

  const [name, setName] = useState(null);

  
  useEffect(() => {
    console.log(connection);
    setName(connection.friend.id);
  }, [connection])
  return (
    <div class="modal fade" id="removeFriendModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
      {name && <div class="modal-dialog text-light">
        <div class="modal-content ">
          <div class="modal-header bg-dark">
            <h1 class="modal-title fs-5 text-light" id="modalLabel">
              Are you sure you want to remove this friend {connection.friend.id}?
            </h1>
            <button type="button" class="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body bg-dark">
            <div className="d-flex justify-content-end p-3">
              <div><button className="btn btn-secondary me-3" data-bs-dismiss="modal">Cancel</button></div>
              <div><button className="btn btn-danger">Remove {connection.friend.displayName}</button></div>

            </div>
          </div>
          
        </div>
      </div>}
    </div>
  );
}

export default RemoveFriendModal;
