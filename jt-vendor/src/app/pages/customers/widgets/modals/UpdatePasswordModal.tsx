// src/components/advancedSettings/modals/UpdatePasswordModal.tsx

import React, { useState } from 'react'

interface UpdatePasswordModalProps {
  onSubmit: (data: { currentPassword: string; newPassword: string }) => void
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  // Toggle for password visibility
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      alert('New password and confirmation do not match!')
      return
    }
    onSubmit({ currentPassword, newPassword })
  }

  const toggleNewPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowNewPassword(!showNewPassword)
  }

  return (
    <div className="modal fade" id="kt_modal_update_password" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bold">Update Password</h2>
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
            <form id="kt_modal_update_password_form" className="form" onSubmit={handleSubmit}>
              {/* Current Password */}
              <div className="fv-row mb-10">
                <label className="required form-label fs-6 mb-2">Current Password</label>
                <input
                  className="form-control form-control-lg form-control-solid"
                  type="password"
                  placeholder=""
                  name="current_password"
                  autoComplete="off"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              {/* New Password */}
              <div className="mb-10 fv-row" data-kt-password-meter="true">
                <div className="mb-1">
                  <label className="form-label fw-semibold fs-6 mb-2">New Password</label>
                  <div className="position-relative mb-3">
                    <input
                      className="form-control form-control-lg form-control-solid"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder=""
                      name="new_password"
                      autoComplete="off"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <a
                      href="#"
                      className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
                      onClick={toggleNewPassword}
                    >
                      {showNewPassword ? (
                        <i className="ki-outline ki-eye fs-1"></i>
                      ) : (
                        <i className="ki-outline ki-eye-slash fs-1"></i>
                      )}
                    </a>
                  </div>
                  <div
                    className="d-flex align-items-center mb-3"
                    data-kt-password-meter-control="highlight"
                  >
                    <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                    <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                    <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                    <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
                  </div>
                </div>
                <div className="text-muted">
                  Use 8 or more characters with a mix of letters, numbers &amp; symbols.
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="fv-row mb-10">
                <label className="form-label fw-semibold fs-6 mb-2">Confirm New Password</label>
                <input
                  className="form-control form-control-lg form-control-solid"
                  type="password"
                  placeholder=""
                  name="confirm_password"
                  autoComplete="off"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>

              <div className="text-center pt-15">
                <a
                  href="#"
                  className="btn btn-light me-3"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Discard
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

export default UpdatePasswordModal
