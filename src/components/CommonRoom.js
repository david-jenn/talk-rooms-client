function CommonRoom({ onJoinRoom, name, description }) {
  return (
    <div className="p-1 col-md-6 common-room" onClick={(evt) => onJoinRoom(evt, name)}>
      <div className="card">
        <div className="card-body">
          <div className="card-title fs-4">{name}</div>
          <div class="card-text">{description}</div>
        </div>
      </div>
    </div>
  );
}

export default CommonRoom;
