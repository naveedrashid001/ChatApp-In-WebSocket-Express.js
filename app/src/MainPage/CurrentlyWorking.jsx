import React from 'react';

import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
function CurrentlyWorking() {
    const navigate = useNavigate();
  return (
    <div className="container text-center mt-5">
      <div className="row">
        <div className="col">
        {/* <Link to="/mainpage"> */}
        <i
          className="bi bi-arrow-left"
          style={{ cursor: 'pointer', marginRight: '8px', fontWeight: 'bold' }}
          onClick={() => navigate(-1)}
        >MainPage</i>
            {/* <h4>MainPage</h4>  */}
            {/* </Link> */}
          <h2 className="mb-4">Currently Working</h2>
          <h4 className="text-danger m-0">404 Error</h4>
          <img
            src="https://user-images.githubusercontent.com/55389276/140866485-8fb1c876-9a8f-4d6a-98dc-08c4981eaf70.gif"
            alt="404 Animation"
            className="img-fluid my-4"
            style={{ maxWidth: '90%', height: '300px' }}
          />
          <p className="text-muted">
            Oops! The page you are looking for Currently Working.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CurrentlyWorking;
