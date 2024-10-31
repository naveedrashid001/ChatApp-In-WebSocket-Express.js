import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Icon() {
  return (
    <div className="d-flex flex-column justify-content-between align-items-start" style={{ height: '98vh' }}>
      {/* First Group of Icons */}
      <div className="d-flex flex-column gap-2">
        <i className="bi bi-justify"></i>
        <i className="bi bi-chat"></i>
        <i className="bi bi-telephone"></i>
        <i className="bi bi-app-indicator"></i>
      </div>

      {/* Second Group of Icons */}
      <div className="d-flex flex-column gap-2">
        
        <i className="bi bi-archive"></i>
        <i className="bi bi-gear"></i>
        <Link to="/profile">
        <i className="bi bi-person-circle"></i>
        </Link>
      </div>
    </div>
  );
}

export default Icon;
