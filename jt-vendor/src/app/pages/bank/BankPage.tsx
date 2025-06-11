import React, { useState, useRef } from 'react'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'

// Our modals:
import CardModal from './components/CardModal'
import BankModal from './components/BankModal'
import ConfirmationModal from './components/ConfirmationModal'

// At the top of the file, add these interfaces

interface MethodDetails {
  name?: string;
  number?: string;
  expires?: string;
  type?: string;
  issuer?: string;
  id?: string;
  billingAddress?: string;
  phone?: string;
  email?: string;
  origin?: string;
  cvcCheck?: string;
  account?: string;
  bankName?: string;
  branchName?: string;
  holderName?: string;
  bankAddress?: string;
}

interface PaymentMethod {
  id: number | string;
  name: string;
  type: 'card' | 'bank';
  expires?: string;
  isPrimary?: boolean;
  logo?: string;
  details: MethodDetails;
}

const BankPage: React.FC = () => {
  // -- Dummy data inline only (not from a separate file) --
  const [accounts, setAccounts] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: 'card',
      logo: '../../../../public/media/svg/card-logos/mastercard.svg',
      name: 'Mastercard',
      isPrimary: true,
      expires: 'Dec 2024',
      details: {
        name: 'Emma Smith',
        number: '**** 9060',
        expires: '12/2024',
        type: 'Mastercard credit card',
        issuer: 'VICBANK',
        id: 'id_4325df90sdf8',
        billingAddress: 'AU',
        phone: 'No phone provided',
        email: 'smith@kpmg.com',
        origin: 'Australia',
        cvcCheck: 'Passed',
      },
    },
    {
      id: 2,
      type: 'card',
      logo: '../../../../public/media/svg/card-logos/visa.svg',
      name: 'Visa',
      isPrimary: false,
      expires: 'Feb 2022',
      details: {
        name: 'Melody Macy',
        number: '**** 7553',
        expires: '02/2022',
        type: 'Visa credit card',
        issuer: 'ENBANK',
        id: 'id_w2r84jdy723',
        billingAddress: 'UK',
        phone: 'No phone provided',
        email: 'melody@altbox.com',
        origin: 'United Kingdom',
        cvcCheck: 'Passed',
      },
    },
    {
      id: 3,
      type: 'card',
      logo: '../../../../public/media/svg/card-logos/american-express.svg',
      name: 'American Express',
      isPrimary: false,
      expires: 'Aug 2021',
      details: {
        name: 'Max Smith',
        number: '**** 9973',
        expires: '08/2021',
        type: 'American express credit card',
        issuer: 'USABANK',
        id: 'id_89457jcje63',
        billingAddress: 'US',
        phone: 'No phone provided',
        email: 'max@kt.com',
        origin: 'United States of America',
        cvcCheck: 'Failed',
      },
    },
  ])

  // State for controlling "edit item" scenario
  const [editItem, setEditItem] = useState<PaymentMethod | null>(null)
  const [editType, setEditType] = useState<'card' | 'bank' | null>(null)

  // State for controlling "delete item" scenario
  const [itemToDelete, setItemToDelete] = useState<PaymentMethod | null>(null)

  // If you want an extra "update confirmation" step:
  const [pendingUpdateData, setPendingUpdateData] = useState<PaymentMethod | null>(null)

  // Refs to open modals programmatically (if desired)
  const deleteConfirmationModalRef = useRef<HTMLButtonElement>(null)
  const updateConfirmationModalRef = useRef<HTMLButtonElement>(null)

  // CREATE new card
  const handleAddCard = (newCard: PaymentMethod) => {
    // If you do NOT want an extra confirmation step for creation,
    // you can finalize it right away:
    setAccounts((prev) => [...prev, newCard])
  }

  // CREATE new bank
  const handleAddBank = (newBank: PaymentMethod) => {
    setAccounts((prev) => [...prev, newBank])
  }

  // EDIT card or bank => shows the modal in "edit" mode
  const handleEdit = (item: PaymentMethod) => {
    setEditItem(item)
    setEditType(item.type) // "card" or "bank"
    // Then open the appropriate modal via data-bs-target or programmatically
    if (item.type === 'card') {
      // open the card modal
      const openBtn = document.querySelector<HTMLButtonElement>(
        '#openCardModalBtn'
      )
      openBtn?.click()
    } else {
      // open the bank modal
      const openBtn = document.querySelector<HTMLButtonElement>(
        '#openBankModalBtn'
      )
      openBtn?.click()
    }
  }

  // Called from the modal's "onEdit" when user hits "Update"
  // Here, instead of finalizing the update, we store the changes and open a confirmation.
  const handleEditSubmitCard = (updatedCard: PaymentMethod) => {
    setPendingUpdateData(updatedCard)
    // close card modal automatically with data-bs-dismiss if you want,
    // then open update confirmation
    updateConfirmationModalRef.current?.click()
  }

  const handleEditSubmitBank = (updatedBank: PaymentMethod) => {
    setPendingUpdateData(updatedBank)
    updateConfirmationModalRef.current?.click()
  }

  // Actually confirm the update
  const confirmUpdate = () => {
    if (pendingUpdateData) {
      setAccounts((prev) =>
        prev.map((acct) =>
          acct.id === pendingUpdateData.id ? pendingUpdateData : acct
        )
      )
      setPendingUpdateData(null)
      setEditItem(null)
      setEditType(null)
    }
  }

  // DELETE card/bank => open "are you sure" modal
  const handleDeleteClick = (item: PaymentMethod) => {
    setItemToDelete(item)
    // open the delete confirmation
    deleteConfirmationModalRef.current?.click()
  }
  // Actually confirm the delete
  const confirmDelete = () => {
    if (itemToDelete) {
      setAccounts((prev) => prev.filter((acct) => acct.id !== itemToDelete.id))
      setItemToDelete(null)
    }
  }

  // SET AS PRIMARY
  const handleSetPrimary = (id: string | number) => {
    setAccounts((prev) =>
      prev.map((account) => ({
        ...account,
        isPrimary: account.id === id,
      }))
    )
  }

  const widgetsBreadCrumbs: Array<PageLink> = [
    {
      title: 'Bank Account',
      path: '/bank/',
      isSeparator: false,
      isActive: false,
    },
  ]

  return (
    <div>
      <PageTitle breadcrumbs={widgetsBreadCrumbs}>Bank Accounts</PageTitle>

      {/* begin::Card - Payment Methods */}
      <div className="card pt-4 mb-6 mb-xl-9">
        <div className="card-header border-0">
          <div className="card-title">
            <h2 className="fw-bold mb-0">Accounts</h2>
          </div>
          <div className="card-toolbar">
            {/* Button to add card */}
            <button
              type="button"
              className="btn btn-sm btn-flex btn-light-primary me-2"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_card_create" // The "Add" card modal
            >
              <i className="ki-duotone ki-plus-square fs-3">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
              Add Card
            </button>

            {/* Button to add bank */}
            <button
              type="button"
              className="btn btn-sm btn-flex btn-light-success"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_bank_create" // The "Add" bank modal
            >
              <i className="ki-duotone ki-plus-square fs-3">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
              Add Bank
            </button>
          </div>
        </div>

        <div id="kt_customer_view_payment_method" className="card-body pt-0">
          <div
            className="accordion accordion-icon-toggle"
            id="kt_customer_view_payment_method_accordion"
          >
            {accounts.map((method) => (
              <div
                className="py-0"
                data-kt-customer-payment-method="row"
                key={method.id}
              >
                {/* Accordion button/summary */}
                <a
                  className="accordion-header d-flex align-items-center collapse"
                  data-bs-toggle="collapse"
                  href={`#kt_customer_view_payment_method_${method.id}`}
                  role="button"
                  aria-expanded="false"
                  aria-controls={`kt_customer_view_payment_method_${method.id}`}
                >
                  <div className="accordion-icon me-2">
                    <i className="ki-solid ki-right fs-4"></i>
                  </div>
                  {/* Show a logo if you have one */}
                  {method.logo && (
                    <img
                      src={method.logo}
                      className="w-40px me-3"
                      alt="method logo"
                    />
                  )}
                  <div className="me-3">
                    <div className="d-flex align-items-center">
                      <div className="text-gray-800 fw-bold">{method.name}</div>
                      {method.isPrimary && (
                        <div className="badge badge-light-primary ms-5">
                          Primary
                        </div>
                      )}
                    </div>
                    {/* If it's a card, show Expires. If it's a bank, show the account # */}
                    {method.type === 'card' ? (
                      <div className="text-muted">
                        Expires {method.expires}
                      </div>
                    ) : (
                      <div className="text-muted">
                        Account: {method.details.account}
                      </div>
                    )}
                  </div>
                </a>

                {/* Action buttons */}
                <div className="d-flex my-3 ms-9">
                  {/* "Edit" */}
                  <button
                    type="button"
                    className="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
                    onClick={() => handleEdit(method)}
                  >
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-trigger="hover"
                      title="Edit"
                    >
                      <i className="ki-duotone ki-pencil fs-3">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </span>
                  </button>

                  {/* "Delete" */}
                  <button
                    type="button"
                    className="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
                    data-bs-toggle="tooltip"
                    title="Delete"
                    onClick={() => handleDeleteClick(method)}
                  >
                    <i className="ki-duotone ki-trash fs-3">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                      <span className="path4"></span>
                      <span className="path5"></span>
                    </i>
                  </button>

                  {/* "More options" */}
                  <button
                    type="button"
                    className="btn btn-icon btn-active-light-primary w-30px h-30px"
                    data-bs-toggle='dropdown'
                  >
                    <i className="ki-duotone ki-setting-3 fs-3">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                      <span className="path4"></span>
                      <span className="path5"></span>
                    </i>
                  </button>
                  {/* begin::Menu */}
                  <div className='dropdown-menu dropdown-menu-end'>
                    <a
                        type="button"
                        className='dropdown-item'  
                        onClick={() => handleSetPrimary(method.id)}
                      >
                        Set as Primary
                    </a>
                </div>
                 
                  {/* end::Menu */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* end::Card - Payment Methods */}

      {/* ---------------------------------------------
         -- CREATE Card Modal (Add) --
         --------------------------------------------- */}
      <CardModal
        modalId="kt_modal_card_create"
        onCreate={handleAddCard}
        onEdit={() => {}} // not used in "add" mode
        isEdit={false}
      />

      {/* ---------------------------------------------
         -- CREATE Bank Modal (Add) --
         --------------------------------------------- */}
      <BankModal
        modalId="kt_modal_bank_create"
        onCreate={handleAddBank}
        onEdit={() => {}}
        isEdit={false}
      />

      {/* ---------------------------------------------
         -- EDIT Card Modal (same component, but for editing) --
         We open this programmatically or by a hidden button
         --------------------------------------------- */}
      <CardModal
        modalId="kt_modal_card_edit"
        onCreate={() => {}} // not used in edit mode
        onEdit={handleEditSubmitCard}
        isEdit={true}
        initialCardData={editType === 'card' ? editItem : null}
      />
      {/* Hidden button to open the "Edit Card" modal */}
      <button
        id="openCardModalBtn"
        type="button"
        className="d-none"
        data-bs-toggle="modal"
        data-bs-target="#kt_modal_card_edit"
      >
        Open Edit Card
      </button>

      {/* ---------------------------------------------
         -- EDIT Bank Modal --
         --------------------------------------------- */}
      <BankModal
        modalId="kt_modal_bank_edit"
        onCreate={() => {}}
        onEdit={handleEditSubmitBank}
        isEdit={true}
        initialBankData={editType === 'bank' ? editItem : null}
      />
      {/* Hidden button to open the "Edit Bank" modal */}
      <button
        id="openBankModalBtn"
        type="button"
        className="d-none"
        data-bs-toggle="modal"
        data-bs-target="#kt_modal_bank_edit"
      >
        Open Edit Bank
      </button>

      {/* ---------------------------------------------
         -- DELETE Confirmation Modal --
         --------------------------------------------- */}
      <ConfirmationModal
        modalId="confirmDeleteModal"
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this?"
        body="You will not be able to revert this."
        ref={deleteConfirmationModalRef}
      />

      {/* ---------------------------------------------
         -- UPDATE Confirmation Modal (for editing) --
         --------------------------------------------- */}
      <ConfirmationModal
        modalId="confirmUpdateModal"
        onConfirm={confirmUpdate}
        title="Are you sure you want to update this?"
        body="You will not be able to revert this."
        ref={updateConfirmationModalRef}
      />
    </div>
  )
}

export default BankPage
