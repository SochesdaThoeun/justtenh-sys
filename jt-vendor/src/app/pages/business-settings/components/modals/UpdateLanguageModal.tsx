import React, { useState } from 'react'
import Select, { SingleValue } from 'react-select'

// Add type declaration for Bootstrap modal
declare global {
  interface Window {
    bootstrap: any;
  }
}

interface SelectOption {
  value: string;
  label: string;
}

interface UpdateLanguageModalProps {
  languageValue: string;
  onSubmit: (language: string) => void;
}

const UpdateLanguageModal: React.FC<UpdateLanguageModalProps> = ({
  languageValue,
  onSubmit
}) => {
  const languageOptions: SelectOption[] = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'id', label: 'Bahasa Indonesia' },
    { value: 'msa', label: 'Bahasa Melayu' }
  ];

  // Initialize selected language
  const [selectedLanguage, setSelectedLanguage] = useState<SelectOption | null>(
    languageOptions.find(option => option.value === languageValue) || languageOptions[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLanguage) {
      onSubmit(selectedLanguage.value);
      
      // Close modal programmatically
      const modalElement = document.getElementById('kt_modal_update_language');
      if (modalElement) {
        const bsModal = window.bootstrap.Modal.getInstance(modalElement);
        if (bsModal) {
          bsModal.hide();
        }
      }
    }
  };

  return (
    <div className="modal fade" id="kt_modal_update_language" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bold">Update Language</h2>
            <div className="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
              <i className="ki-outline ki-cross fs-1"></i>
            </div>
          </div>
          <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <form id="kt_modal_update_language_form" className="form" onSubmit={handleSubmit}>
              <div className="fv-row mb-7">
                <label className="fs-6 fw-semibold form-label mb-2">
                  <span className="required">Select Language</span>
                </label>
                <Select
                  className="react-select-styled react-select-solid"
                  classNamePrefix="react-select"
                  options={languageOptions}
                  value={selectedLanguage}
                  onChange={(option: SingleValue<SelectOption>) => 
                    setSelectedLanguage(option as SelectOption)
                  }
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

export default UpdateLanguageModal; 