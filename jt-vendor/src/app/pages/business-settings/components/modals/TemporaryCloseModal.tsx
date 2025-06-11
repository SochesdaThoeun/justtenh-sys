import React from 'react';

// Add type declaration for Bootstrap modal
declare global {
  interface Window {
    bootstrap: any;
  }
}

interface TemporaryCloseModalProps {
  isTemporaryClosed: boolean;
  onConfirm: (status: boolean) => void;
}

const TemporaryCloseModal: React.FC<TemporaryCloseModalProps> = ({
  isTemporaryClosed,
  onConfirm
}) => {
  const handleConfirm = () => {
    // Toggle the current status
    onConfirm(!isTemporaryClosed);
    
    // Close the modal
    const modalElement = document.getElementById('kt_modal_temporary_close');
    if (modalElement) {
      const bsModal = window.bootstrap.Modal.getInstance(modalElement);
      if (bsModal) {
        bsModal.hide();
      }
    }
  };
  
  return (
    <div className="modal fade" id="kt_modal_temporary_close" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bold">
              {isTemporaryClosed ? 'Reopen Store' : 'Temporarily Close Store'}
            </h2>
            <div className="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
              <i className="ki-outline ki-cross fs-1"></i>
            </div>
          </div>
          <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <p className="text-gray-800 fs-6 fw-semibold mb-8">
              {isTemporaryClosed 
                ? 'Are you sure you want to reopen your store? Your store will be visible to customers again.' 
                : 'Are you sure you want to temporarily close your store? Your store will not be visible to customers until you reopen it.'}
            </p>
            <div className="text-center pt-10">
              <button type="button" className="btn btn-light me-3" data-bs-dismiss="modal">
                Cancel
              </button>
              <button 
                type="button" 
                className={`btn ${isTemporaryClosed ? 'btn-success' : 'btn-danger'}`}
                onClick={handleConfirm}
              >
                <span className="indicator-label">
                  {isTemporaryClosed ? 'Reopen Store' : 'Close Store'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemporaryCloseModal; 