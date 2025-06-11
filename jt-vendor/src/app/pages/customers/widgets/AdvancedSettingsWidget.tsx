// src/components/advancedSettings/AdvancedSettingsWidget.tsx

import React, { useState } from 'react'
import { PaymentMethod } from './types'

import UpdatePhoneModal from './modals/UpdatePhoneModal'
import UpdatePasswordModal from './modals/UpdatePasswordModal'
import AddAuthAppModal from './modals/AddAuthAppModal'
import AddOneTimePasswordModal from './modals/AddOneTimePasswordModal'
import NewCardModal from './modals/NewCardModal'
import PaymentMethods from './PaymentMethods'

const AdvancedSettingsWidget: React.FC = () => {
  const [phone, setPhone] = useState('+6141 234 567')
  const [email, setEmail] = useState('smith@kpmg.com')
  const [editingCard, setEditingCard] = useState<PaymentMethod | undefined>(undefined)

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      brand: 'mastercard',
      name: 'Emma Smith',
      number: '**** 4464',
      expires: '12/2024',
      isPrimary: true,
      isExpired: false,
      issuer: 'VICBANK',
      type: 'Mastercard credit card',
      billingAddress: 'AU',
      phone: 'No phone provided',
      email: 'smith@kpmg.com',
      origin: 'Australia',
      cvcCheck: 'passed',
    },
    {
      id: '2',
      brand: 'visa',
      name: 'Melody Macy',
      number: '**** 2925',
      expires: '02/2022',
      isPrimary: false,
      isExpired: false,
      issuer: 'ENBANK',
      type: 'Visa credit card',
      billingAddress: 'UK',
      phone: 'No phone provided',
      email: 'melody@altbox.com',
      origin: 'United Kingdom',
      cvcCheck: 'passed',
    },
    {
      id: '3',
      brand: 'amex',
      name: 'Max Smith',
      number: '**** 3183',
      expires: '08/2021',
      isPrimary: false,
      isExpired: true,
      issuer: 'USABANK',
      type: 'American express credit card',
      billingAddress: 'US',
      phone: 'No phone provided',
      email: 'max@kt.com',
      origin: 'United States of America',
      cvcCheck: 'failed',
    },
  ])

  /* ------------------ Handlers for each modal submission ------------------ */
  const handlePhoneUpdate = (updatedPhone: string) => {
    setPhone(updatedPhone)
  }

  const handlePasswordUpdate = (data: { currentPassword: string; newPassword: string }) => {
    //console.log('Password updated:', data)
    // Perform API calls or additional logic here
  }

  const handleOneTimePassword = (data: { mobileNumber: string; email: string; confirmPassword: string }) => {
    //console.log('One-time password data:', data)
  }

  const handleNewCardSubmit = (data: {
    id?: string
    brand: 'visa' | 'mastercard' | 'amex'
    cardName: string
    cardNumber: string
    cardExpiryMonth: string
    cardExpiryYear: string
    cardCvv: string
    saveCard: boolean
  }) => {
    const expires = `${data.cardExpiryMonth}/${data.cardExpiryYear}`

    if (data.id) {
      // Update existing card
      setPaymentMethods((prev) =>
        prev.map((pm) =>
          pm.id === data.id
            ? {
                ...pm,
                brand: data.brand,
                name: data.cardName,
                number: data.cardNumber,
                expires,
                isExpired: false, // or do some check if date < today
              }
            : pm
        )
      )
    } else {
      // Add new card
      const newId = `${Math.floor(Math.random() * 100000)}`
      const newCard: PaymentMethod = {
        id: newId,
        brand: data.brand,
        name: data.cardName,
        number: data.cardNumber,
        expires,
        isPrimary: false,
        isExpired: false,
        issuer: 'MyBank',
        type:
          data.brand === 'amex'
            ? 'American express credit card'
            : data.brand === 'visa'
            ? 'Visa credit card'
            : 'Mastercard credit card',
        billingAddress: 'N/A',
        phone: '',
        email: '',
        origin: '',
        cvcCheck: 'passed',
      }
      setPaymentMethods((prev) => [...prev, newCard])
    }
    setEditingCard(undefined)
  }

  // Payment Method actions
  const handleEditCard = (pm: PaymentMethod) => {
    setEditingCard(pm)
  }

  const handleDeleteCard = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id))
  }

  const handleSetAsPrimary = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isPrimary: pm.id === id,
      }))
    )
  }

  return (
    <div className="tab-pane fade show" id="kt_ecommerce_customer_advanced" role="tabpanel">
      {/* Security Details */}
      <div className="card pt-4 mb-6 mb-xl-9">
        <div className="card-header border-0">
          <div className="card-title">
            <h2>Security Details</h2>
          </div>
        </div>
        <div className="card-body pt-0 pb-5">
          <div className="table-responsive">
            <table className="table align-middle table-row-dashed gy-5" id="kt_table_users_login_session">
              <tbody className="fs-6 fw-semibold text-gray-600">
                <tr>
                  <td>Phone</td>
                  <td>{phone}</td>
                  <td className="text-end">
                    <a
                      href="#"
                      className="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_update_phone"
                    >
                      <i className="ki-outline ki-pencil fs-3"></i>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Password</td>
                  <td>******</td>
                  <td className="text-end">
                    <a
                      href="#"
                      className="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_update_password"
                    >
                      <i className="ki-outline ki-pencil fs-3"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Two Step Auth */}
      <div className="card pt-4 mb-6 mb-xl-9">
        <div className="card-header border-0">
          <div className="card-title flex-column">
            <h2 className="mb-1">Two Step Authentication</h2>
            <div className="fs-6 fw-semibold text-muted">
              Keep your account extra secure with a second authentication step.
            </div>
          </div>
          <div className="card-toolbar">
            <a
              href="#"
              className="btn btn-light-primary btn-sm"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
            >
              <i className="ki-outline ki-fingerprint-scanning fs-3"></i>Add Authentication Step
            </a>
            <div
              className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-6 w-200px py-4"
              data-kt-menu="true"
            >
              <div className="menu-item px-3">
                <a
                  href="#"
                  className="menu-link px-3"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_add_auth_app"
                >
                  Use authenticator app
                </a>
              </div>
              <div className="menu-item px-3">
                <a
                  href="#"
                  className="menu-link px-3"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_add_one_time_password"
                >
                  Enable one-time password
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body pb-5">
          <div className="d-flex flex-stack">
            <div className="d-flex flex-column">
              <span>SMS</span>
              <span className="text-muted fs-6">{phone}</span>
            </div>
            <div className="d-flex justify-content-end align-items-center">
              <a
                href="#"
                className="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto me-5"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_add_one_time_password"
              >
                <i className="ki-outline ki-pencil fs-3"></i>
              </a>
              <a
                href="#"
                className="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                id="kt_users_delete_two_step"
              >
                <i className="ki-outline ki-trash fs-3"></i>
              </a>
            </div>
          </div>
          <div className="separator separator-dashed my-5"></div>
          <div className="text-gray-600">
            If you lose your mobile device or security key, you can
            <a href="#" className="me-1">
              generate a backup code
            </a>
            to sign in to your account.
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="card pt-4 mb-6 mb-xl-9">
        <div className="card-header border-0">
          <div className="card-title">
            <h2 className="fw-bold mb-0">Payment Methods</h2>
          </div>
          <div className="card-toolbar">
            <a
              href="#"
              className="btn btn-sm btn-flex btn-light-primary"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_new_card"
              onClick={() => setEditingCard(undefined)}
            >
              <i className="ki-outline ki-plus-square fs-3"></i>Add new method
            </a>
          </div>
        </div>
        <div id="kt_customer_view_payment_method" className="card-body pt-0">
          <PaymentMethods
            paymentMethods={paymentMethods}
            onEdit={handleEditCard}
            onDelete={handleDeleteCard}
            onSetAsPrimary={handleSetAsPrimary}
          />
        </div>
      </div>

      {/* Mounted Modals (Bootstrap native) */}
      <UpdatePhoneModal phoneValue={phone} onSubmit={handlePhoneUpdate} />
      <UpdatePasswordModal onSubmit={handlePasswordUpdate} />
      <AddAuthAppModal />
      <AddOneTimePasswordModal emailValue={email} onSubmit={handleOneTimePassword} />
      <NewCardModal editingCard={editingCard} onSubmit={handleNewCardSubmit} />
    </div>
  )
}

export default AdvancedSettingsWidget
