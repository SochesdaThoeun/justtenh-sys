// src/components/advancedSettings/modals/NewCardModal.tsx

import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { PaymentMethod } from '../types'

// For card brand selection
const brandOptions = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'American Express' },
]

// For expiration months
const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const value = (i + 1).toString()
  return { value, label: value }
})

// For expiration years
const yearOptions = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  // ... extend as needed
  { value: '2030', label: '2030' },
  { value: '2031', label: '2031' },
  { value: '2032', label: '2032' },
]

interface NewCardModalProps {
  editingCard?: PaymentMethod
  onSubmit: (data: {
    id?: string
    brand: 'visa' | 'mastercard' | 'amex'
    cardName: string
    cardNumber: string
    cardExpiryMonth: string
    cardExpiryYear: string
    cardCvv: string
    saveCard: boolean
  }) => void
}

const NewCardModal: React.FC<NewCardModalProps> = ({ editingCard, onSubmit }) => {
  const [brand, setBrand] = useState<'visa' | 'mastercard' | 'amex'>('visa')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiryMonth, setCardExpiryMonth] = useState('')
  const [cardExpiryYear, setCardExpiryYear] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [saveCard, setSaveCard] = useState(true)

  // Initialize form if editing an existing card
  useEffect(() => {
    if (editingCard) {
      setBrand(editingCard.brand)
      setCardName(editingCard.name)
      setCardNumber(editingCard.number.replace(/\*/g, '')) // possibly remove asterisks
      const [month, year] = editingCard.expires.split('/')
      setCardExpiryMonth(month)
      setCardExpiryYear(year)
      setCardCvv('')
    } else {
      // new card
      setBrand('visa')
      setCardName('')
      setCardNumber('')
      setCardExpiryMonth('')
      setCardExpiryYear('')
      setCardCvv('')
    }
  }, [editingCard])

  // Adjust CVV length based on brand
  const cvvMaxLength = brand === 'amex' ? 4 : 3

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: editingCard?.id,
      brand,
      cardName,
      cardNumber,
      cardExpiryMonth,
      cardExpiryYear,
      cardCvv,
      saveCard,
    })
  }

  return (
    <div className="modal fade" id="kt_modal_new_card" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{editingCard ? 'Edit Card' : 'Add New Card'}</h2>
            <a
              href="#"
              className="btn btn-sm btn-icon btn-active-color-primary"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i className="ki-outline ki-cross fs-1"></i>
            </a>
          </div>
          <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <form id="kt_modal_new_card_form" className="form" onSubmit={handleSubmit}>
              {/* Brand */}
              <div className="d-flex flex-column mb-7 fv-row">
                <label className="fs-6 fw-semibold form-label mb-2">
                  <span className="required">Card Brand</span>
                </label>
                <Select
                  className="react-select-styled react-select-solid"
                  classNamePrefix="react-select"
                  placeholder="Select brand"
                  value={brandOptions.find((b) => b.value === brand) || null}
                  onChange={(selected) =>
                    setBrand(selected ? (selected.value as 'visa' | 'mastercard' | 'amex') : 'visa')
                  }
                  options={brandOptions}
                  isClearable={false}
                />
              </div>

              {/* Name On Card */}
              <div className="d-flex flex-column mb-7 fv-row">
                <label className="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                  <span className="required">Name On Card</span>
                  <span className="ms-1" data-bs-toggle="tooltip" title="Specify a card holder's name">
                    <i className="ki-outline ki-information-5 text-gray-500 fs-6"></i>
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder=""
                  name="card_name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              {/* Card Number */}
              <div className="d-flex flex-column mb-7 fv-row">
                <label className="required fs-6 fw-semibold form-label mb-2">Card Number</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="Enter card number"
                    name="card_number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  {/* Brand logos */}
                  <div className="position-absolute translate-middle-y top-50 end-0 me-5">
                    <img
                      src="../../../../public/media/svg/card-logos/visa.svg"
                      alt=""
                      className="h-25px"
                      style={{ display: brand === 'visa' ? 'inline-block' : 'none' }}
                    />
                    <img
                      src="../../../../public/media/svg/card-logos/mastercard.svg"
                      alt=""
                      className="h-25px ms-2"
                      style={{ display: brand === 'mastercard' ? 'inline-block' : 'none' }}
                    />
                    <img
                      src="../../../../public/media/svg/card-logos/american-express.svg"
                      alt=""
                      className="h-25px ms-2"
                      style={{ display: brand === 'amex' ? 'inline-block' : 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Expiration / CVV */}
              <div className="row mb-10">
                <div className="col-md-8 fv-row">
                  <label className="required fs-6 fw-semibold form-label mb-2">
                    Expiration Date
                  </label>
                  <div className="row fv-row">
                    <div className="col-6">
                      <Select
                        className="react-select-styled react-select-solid"
                        classNamePrefix="react-select"
                        placeholder="Month"
                        value={monthOptions.find((m) => m.value === cardExpiryMonth) || null}
                        onChange={(selected) => setCardExpiryMonth(selected ? selected.value : '')}
                        options={monthOptions}
                        isClearable={false}
                      />
                    </div>
                    <div className="col-6">
                      <Select
                        className="react-select-styled react-select-solid"
                        classNamePrefix="react-select"
                        placeholder="Year"
                        value={yearOptions.find((y) => y.value === cardExpiryYear) || null}
                        onChange={(selected) => setCardExpiryYear(selected ? selected.value : '')}
                        options={yearOptions}
                        isClearable={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4 fv-row">
                  <label className="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                    <span className="required">CVV</span>
                    <span className="ms-1" data-bs-toggle="tooltip" title="Enter a card CVV code">
                      <i className="ki-outline ki-information-5 text-gray-500 fs-6"></i>
                    </span>
                  </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      maxLength={cvvMaxLength}
                      placeholder="CVV"
                      name="card_cvv"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                    <div className="position-absolute translate-middle-y top-50 end-0 me-3">
                      <i className="ki-outline ki-credit-cart fs-2hx"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Card */}
              <div className="d-flex flex-stack">
                <div className="me-5">
                  <label className="fs-6 fw-semibold form-label">Save Card for further billing?</label>
                  <div className="fs-7 fw-semibold text-muted">
                    If you need more info, please check budget planning
                  </div>
                </div>
                <label className="form-check form-switch form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                  />
                  <span className="form-check-label fw-semibold text-muted">Save Card</span>
                </label>
              </div>

              <div className="text-center pt-15">
                <a
                  href="#"
                  id="kt_modal_new_card_cancel"
                  className="btn btn-light me-3"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Discard
                </a>
                <a
                  href="#"
                  id="kt_modal_new_card_submit"
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

export default NewCardModal
