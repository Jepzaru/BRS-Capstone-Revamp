import React from 'react';
import '../../CSS/UserCss/ReservationModal.css'; 

const ReservationModal =  ({ isOpen, onClose, onConfirm, message, type }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{message}</h2>
            <div className="modal-buttons">
              {type === 'confirmation' && (
                <>
                  <button onClick={onClose} className="modal-button-cancel-button">Cancel</button>
                  <button onClick={onConfirm} className="modal-button-confirm-button">Reserve</button>
                </>
              )}
              {type === 'error' && (
                <button onClick={onClose} className="modal-button">Close</button>
              )}
            </div>
          </div>
        </div>
      );
    };

export default ReservationModal;
