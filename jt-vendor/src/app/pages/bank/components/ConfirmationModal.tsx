import React, { forwardRef } from 'react'

interface ConfirmationModalProps {
  modalId: string
  onConfirm: () => void
  title: string
  body: string
}

/**
 * A generic confirmation modal.  We can use it for both "Update" or "Delete" confirmations by changing the props.
 */
const ConfirmationModal = forwardRef<HTMLButtonElement, ConfirmationModalProps>(
  ({ modalId, onConfirm, title, body }, ref) => {
    return (
      <>
        {/* begin::Modal */}
        <div className="modal fade" tabIndex={-1} id={modalId}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
              </div>
              <div className="modal-body">
                <p>{body}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={onConfirm}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* end::Modal */}

        {/* Hidden trigger button to open this modal programmatically */}
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={`#${modalId}`}
          ref={ref}
          style={{ display: 'none' }}
        >
          Launch hidden confirmation modal
        </button>
      </>
    )
  }
)

export default ConfirmationModal
