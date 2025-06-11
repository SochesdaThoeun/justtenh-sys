import React from 'react';
import { printBarcode } from '../utils/product.utils';

interface BarcodeModalProps {
  productId: number;
  productName: string;
  barcode: string;
}

export const BarcodeModal: React.FC<BarcodeModalProps> = ({ 
  productId, 
  productName, 
  barcode 
}) => {
  return (
    <div className="modal fade" id={`barcode-modal-${productId}`} tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Product Barcode</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="d-flex flex-column align-items-center">
              <h4 className="mb-3">{productName}</h4>
              <div id={`barcode-image-${productId}`} className="text-center mb-3">
                {/* Barcode image - using a simple placeholder for now */}
                {barcode ? (
                  <img 
                    src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${barcode}&scale=3&includetext&textsize=13`} 
                    alt={`Barcode for ${productName}`} 
                    className="img-fluid"
                  />
                ) : (
                  <div className="alert alert-warning">No barcode available</div>
                )}
              </div>
              <div className="fs-6 text-gray-600 mb-4">Code: {barcode || 'N/A'}</div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => printBarcode(`barcode-image-${productId}`)}
            >
              <i className="ki-outline ki-printer fs-2 me-1"></i>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 