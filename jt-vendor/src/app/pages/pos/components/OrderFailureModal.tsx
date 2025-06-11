import React from 'react';

interface OrderFailureModalProps {
  isOpen: boolean;
  errorMessage: string | null;
  onClose: () => void;
}

const OrderFailureModal: React.FC<OrderFailureModalProps> = ({
  isOpen,
  errorMessage,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      tabIndex={-1}
      aria-hidden="true"
      role="dialog"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order Failed</h5>
            <div className="btn btn-icon btn-sm btn-active-light-primary ms-2" onClick={onClose}>
              <i className="ki-duotone ki-cross fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </div>
          </div>
          
          <div className="modal-body">
            <div className="d-flex flex-column align-items-center text-center py-10">
              <div className="symbol symbol-100px symbol-circle mb-7">
                <span className="symbol-label bg-danger">
                  <i className="ki-duotone ki-cross-circle fs-1 text-white">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </span>
              </div>
              
              <h3 className="mb-2">Order Failed</h3>
              
              <div className="text-danger mb-4">
                {errorMessage || "There was an error processing your order."}
              </div>
              
              <div className="text-gray-600 mb-8">
                Please check the information and try again.
              </div>
              
              <div className="d-flex">
                <button type="button" className="btn btn-primary" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFailureModal; 