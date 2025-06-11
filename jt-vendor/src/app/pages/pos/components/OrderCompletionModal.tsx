import React from 'react';

interface OrderCompletionModalProps {
  isOpen: boolean;
  orderId: number | null;
  onClose: () => void;
}

const OrderCompletionModal: React.FC<OrderCompletionModalProps> = ({
  isOpen,
  orderId,
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
            <h5 className="modal-title">Order Completed</h5>
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
                <span className="symbol-label bg-success">
                  <i className="ki-duotone ki-check fs-1 text-white">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </span>
              </div>
              
              <h3 className="mb-2">Order Placed Successfully!</h3>
              
              {orderId && (
                <div className="mb-9">
                  <div className="fw-semibold fs-6 mb-2">Order Number:</div>
                  <span className="fw-bold fs-2x text-success">{orderId}</span>
                </div>
              )}
              
              <div className="text-gray-600 mb-8">
                Your order has been processed and will be ready for pickup shortly.
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

export default OrderCompletionModal; 