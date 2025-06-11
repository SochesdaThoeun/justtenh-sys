// src/components/advancedSettings/PaymentMethods.tsx

import React, { useRef, useState } from 'react'
import { PaymentMethod } from './types'
import UpdateConfirmationModal from './modals/UpdateConfirmationModal' // <--- Import your modal

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[]
  onEdit: (pm: PaymentMethod) => void
  onDelete: (id: string) => void
  onSetAsPrimary: (id: string) => void
}

/**
 * Example utility for brand logos
 */
const getBrandLogo = (brand: 'visa' | 'mastercard' | 'amex') => {
  switch (brand) {
    case 'visa':
      return '../../../../public/media/svg/card-logos/visa.svg'
    case 'mastercard':
      return '../../../../public/media/svg/card-logos/mastercard.svg'
    case 'amex':
      return '../../../../public/media/svg/card-logos/american-express.svg'
  }
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  paymentMethods,
  onEdit,
  onDelete,
  onSetAsPrimary,
}) => {
  // Local state to track which payment method is about to be deleted
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  // Ref to trigger the UpdateConfirmationModal programmatically
  const deleteModalRef = useRef<HTMLButtonElement>(null)

  // Called when the user clicks the Delete button for a given payment method
  const handleDeleteClick = (id: string) => {
    setIdToDelete(id)
    // Programmatically open the modal
    deleteModalRef.current?.click()
  }

  // Called when the user confirms the deletion in the modal
  const confirmDelete = () => {
    if (idToDelete) {
      onDelete(idToDelete)
      setIdToDelete(null)
    }
  }

  const getExtraBadge = (pm: PaymentMethod) => {
    if (pm.isExpired) {
      return <div className="badge badge-light-danger ms-5">Expired</div>
    }
    if (pm.isPrimary) {
      return <div className="badge badge-light-primary ms-5">Primary</div>
    }
    return null
  }

  return (
    <>
      {/* Main content for Payment Methods */}
      <div className="accordion accordion-icon-toggle" id="kt_customer_view_payment_method_accordion">
        {paymentMethods.map((pm) => (
          <div className="py-0" data-kt-customer-payment-method="row" key={pm.id}>
            <div className="py-3 d-flex flex-stack flex-wrap">
              <a
                className="accordion-header d-flex align-items-center"
                data-bs-toggle="collapse"
                href={`#kt_customer_view_payment_method_${pm.id}`}
                role="button"
                aria-expanded="false"
                aria-controls={`kt_customer_view_payment_method_${pm.id}`}
              >
                <div className="accordion-icon me-2">
                  <i className="ki-outline ki-right fs-4"></i>
                </div>
                <img src={getBrandLogo(pm.brand)} className="w-40px me-3" alt="" />
                <div className="me-3">
                  <div className="d-flex align-items-center">
                    <div className="text-gray-800 fw-bold">
                      {pm.brand === 'amex'
                        ? 'American Express'
                        : pm.brand === 'visa'
                        ? 'Visa'
                        : 'Mastercard'}
                    </div>
                    {getExtraBadge(pm)}
                  </div>
                  <div className="text-muted">Expires {pm.expires}</div>
                </div>
              </a>
              <div className="d-flex my-3 ms-9">
                {/* Edit Button */}
                <a
                  href="#"
                  className="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_new_card"
                  onClick={() => onEdit(pm)}
                >
                  <span data-bs-toggle="tooltip" data-bs-trigger="hover" title="Edit">
                    <i className="ki-outline ki-pencil fs-3"></i>
                  </span>
                </a>
                {/* Delete Button */}
                <a
                  href="#"
                  className="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
                  data-bs-toggle="tooltip"
                  title="Delete"
                  // Instead of calling onDelete directly, we show the modal
                  onClick={() => handleDeleteClick(pm.id)}
                >
                  <i className="ki-outline ki-trash fs-3"></i>
                </a>
                {/* More Options => Set as Primary */}
                <a
                  href="#"
                  className="btn btn-icon btn-active-light-primary w-30px h-30px"
                  data-bs-toggle="tooltip"
                  title="More Options"
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end"
                >
                  <i className="ki-outline ki-setting-3 fs-3"></i>
                </a>
                <div
                  className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold w-150px py-3"
                  data-kt-menu="true"
                >
                  <div className="menu-item px-3">
                    <a
                      href="#"
                      className="menu-link px-3"
                      data-kt-payment-mehtod-action="set_as_primary"
                      onClick={() => onSetAsPrimary(pm.id)}
                    >
                      Set as Primary
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              id={`kt_customer_view_payment_method_${pm.id}`}
              className="collapse fs-6 ps-10"
              data-bs-parent="#kt_customer_view_payment_method_accordion"
            >
              {/* Payment Method Details */}
              <div className="d-flex flex-wrap py-5">
                <div className="flex-equal me-5">
                  <table className="table table-flush fw-semibold gy-1">
                    <tbody>
                      <tr>
                        <td className="text-muted min-w-125px w-125px">Name</td>
                        <td className="text-gray-800">{pm.name}</td>
                      </tr>
                      <tr>
                        <td className="text-muted min-w-125px w-125px">Number</td>
                        <td className="text-gray-800">{pm.number}</td>
                      </tr>
                      <tr>
                        <td className="text-muted min-w-125px w-125px">Expires</td>
                        <td className="text-gray-800">{pm.expires}</td>
                      </tr>
                      <tr>
                        <td className="text-muted min-w-125px w-125px">Type</td>
                        <td className="text-gray-800">{pm.type}</td>
                      </tr>
                      <tr>
                        <td className="text-muted min-w-125px w-125px">Issuer</td>
                        <td className="text-gray-800">{pm.issuer}</td>
                      </tr>
                      <tr>
                        <td className="text-muted min-w-125px w-125px">ID</td>
                        <td className="text-gray-800">id_{pm.id}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex-equal">
                  <table className="table table-flush fw-semibold gy-1">
                    <tbody>
                      <tr>
                        <td className="text-muted min-w-125px w-125px">Billing address</td>
                        <td className="text-gray-800">{pm.billingAddress}</td>
                      </tr>
                      <tr>
                        <td className="text-muted min-w-125px w-125px">Phone</td>
                        <td className="text-gray-800">{pm.phone}</td>
                      </tr>
                      <tr>
                        <td className="text-muted min-w-125px w-125px">Email</td>
                        <td className="text-gray-800">
                          {pm.email ? (
                            <a href="#" className="text-gray-900 text-hover-primary">
                              {pm.email}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted min-w-125px w-125px">Origin</td>
                        <td className="text-gray-800">{pm.origin}</td>
                      </tr>
                      <tr>
                        <td className="text-muted min-w-125px w-125px">CVC check</td>
                        <td className="text-gray-800">
                          {pm.cvcCheck === 'passed' ? (
                            <>
                              Passed <i className="ki-outline ki-check fs-2 text-success ms-1"></i>
                            </>
                          ) : (
                            <>
                              Failed <i className="ki-outline ki-cross fs-2 text-danger ms-1"></i>
                            </>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="separator separator-dashed"></div>
          </div>
        ))}
      </div>

      {/* The confirmation modal for deleting payment methods */}
      <UpdateConfirmationModal
        onSaveChanges={confirmDelete}
        modalId="deletePaymentMethodConfirmation"
        title="Are you sure you want to delete this payment method?"
        bodyText="You will not be able to revert this action."
        confirmText="Yes, delete"
        ref={deleteModalRef}
      />
    </>
  )
}

export default PaymentMethods
