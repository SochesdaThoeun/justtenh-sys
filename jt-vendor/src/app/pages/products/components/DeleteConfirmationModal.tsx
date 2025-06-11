import React from 'react';

interface DeleteConfirmationModalProps {
  productId: number;
  productName: string;
  onConfirmDelete: (id: number) => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  productId, 
  productName,
  onConfirmDelete
}) => {
  return (
    <div className="modal fade" id={`delete-product-modal-${productId}`} tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete <strong>{productName}</strong>?</p>
            <p className="text-danger">This action cannot be undone.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button 
              type="button" 
              className="btn btn-danger" 
              data-bs-dismiss="modal"
              onClick={() => onConfirmDelete(productId)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 