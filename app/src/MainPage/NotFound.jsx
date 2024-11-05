import React from 'react';

function NotFound() {
  return (
    <div className="container text-center mt-5">
      <div className="row">
        <div className="col">
          <h2 className="mb-4">Page Not Found</h2>
          <h4 className="text-danger m-0">404 Error</h4>
          <img
            src="https://cdn.dribbble.com/users/1138875/screenshots/4669703/404_animation.gif"
            alt="404 Animation"
            className="img-fluid my-4"
            style={{ maxWidth: '90%', height: '300px' }}
          />
          <p className="text-muted">
            Oops! The page you are looking for doesn't exist.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
