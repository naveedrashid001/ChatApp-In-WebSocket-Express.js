import React from 'react';
import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import UnSelectedChat from './UnSelectedChat';
// import Icon from './Icon';

function MainPage() {
  return (
    <div className="container-fluid">
      <div className="row">
      {/* <div className="col-1">
          <Icon />
        </div> */}
      <div className="col-4">
          <NavBar />
        </div>
        <div className="col-8">
        <UnSelectedChat />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
