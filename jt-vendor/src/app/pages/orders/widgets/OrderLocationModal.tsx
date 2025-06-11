import { forwardRef, useEffect, useRef, useState } from "react";
import { StepperComponent } from "../../../../_metronic/assets/ts/components";

interface OrderLocationModalProps {
    onSaveChanges: () => void; // Function takes no arguments
    modalId: string;
    stepsData: string[];
    currentStep: number;
}

const OrderLocationModal = forwardRef<HTMLButtonElement, OrderLocationModalProps>(
    ({ onSaveChanges, modalId, stepsData, currentStep }, ref) => {

  const stepperRef = useRef<HTMLDivElement | null>(null)
  const [stepper, setStepper] = useState<StepperComponent | null>(null)

  // Initialize stepper
  useEffect(() => {
    if (stepperRef.current) {
      setStepper(StepperComponent.createInsance(stepperRef.current as HTMLDivElement))
    }
  }, [stepperRef])

  // Define your step titles in order
  const steps = [
    {title: 'Order placed', desc: stepsData[0] || ''},
    {title: 'Order confirmed', desc: stepsData[1] || ''},
    {title: 'Preparing shipment', desc: stepsData[2] || ''},
    {title: 'Order is on the way', desc: stepsData[3] || ''},
    {title: 'Order Shipped', desc: stepsData[4] || ''},
  ]

    return (
      <>
        {/* Modal */}
        <div className="modal fade" tabIndex={-1} id={modalId}>
          <div className="modal-dialog min-w-900px" bs-modal-width="1000px">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Location Data</h5>
              </div>
              <div className="modal-body">
              <div
                  ref={stepperRef}
                  className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
                  id='kt_order_location_stepper'
                >
                  {/* Begin::Steps Section */}
                  <div className='card d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px w-xxl-400px me-9'>
                    <div className='card-body px-6 px-lg-10 px-xxl-15 py-20'>
                      <div className='stepper-nav'>
                        {steps.map((step, index) => {
                          // If the current step matches this index (1-based), set it to 'current'
                          const isActive = currentStep === index + 1 ? 'current' : ''
                          return (
                            <div
                              key={index}
                              className={`stepper-item ${isActive}`}
                              data-kt-stepper-element='nav'
                            >
                              {/* Begin::Wrapper */}
                              <div className='stepper-wrapper'>
                                {/* Begin::Icon */}
                                <div className='stepper-icon w-40px h-40px'>
                                  <i className='stepper-check fas fa-check'></i>
                                  <span className='stepper-number'>{index + 1}</span>
                                </div>
                                {/* End::Icon */}

                                {/* Begin::Label */}
                                <div className='stepper-label'>
                                  <h3 className='stepper-title'>{step.title}</h3>
                                  <div className='stepper-desc fw-semibold'>{step.desc}</div>
                                </div>
                                {/* End::Label */}
                              </div>
                              {/* End::Wrapper */}

                              {/* Stepper line for all but the last item */}
                              {index + 1 < steps.length && <div className='stepper-line h-40px'></div>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  {/* End::Steps Section */}

                  {/* Begin::Map Section */}
                  <div className='d-flex flex-row-fluid flex-center bg-body rounded'>
                    {/* Replace this div with your Google Map embedding */}
                    <div
                      className='w-100 w-xl-700px px-9 py-20'
                      style={{height: '500px', backgroundColor: '#eaeaea'}}
                    >
                      {/* Google Map goes here */}
                    </div>
                  </div>
                  {/* End::Map Section */}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                
              </div>
            </div>
          </div>
        </div>
  
        {/* Hidden Trigger Button */}
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={`#${modalId}`}
          ref={ref}
          style={{ display: 'none' }}
        >
          Launch demo modal
        </button>
      </>
    );
  });

export default OrderLocationModal;