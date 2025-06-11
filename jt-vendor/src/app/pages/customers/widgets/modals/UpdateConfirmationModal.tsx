import React, { forwardRef } from "react";

interface UpdateConfirmationModalProps {
  onSaveChanges: () => void; // The function to call when user confirms
  modalId: string;           // The unique ID for this modal
  title?: string;            // Optionally override the title text
  bodyText?: string;         // Optionally override the body text
  confirmText?: string;      // Optionally override the confirm button text
}

const UpdateConfirmationModal = forwardRef<HTMLButtonElement, UpdateConfirmationModalProps>(
  (
    {
      onSaveChanges,
      modalId,
      title = "Are you sure you want to delete this?",
      bodyText = "You will not be able to revert this action.",
      confirmText = "Yes, delete",
    },
    ref
  ) => {
    return (
      <>
        {/* The Modal itself */}
        <div className="modal fade" tabIndex={-1} id={modalId} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                {/* If you want a close button here: */}
                {/* <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                /> */}
              </div>
              <div className="modal-body">
                <p>{bodyText}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={onSaveChanges}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* A hidden trigger button that can be clicked programmatically to open the modal */}
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={`#${modalId}`}
          ref={ref}
          style={{ display: "none" }}
        >
          Launch modal
        </button>
      </>
    );
  }
);

export default UpdateConfirmationModal;
