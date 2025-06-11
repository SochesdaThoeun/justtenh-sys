// src/components/advancedSettings/modals/AddOneTimePasswordModal.tsx

import React, { useState } from 'react'

interface AddOneTimePasswordModalProps {
  emailValue: string
  onSubmit: (data: {
    mobileNumber: string
    email: string
    confirmPassword: string
  }) => void
}

const AddOneTimePasswordModal: React.FC<AddOneTimePasswordModalProps> = ({
  emailValue,
  onSubmit,
}) => {
  const [mobileNumber, setMobileNumber] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      mobileNumber,
      email: emailValue,
      confirmPassword,
    })
  }

  return (
    <div className="modal fade" id="kt_modal_add_one_time_password" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bold">Enable One Time Password</h2>
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
            <form className="form" id="kt_modal_add_one_time_password_form" onSubmit={handleSubmit}>
              <div className="fw-bold mb-9">
                Enter the new phone number to receive an SMS when you log in.
              </div>
              <div className="fv-row mb-7">
                <label className="fs-6 fw-semibold form-label mb-2">
                  <span className="required">Mobile number</span>
                  <span
                    className="ms-1"
                    data-bs-toggle="tooltip"
                    title="A valid mobile number is required to receive the one-time password."
                  >
                    <i className="ki-outline ki-information fs-7"></i>
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  name="otp_mobile_number"
                  placeholder="+6123 456 789"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>

              <div className="separator saperator-dashed my-5"></div>
              <div className="fv-row mb-7">
                <label className="fs-6 fw-semibold form-label mb-2">
                  <span className="required">Email</span>
                </label>
                <input
                  type="email"
                  className="form-control form-control-solid"
                  name="otp_email"
                  value={emailValue}
                  readOnly
                />
              </div>

              <div className="fv-row mb-7">
                <label className="fs-6 fw-semibold form-label mb-2">
                  <span className="required">Confirm password</span>
                </label>
                <input
                  type="password"
                  className="form-control form-control-solid"
                  name="otp_confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="text-center pt-15">
                <a
                  href="#"
                  className="btn btn-light me-3"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Cancel
                </a>
                <a
                  href="#"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleSubmit}
                >
                  <span className="indicator-label">Submit</span>
                  <span className="indicator-progress">
                    Please wait...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddOneTimePasswordModal
