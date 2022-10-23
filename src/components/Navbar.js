function Navbar({ auth, onLogout, changePage, changeSubPage }) {
  function onClickLogout(evt) {
    evt.preventDefault();
    onLogout();
  }

  return (
    <div>
      <nav class="navbar navbar-expand-sm  mb-1  border-bottom ">
        <div class="container-fluid">
           
            <a
              class="navbar-brand"
              href="#"
              onClick={auth ? (evt) => changeSubPage('Dashboard') : (evt) => changePage('SignIn')}
            >
              Talk Rooms
            </a>
          
        
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              {!auth && (
                <li class="nav-item ">
                  <a class="nav-link active" aria-current="page" href="#" onClick={(evt) => changePage('Register')}>
                    Register
                  </a>
                </li>
              )}
              {auth && (
                <li class="nav-item">
                  <a class="nav-link" href="#" onClick={(evt) => changeSubPage('Dashboard')}>
                    Dashboard
                  </a>
                </li>
              )}
              {/* {auth && <li class="nav-item">
          <a class="nav-link" href="#" onClick={(evt) => changeSubPage('FindRooms')} >Find Rooms</a>
        </li> } */}
              {auth && (
                <li class="nav-item">
                  <a class="nav-link" href="#" onClick={(evt) => onClickLogout(evt)}>
                    Logout
                  </a>
                </li>
              )}

              {/* {auth &&  <li class="nav-item">
          <a class="nav-link" href="#">Pricing</a>
        </li> } */}
            </ul>
            {auth && <span class="navbar-text">{auth.payload.email}</span>}
          </div>
        </div>
      </nav>

      {/* <nav class="navbar navbar-light bg-light mb-3">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            TalkRooms
          </a>
          {auth && (
            <span class="navbar-text" onClick={(evt) => onClickLogout(evt)}>
              Logout
            </span>
          )}

          {!auth && (
            <span class="navbar-text" onClick={(evt) => changePage('Register')}>
              Register
            </span>
          )}
        </div>
      </nav> */}
    </div>
  );
}

export default Navbar;
