import React, { useEffect, useState, FormEvent } from 'react'

type BankModalProps = {
  modalId: string
  onCreate: (bankData: any) => void
  onEdit: (bankData: any) => void
  isEdit?: boolean
  initialBankData?: any
}

const BankModal: React.FC<BankModalProps> = ({
  modalId,
  onCreate,
  onEdit,
  isEdit = false,
  initialBankData,
}) => {
  const [bankName, setBankName] = useState('')
  const [branchName, setBranchName] = useState('')
  const [holderName, setHolderName] = useState('')
  const [bankAddress, setBankAddress] = useState('')
  const [accountNumber, setAccountNumber] = useState('')

  useEffect(() => {
    if (isEdit && initialBankData) {
      setBankName(initialBankData.details?.bankName || '')
      setBranchName(initialBankData.details?.branchName || '')
      setHolderName(initialBankData.details?.holderName || '')
      setBankAddress(initialBankData.details?.bankAddress || '')
      setAccountNumber(initialBankData.details?.account || '')
    }
  }, [isEdit, initialBankData])

  const handleDiscard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const bankData = {
      id: isEdit && initialBankData ? initialBankData.id : Date.now(),
      type: 'bank',
      // if you need a logo, handle it below or from user input
      logo: initialBankData?.logo || '../../../../public/media/svg/brand-logos/commbank.svg',
      name: bankName,
      isPrimary: isEdit ? initialBankData?.isPrimary ?? false : false,
      expires: '',
      details: {
        bankName,
        branchName,
        holderName,
        bankAddress,
        account: accountNumber,
        // Copy any additional details from initialBankData if editing
      },
    }

    if (isEdit) {
      onEdit(bankData)
    } else {
      onCreate(bankData)
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
            <h2>{isEdit ? 'Edit Bank' : 'Add New Bank'}</h2>
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
            <form id="kt_modal_bank_form" className="form" onSubmit={handleSubmit}>
              {/* Bank Name */}
              <div className="d-flex flex-column mb-7 fv-row">
                <label className="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                  <span className="required">Bank Name</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Enter bank name"
                  name="bank_name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
              </div>
              {/* Branch Name */}
              <div className="d-flex flex-column mb-7 fv-row">
                <label className="fs-6 fw-semibold form-label mb-2">Branch Name</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Enter branch name"
                  name="branch_name"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                />
              </div>
              {/* Holder Name */}
              <div className="d-flex flex-column mb-7 fv-row">
                <label className="fs-6 fw-semibold form-label mb-2">Holder Name</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Enter holder name"
                  name="holder_name"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                />
              </div>
              {/* Bank Address */}
              <div className="d-flex flex-column mb-7 fv-row">
                <label className="fs-6 fw-semibold form-label mb-2">Bank Address</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Enter bank address"
                  name="bank_address"
                  value={bankAddress}
                  onChange={(e) => setBankAddress(e.target.value)}
                />
              </div>
              {/* Account Number */}
              <div className="d-flex flex-column mb-7 fv-row">
                <label className="fs-6 fw-semibold form-label mb-2">Account</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Enter bank account number"
                  name="account_number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>

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
                  className="btn btn-success"
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

export default BankModal
