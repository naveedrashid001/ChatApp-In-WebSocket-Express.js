import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Friends from './Friends';
import Icon from './Icon';
import AddFriend from './AddFriend';

function NavBar() {
  return (
    <div className="d-flex ">
        <div className=" p-2" style={{ width: '10%', height:"100vh" }}>
            <Icon />
        </div>
      <div className="card p-2" style={{ width: '95%', height:"100vh" }}>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Chats</h5>
          <div>
            <i className="bi bi-filter me-2"></i>
            {/* <i className="bi bi-pencil-square"></i> */}
            <AddFriend />
          </div>
        </div>
        <div className="input-group mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search or start a new chat"
          />
        </div>
        <div className='mt-3'>
        <Friends />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
