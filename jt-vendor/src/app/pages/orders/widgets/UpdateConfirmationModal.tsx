import { forwardRef, useRef } from "react";

interface UpdateConfirmationModalProps {
    onSaveChanges: (updatedFields: any) => Promise<boolean | undefined>;
    modalId: string;
    isLoading?: boolean;
    updatedFields?: any;
    updateError?: string | null;
}

const UpdateConfirmationModal = forwardRef<HTMLButtonElement, UpdateConfirmationModalProps>(
    ({ onSaveChanges, modalId, isLoading = false, updatedFields = {}, updateError = null }, ref) => {
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    const handleConfirm = async () => {
      // Pass the updatedFields to the onSaveChanges function
      const success = await onSaveChanges(updatedFields);
      
      // Only close modal if successful
      if (success) {
        cancelButtonRef.current?.click();
      }
    };
      
    return (
      <>
        {/* Modal */}
        <div className="modal fade" tabIndex={-1} id={modalId}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Are you sure you want to update this?</h5>
              </div>
              <div className="modal-body">
                <p>You will not be able to revert this.</p>
                {updatedFields && Object.keys(updatedFields).length > 0 && (
                  <div className="mt-3">
                    <p className="fw-bold">Changes:</p>
                    <ul className="list-group">
                      {updatedFields.orderStatus && (
                        <li className="list-group-item">Order Status: {updatedFields.orderStatus}</li>
                      )}
                      {updatedFields.paymentStatus && (
                        <li className="list-group-item">Payment Status: {updatedFields.paymentStatus}</li>
                      )}
                      {updatedFields.shippingMethod && (
                        <li className="list-group-item">Shipping Method: {updatedFields.shippingMethod}</li>
                      )}
                    </ul>
                  </div>
                )}
                
                {updateError && (
                  <div className="alert alert-danger mt-4">
                    <div className="d-flex flex-column">
                      <h5 className="mb-1">Update Failed</h5>
                      <span>{updateError}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  ref={cancelButtonRef}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="indicator-progress">
                      Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  ) : (
                    'Save changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
  
        {/* Hidden Trigger Button */}
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={`#${modalId}`}
          ref={ref}
          style={{ display: 'none' }}
        >
          Launch demo modal
        </button>
      </>
    );
  });

export default UpdateConfirmationModal;