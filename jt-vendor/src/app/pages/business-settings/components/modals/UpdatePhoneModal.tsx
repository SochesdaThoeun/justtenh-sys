// src/components/advancedSettings/modals/UpdatePhoneModal.tsx

import React, { useState } from 'react'

// Add type declaration for Bootstrap modal
declare global {
  interface Window {
    bootstrap: any;
  }
}

interface UpdatePhoneModalProps {
  phoneValue: string;
  onSubmit: (phone: string) => void;
}

const UpdatePhoneModal: React.FC<UpdatePhoneModalProps> = ({ phoneValue, onSubmit }) => {
  const [phone, setPhone] = useState(phoneValue || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(phone);
    
    // Close modal programmatically
    const modalElement = document.getElementById('kt_modal_update_phone');
    if (modalElement) {
      const bsModal = window.bootstrap.Modal.getInstance(modalElement);
      if (bsModal) {
        bsModal.hide();
      }
    }
  };

  return (
    <div className="modal fade" id="kt_modal_update_phone" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h2 className="fw-bold">Update Phone Number</h2>
            <div className="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
              <i className="ki-outline ki-cross fs-1"></i>
            </div>
          </div>
          {/* Modal Body */}
          <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <form id="kt_modal_update_phone_form" className="form" onSubmit={handleSubmit}>
              <div className="notice d-flex bg-light-primary rounded border-primary border border-dashed mb-9 p-6">
                <i className="ki-outline ki-information fs-2tx text-primary me-4"></i>
                <div className="d-flex flex-stack flex-grow-1">
                  <div className="fw-semibold">
                    <div className="fs-6 text-gray-700">
                      Please note that a valid phone number may be required for order or shipping rescheduling.
                    </div>
                  </div>
                </div>
              </div>

              <div className="fv-row mb-7">
                <label className="fs-6 fw-semibold form-label mb-2">
                  <span className="required">Phone Number</span>
                </label>
                <input
                  className="form-control form-control-solid"
                  placeholder="Enter phone number"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="text-center pt-15">
                <button type="button" className="btn btn-light me-3" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span className="indicator-label">Submit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdatePhoneModal
