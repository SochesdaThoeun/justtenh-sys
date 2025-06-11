import React from 'react';

// Add type declaration for Bootstrap modal
declare global {
  interface Window {
    bootstrap: any;
  }
}

interface DeleteStoreModalProps {
  onConfirm: () => void;
}

const DeleteStoreModal: React.FC<DeleteStoreModalProps> = ({ onConfirm }) => {
  const handleConfirm = () => {
    // Call the onConfirm callback
    onConfirm();
    
    // Close the modal
    const modalElement = document.getElementById('kt_modal_delete_store');
    if (modalElement) {
      const bsModal = window.bootstrap.Modal.getInstance(modalElement);
      if (bsModal) {
        bsModal.hide();
      }
    }
  };
  
  return (
    <div className="modal fade" id="kt_modal_delete_store" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bold text-danger">Delete Store Account</h2>
            <div className="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
              <i className="ki-outline ki-cross fs-1"></i>
            </div>
          </div>
          <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <div className="notice d-flex bg-light-warning rounded border-warning border border-dashed mb-9 p-6">
              <i className="ki-duotone ki-information fs-2tx text-warning me-4">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
              <div className="d-flex flex-stack flex-grow-1">
                <div className="fw-semibold">
                  <h4 className="text-gray-900 fw-bold">Warning!</h4>
                  <div className="fs-6 text-gray-700">
                    <p className="mb-2">
                      This action is irreversible. Once you delete your store, all information 
                      associated with it will be permanently deleted.
                    </p>
                    <p className="mb-0">
                      Before proceeding, please ensure that:
                    </p>
                    <ul className="mb-0 mt-2">
                      <li>You don't have any ongoing orders</li>
                      <li>All admin commissions have been paid</li>
                      <li>All delivery man transactions have been cleared</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-800 fs-6 fw-semibold mb-8">
              Are you absolutely sure you want to delete your store? Type "DELETE" in the field 
              below to confirm.
            </p>
            
            <div className="fv-row mb-10">
              <input 
                type="text" 
                className="form-control form-control-solid" 
                id="delete-confirmation"
                placeholder="Type DELETE to confirm"
                onChange={(e) => {
                  const deleteBtn = document.getElementById('delete-store-btn') as HTMLButtonElement;
                  if (deleteBtn) {
                    deleteBtn.disabled = e.target.value !== 'DELETE';
                  }
                }}
              />
            </div>
            
            <div className="text-center pt-10">
              <button 
                type="button" 
                className="btn btn-light me-3" 
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                id="delete-store-btn"
                disabled
                onClick={handleConfirm}
              >
                <span className="indicator-label">Delete Store</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteStoreModal; 