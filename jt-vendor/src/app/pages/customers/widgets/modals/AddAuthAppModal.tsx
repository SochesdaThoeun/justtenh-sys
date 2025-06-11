// src/components/advancedSettings/modals/AddAuthAppModal.tsx

import React, { useState } from 'react'

const AddAuthAppModal: React.FC = () => {
  const [qrVisible, setQrVisible] = useState(true)

  const toggleQR = (e: React.MouseEvent) => {
    e.preventDefault()
    setQrVisible(!qrVisible)
  }

  return (
    <div className="modal fade" id="kt_modal_add_auth_app" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bold">Add Authenticator App</h2>
            <a
              href="#"
              className="btn btn-icon btn-sm btn-active-icon-primary"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i className="ki-outline ki-cross fs-1"></i>
            </a>
          </div>
          <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <div className="fw-bold d-flex flex-column justify-content-center mb-5">
              <div
                className={`text-center mb-5 ${qrVisible ? '' : 'd-none'}`}
                data-kt-add-auth-action="qr-code-label"
              >
                Download the <a href="#">Authenticator app</a>, add a new account,
                then scan this barcode to set up your account.
              </div>
              <div
                className={`text-center mb-5 ${qrVisible ? 'd-none' : ''}`}
                data-kt-add-auth-action="text-code-label"
              >
                Download the <a href="#">Authenticator app</a>, add a new account,
                then enter this code to set up your account.
              </div>

              {/* QR CODE */}
              <div
                className={`d-flex flex-center ${qrVisible ? '' : 'd-none'}`}
                data-kt-add-auth-action="qr-code"
              >
                <img
                  src="../../../../public/media/misc/qr.png"
                  alt="Scan this QR code"
                  style={{ maxWidth: 200 }}
                />
              </div>

              {/* TEXT CODE */}
              <div
                className={`border rounded p-5 d-flex flex-center ${qrVisible ? 'd-none' : ''}`}
                data-kt-add-auth-action="text-code"
              >
                <div className="fs-1">gi2kdnb54is709j</div>
              </div>
            </div>

            {/* Toggle Buttons */}
            <div className="d-flex flex-center">
              <a
                href="#"
                className={`btn btn-light-primary ${qrVisible ? '' : 'd-none'}`}
                data-kt-add-auth-action="text-code-button"
                onClick={toggleQR}
              >
                Enter code manually
              </a>
              <a
                href="#"
                className={`btn btn-light-primary ${qrVisible ? 'd-none' : ''}`}
                data-kt-add-auth-action="qr-code-button"
                onClick={toggleQR}
              >
                Scan barcode instead
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddAuthAppModal
