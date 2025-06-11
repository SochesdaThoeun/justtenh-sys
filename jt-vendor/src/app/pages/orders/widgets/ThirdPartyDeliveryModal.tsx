import React, { forwardRef, useRef, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { KTIcon } from '../../../../_metronic/helpers'

type ThirdPartyDeliveryModalProps = {
  onSaveChanges: (deliveryServiceName: string, trackingId: string) => Promise<boolean>;
  modalId: string;
  isLoading?: boolean;
  isUpdate?: boolean;
  existingServiceName?: string;
  existingTrackingId?: string;
}

const ThirdPartyDeliveryModal = forwardRef<HTMLButtonElement, ThirdPartyDeliveryModalProps>(
  ({ onSaveChanges, modalId, isLoading = false, isUpdate = false, existingServiceName = '', existingTrackingId = '' }, ref) => {
    const [deliveryServiceName, setDeliveryServiceName] = useState<string>(existingServiceName)
    const [trackingId, setTrackingId] = useState<string>(existingTrackingId)
    const [errors, setErrors] = useState<{ deliveryServiceName?: string }>({})
    const cancelButtonRef = useRef<HTMLButtonElement>(null)

    // Update state when props change
    useEffect(() => {
      if (isUpdate) {
        setDeliveryServiceName(existingServiceName)
        setTrackingId(existingTrackingId)
      }
    }, [isUpdate, existingServiceName, existingTrackingId])

    const handleSubmit = async () => {
      // Reset errors
      setErrors({})

      // Validate
      if (!deliveryServiceName.trim()) {
        setErrors({ deliveryServiceName: 'Delivery service name is required' })
        return
      }

      try {
        const success = await onSaveChanges(deliveryServiceName, trackingId)
        if (success) {
          // Reset form and close modal on success
          setDeliveryServiceName('')
          setTrackingId('')
          cancelButtonRef.current?.click()
        }
      } catch (error: any) {
        console.error('Error in third party delivery assignment:', error)
        toast.error('Failed to assign third party delivery')
      }
    }

    return (
      <>
        {/* Modal */}
        <div className='modal fade' tabIndex={-1} id={modalId}>
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>
                  {isUpdate ? 'Update Third Party Delivery Details' : 'Third Party Delivery Details'}
                </h5>
                <div
                  className='btn btn-icon btn-sm btn-active-light-primary ms-2'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                >
                  <KTIcon iconName='cross' className='fs-2' />
                </div>
              </div>

              <div className='modal-body'>
                <div className='mb-5'>
                  <label className='form-label required'>Delivery Service Name</label>
                  <input
                    type='text'
                    className={`form-control ${errors.deliveryServiceName ? 'is-invalid' : ''}`}
                    placeholder='Enter delivery service name'
                    value={deliveryServiceName}
                    onChange={(e) => setDeliveryServiceName(e.target.value)}
                  />
                  {errors.deliveryServiceName && (
                    <div className='invalid-feedback'>{errors.deliveryServiceName}</div>
                  )}
                </div>

                <div className='mb-5'>
                  <label className='form-label'>Tracking ID (Optional)</label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Enter tracking ID'
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                  />
                </div>
              </div>

              <div className='modal-footer'>
                <button
                  type='button'
                  ref={cancelButtonRef}
                  className='btn btn-light'
                  data-bs-dismiss='modal'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  data-bs-dismiss='modal'
                  className='btn btn-primary'
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className='indicator-progress'>
                      Please wait... <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  ) : isUpdate ? 'Update Delivery Service' : 'Assign Delivery Service'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Trigger Button */}
        <button
          type='button'
          className='btn btn-primary'
          data-bs-toggle='modal'
          data-bs-target={`#${modalId}`}
          ref={ref}
          style={{ display: 'none' }}
        >
          Launch modal
        </button>
      </>
    )
  }
)

export default ThirdPartyDeliveryModal 