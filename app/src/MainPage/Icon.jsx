import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <i className="bi bi-person-circle"></i>
      </div>
    </div>
  );
}

export default Icon;
