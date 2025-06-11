import React, { useEffect, useState, FormEvent } from 'react'

type CardModalProps = {
  modalId: string
  onCreate: (newCard: any) => void
  onEdit: (updatedCard: any) => void
  isEdit?: boolean
  initialCardData?: any  // If editing, pass existing data here
}

const CardModal: React.FC<CardModalProps> = ({
  modalId,
  onCreate,
  onEdit,
  isEdit = false,
  initialCardData,
}) => {
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cvv, setCvv] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [saveCard, setSaveCard] = useState(true)

  // On mount or when initialCardData changes, pre-fill the form fields if in edit mode
  useEffect(() => {
    if (isEdit && initialCardData) {
      setCardName(initialCardData.details?.name || '')
      setCardNumber(initialCardData.details?.number?.replace(/\*+ /, '') || '') 
      // (Example: might parse out the masked "**** 9060" if you want)
      setCvv('') // Typically we never store real CVV, but set blank or handle differently
      const exp = initialCardData.expires || '12/2024' // "MM/YYYY"
      const [mm, yyyy] = exp.split('/')
      setExpiryMonth(mm || '')
      setExpiryYear(yyyy || '')
      // saveCard might be read from data or not
    }
  }, [isEdit, initialCardData])

  const handleDiscard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // If you have data-bs-dismiss on the button, it will close automatically.
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Build card object
    const cardData = {
      // If editing, keep the original id; if new, create a new one
      id: isEdit && initialCardData ? initialCardData.id : Date.now(),
      type: 'card',
      logo: '../../../../public/media/svg/card-logos/visa.svg',
      name: 'Visa', // or logic to detect from cardNumber
      isPrimary: isEdit ? initialCardData?.isPrimary ?? false : false,
      expires: `${expiryMonth}/${expiryYear}`,
      details: {
        name: cardName,
        number: `**** ${cardNumber.slice(-4)}`, // masked, or however you like
        expires: `${expiryMonth}/${expiryYear}`,
        type: 'Visa credit card', 
        issuer: 'CustomBank',
        id: isEdit && initialCardData ? initialCardData.details.id : `id_${Date.now()}`,
        billingAddress: isEdit ? initialCardData?.details?.billingAddress || '' : '',
        phone: isEdit ? initialCardData?.details?.phone || '' : '',
        email: isEdit ? initialCardData?.details?.email || '' : '',
        origin: isEdit ? initialCardData?.details?.origin || '' : '',
        cvcCheck: 'Passed',
      },
    }

    if (isEdit) {
      onEdit(cardData)
    } else {
      onCreate(cardData)
    }
  }

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{isEdit ? 'Edit Card' : 'Add New Card'}</h2>
            <div
              className="btn btn-sm btn-icon btn-active-color-primary"
              data-bs-dismiss="modal"
            >
              <i className="ki-duotone ki-cross fs-1">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </div>
          </div>

          <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <form
              id="kt_modal_card_form"
              className="form"
              onSubmit={handleSubmit}
            >
              {/* Name on Card */}
              <div className="d-flex flex-column mb-7 fv-row">
                <label className="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                  <span className="required">Name On Card</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Card holder name"
                  name="card_name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>

              {/* Card Number */}
              <div className="d-flex flex-column mb-7 fv-row">
                <label className="required fs-6 fw-semibold form-label mb-2">
                  Card Number
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="Enter card number"
                    name="card_number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                  <div className="position-absolute translate-middle-y top-50 end-0 me-5">
                    <img
                      src="../../../../public/media/svg/card-logos/visa.svg"
                      alt=""
                      className="h-25px me-1"
                    />
                    <img
                      src="../../../../public/media/svg/card-logos/mastercard.svg"
                      alt=""
                      className="h-25px me-1"
                    />
                  </div>
                </div>
              </div>

              {/* Expiration & CVV */}
              <div className="row mb-10">
                <div className="col-md-8 fv-row">
                  <label className="required fs-6 fw-semibold form-label mb-2">
                    Expiration Date
                  </label>
                  <div className="row fv-row">
                    <div className="col-6">
                      <select
                        className="form-select form-select-solid"
                        value={expiryMonth}
                        onChange={(e) => setExpiryMonth(e.target.value)}
                        required
                      >
                        <option value="">Month</option>
                        <option value="01">1</option>
                        <option value="02">2</option>
                        <option value="03">3</option>
                        <option value="04">4</option>
                        <option value="05">5</option>
                        <option value="06">6</option>
                        <option value="07">7</option>
                        <option value="08">8</option>
                        <option value="09">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <select
                        className="form-select form-select-solid"
                        value={expiryYear}
                        onChange={(e) => setExpiryYear(e.target.value)}
                        required
                      >
                        <option value="">Year</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 fv-row">
                  <label className="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                    <span className="required">CVV</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      minLength={3}
                      maxLength={4}
                      placeholder="CVV"
                      name="card_cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Save Card */}
              {!isEdit && (
                <div className="d-flex flex-stack">
                  <div className="me-5">
                    <label className="fs-6 fw-semibold form-label">
                      Save Card for further billing?
                    </label>
                    <div className="fs-7 fw-semibold text-muted">
                      If you need more info, please check budget planning
                    </div>
                  </div>
                  <label className="form-check form-switch form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={saveCard}
                      onChange={() => setSaveCard(!saveCard)}
                    />
                    <span className="form-check-label fw-semibold text-muted">
                      Save Card
                    </span>
                  </label>
                </div>
              )}

              {/* Actions */}
              <div className="text-center pt-15">
                <button
                  type="button"
                  className="btn btn-light me-3"
                  data-bs-dismiss="modal"
                  onClick={handleDiscard}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  {isEdit ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardModal
