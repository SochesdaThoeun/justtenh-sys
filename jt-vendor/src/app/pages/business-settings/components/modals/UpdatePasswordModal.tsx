// src/components/advancedSettings/modals/UpdatePasswordModal.tsx

import React, { useState } from 'react'

// Add type declaration for Bootstrap modal
declare global {
  interface Window {
    bootstrap: any;
  }
}

interface UpdatePasswordModalProps {
  onSubmit: (data: { currentPassword: string; newPassword: string }) => void;
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validatePasswords = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return false;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePasswords()) {
      onSubmit({
        currentPassword,
        newPassword
      });
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Close modal programmatically
      const modalElement = document.getElementById('kt_modal_update_password');
      if (modalElement) {
        const bsModal = window.bootstrap.Modal.getInstance(modalElement);
        if (bsModal) {
          bsModal.hide();
        }
      }
    }
  };

  return (
    <div className="modal fade" id="kt_modal_update_password" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bold">Update Password</h2>
            <div className="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
              <i className="ki-outline ki-cross fs-1"></i>
            </div>
          </div>
          <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <form id="kt_modal_update_password_form" className="form" onSubmit={handleSubmit}>
              <div className="fv-row mb-7">
                <label className="fs-6 fw-semibold form-label mb-2">
                  <span className="required">Current Password</span>
                </label>
                <input 
                  type="password"
                  className="form-control form-control-solid" 
                  name="current_password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="fv-row mb-7">
                <label className="fs-6 fw-semibold form-label mb-2">
                  <span className="required">New Password</span>
                </label>
                <input 
                  type="password"
                  className="form-control form-control-solid" 
                  name="new_password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              
              <div className="fv-row mb-7">
                <label className="fs-6 fw-semibold form-label mb-2">
                  <span className="required">Confirm New Password</span>
                </label>
                <input 
                  type="password"
                  className="form-control form-control-solid" 
                  name="confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              {passwordError && (
                <div className="alert alert-danger" role="alert">
                  {passwordError}
                </div>
              )}
              
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

export default UpdatePasswordModal
