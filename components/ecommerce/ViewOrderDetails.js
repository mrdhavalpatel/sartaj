import React, { useState } from "react";
const ViewOrderDetails = ({ isOpen, pdfUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={pdfUrl}
          title="PDF"
          frameBorder="0"
          scrolling="auto"
          width="100%"
          height="100%"
        />
        {/* <button className="close-button" onClick={onClose}>Close</button> */}
      </div>
    </div>
  );
};
export default ViewOrderDetails;
