import React, { useState, useEffect } from 'react';

// Add type declaration for Bootstrap modal
declare global {
  interface Window {
    bootstrap: any;
  }
}

interface VacationModeModalProps {
  isVacationMode: boolean;
  startDate: string | null;
  endDate: string | null;
  note: string | null;
  onConfirm: (data: {
    status: boolean;
    startDate: string;
    endDate: string;
    note: string;
  }) => void;
}

const VacationModeModal: React.FC<VacationModeModalProps> = ({
  isVacationMode,
  startDate,
  endDate,
  note,
  onConfirm
}) => {
  // Form state
  const [enabled, setEnabled] = useState(isVacationMode);
  const [vacationStartDate, setVacationStartDate] = useState(startDate || '');
  const [vacationEndDate, setVacationEndDate] = useState(endDate || '');
  const [vacationNote, setVacationNote] = useState(note || '');
  
  // Reset form values when props change
  useEffect(() => {
    setEnabled(isVacationMode);
    setVacationStartDate(startDate || '');
    setVacationEndDate(endDate || '');
    setVacationNote(note || '');
  }, [isVacationMode, startDate, endDate, note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields if enabled
    if (enabled) {
      if (!vacationStartDate || !vacationEndDate || !vacationNote.trim()) {
        // Show error - could use toast or form validation
        alert('Please fill in all required fields');
        return;
      }
    }
    
    onConfirm({
      status: enabled,
      startDate: vacationStartDate,
      endDate: vacationEndDate,
      note: vacationNote
    });
    
    // Close the modal
    const modalElement = document.getElementById('kt_modal_vacation_mode');
    if (modalElement) {
      const bsModal = window.bootstrap.Modal.getInstance(modalElement);
      if (bsModal) {
        bsModal.hide();
      }
    }
  };
  
  return (
    <div className="modal fade" id="kt_modal_vacation_mode" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bold">Configure Vacation Mode</h2>
            <div className="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
              <i className="ki-outline ki-cross fs-1"></i>
            </div>
          </div>
          <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <form id="kt_modal_vacation_mode_form" className="form" onSubmit={handleSubmit}>
              <div className="d-flex flex-column mb-8">
                <div className="form-check form-switch form-check-custom form-check-solid mb-5">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="vacationModeSwitch"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                  <label className="form-check-label fw-semibold text-gray-800 ms-3" htmlFor="vacationModeSwitch">
                    Enable Vacation Mode
                  </label>
                </div>
                <div className="text-muted fs-7">
                  Vacation mode will temporarily pause your shop's operations. Customers will be able to see your shop but won't be able to place orders.
                </div>
              </div>
              
              {enabled && (
                <>
                  <div className="row mb-6">
                    <div className="col-md-6 fv-row">
                      <label className="fs-6 fw-semibold form-label mb-2">
                        <span className="required">Start Date</span>
                      </label>
                      <input 
                        type="date" 
                        className="form-control form-control-solid" 
                        name="vacation_start_date"
                        value={vacationStartDate}
                        onChange={(e) => setVacationStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]} // Today or future dates only
                      />
                    </div>
                    <div className="col-md-6 fv-row">
                      <label className="fs-6 fw-semibold form-label mb-2">
                        <span className="required">End Date</span>
                      </label>
                      <input 
                        type="date" 
                        className="form-control form-control-solid" 
                        name="vacation_end_date"
                        value={vacationEndDate}
                        onChange={(e) => setVacationEndDate(e.target.value)}
                        min={vacationStartDate || new Date().toISOString().split('T')[0]} // Start date or today
                      />
                    </div>
                  </div>
                  
                  <div className="fv-row mb-8">
                    <label className="fs-6 fw-semibold form-label mb-2">
                      <span className="required">Vacation Note</span>
                    </label>
                    <textarea 
                      className="form-control form-control-solid" 
                      name="vacation_note"
                      rows={4}
                      placeholder="Explain to your customers why you're on vacation and when you'll be back..."
                      value={vacationNote}
                      onChange={(e) => setVacationNote(e.target.value)}
                    />
                  </div>
                </>
              )}
              
              <div className="text-center pt-15">
                <button type="button" className="btn btn-light me-3" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span className="indicator-label">Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacationModeModal; 