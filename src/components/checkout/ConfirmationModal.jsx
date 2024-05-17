import React from 'react';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-content">
            <p className='text-lg'>{message}</p>
            <div className="flex space-evenly mt-4">
            <button className='bg-accent rounded-lg text-white px-8 py-3 h-10' onClick={onConfirm}>Confirm</button>
            <button className='bg-accent rounded-lg text-white px-8 py-3 h-10' onClick={onCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;