import React from "react";
import "./ConfirmationModal.css";

const ConfirmationModal = (props) => {
  const {
    confirmCallback, rejectCallback, message, className, confirmText, rejectText,
  } = props;

  return (
    <div className={`confirmation-modal ${className}`}>
      <div className="confirmation-modal__content">
        <p className="confirmation-modal__question">
          { message }
        </p>
        <div className="confirmation-modal__buttons">
          <button type="button" onClick={rejectCallback}>
            { rejectText || "No" }
          </button>
          <button type="button" onClick={confirmCallback}>
            { confirmText || "Yes" }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
