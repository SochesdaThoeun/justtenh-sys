import React from 'react'
import Select, { SingleValue } from 'react-select'
import { AddCustomerFormData } from '../../../redux/customer/customer.models'

// For Country select in Add Customer modal
const countryOptions = [
  { value: '', label: 'Select a Country...' },
  { value: 'US', label: 'United States' },
  { value: 'AU', label: 'Australia' },
  { value: 'UK', label: 'United Kingdom' },
  // ... add more if needed
]

interface AddCustomerModalProps {
  formData: AddCustomerFormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleDiscard: () => void
  isLoading?: boolean
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  formData,
  handleChange,
  handleSubmit,
  handleDiscard,
  isLoading = false,
}) => {
  return (
    <div className='modal fade' id='kt_modal_add_customer' tabIndex={-1} aria-hidden='true'>
      {/*begin::Modal dialog*/}
      <div className='modal-dialog modal-dialog-centered mw-650px'>
        {/*begin::Modal content*/}
        <div className='modal-content'>
          {/*begin::Form*/}
          <form
            className='form'
            action='#'
            id='kt_modal_add_customer_form'
            data-kt-redirect='apps/customers/list.html'
            onSubmit={handleSubmit}
          >
            {/*begin::Modal header*/}
            <div className='modal-header' id='kt_modal_add_customer_header'>
              {/*begin::Modal title*/}
              <h2 className='fw-bold'>Add a Customer</h2>
              {/*end::Modal title*/}

              {/*begin::Close*/}
              <div
                id='kt_modal_add_customer_close'
                className='btn btn-icon btn-sm btn-active-icon-primary'
                onClick={handleDiscard}
                style={{ cursor: 'pointer' }}
                data-bs-dismiss='modal'
                aria-label='Close'
              >
                <i className='ki-duotone ki-cross fs-1'>
                  <span className='path1'></span>
                  <span className='path2'></span>
                </i>
              </div>
              {/*end::Close*/}
            </div>
            {/*end::Modal header*/}

            {/*begin::Modal body*/}
            <div className='modal-body py-10 px-lg-17'>
              {/*begin::Scroll*/}
              <div
                className='scroll-y me-n7 pe-7'
                id='kt_modal_add_customer_scroll'
                data-kt-scroll='true'
                data-kt-scroll-activate='{default: false, lg: true}'
                data-kt-scroll-max-height='auto'
                data-kt-scroll-dependencies='#kt_modal_add_customer_header'
                data-kt-scroll-wrappers='#kt_modal_add_customer_scroll'
                data-kt-scroll-offset='300px'
              >
                {/*begin::Input group*/}
                <div className='fv-row mb-7'>
                  <label className='required fs-6 fw-semibold mb-2'>First Name</label>
                  <input
                    type='text'
                    className='form-control form-control-solid'
                    name='f_name'
                    value={formData.f_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/*end::Input group*/}

                {/*begin::Input group*/}
                <div className='fv-row mb-7'>
                  <label className='required fs-6 fw-semibold mb-2'>Last Name</label>
                  <input
                    type='text'
                    className='form-control form-control-solid'
                    name='l_name'
                    value={formData.l_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/*end::Input group*/}

                {/*begin::Input group*/}
                <div className='fv-row mb-7'>
                  <label className='fs-6 fw-semibold mb-2'>
                    <span className='required'>Email</span>
                    <span className='ms-1' data-bs-toggle='tooltip' title='Email address must be active'>
                      <i className='ki-duotone ki-information-5 text-gray-500 fs-6'>
                        <span className='path1'></span>
                        <span className='path2'></span>
                        <span className='path3'></span>
                      </i>
                    </span>
                  </label>
                  <input
                    type='email'
                    className='form-control form-control-solid'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/*end::Input group*/}

                {/*begin::Input group*/}
                <div className='fv-row mb-7'>
                  <label className='fs-6 fw-semibold mb-2'>Phone</label>
                  <input
                    type='tel'
                    className='form-control form-control-solid'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {/*end::Input group*/}

                {/*begin::Billing toggle*/}
                <button
                  className='fw-bold fs-3 rotate collapsible mb-7 text-start w-100 bg-transparent border-0'
                  data-bs-toggle='collapse'
                  data-bs-target='#kt_modal_add_customer_billing_info'
                  type='button'
                  aria-expanded='true'
                  aria-controls='kt_customer_view_details'
                >
                  Address Information
                  <span className='ms-2 rotate-180'>
                    <i className='ki-duotone ki-down fs-3'></i>
                  </span>
                </button>
                {/*end::Billing toggle*/}

                {/*begin::Billing form*/}
                <div id='kt_modal_add_customer_billing_info' className='collapse show'>
                  {/* Country */}
                  <div className='d-flex flex-column mb-7 fv-row'>
                    <label className='required fs-6 fw-semibold mb-2'>Country</label>
                    <input
                      className='form-control form-control-solid'
                      name='country'
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* City */}
                  <div className='d-flex flex-column mb-7 fv-row'>
                    <label className='required fs-6 fw-semibold mb-2'>City</label>
                    <input
                      className='form-control form-control-solid'
                      name='city'
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* ZIP/Postal Code */}
                  <div className='d-flex flex-column mb-7 fv-row'>
                    <label className='required fs-6 fw-semibold mb-2'>ZIP/Postal Code</label>
                    <input
                      className='form-control form-control-solid'
                      name='zip_code'
                      value={formData.zip_code}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className='d-flex flex-column mb-7 fv-row'>
                    <label className='required fs-6 fw-semibold mb-2'>Address</label>
                    <input
                      className='form-control form-control-solid'
                      name='address'
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                {/*end::Billing form*/}
              </div>
              {/*end::Scroll*/}
            </div>
            {/*end::Modal body*/}

            {/*begin::Modal footer*/}
            <div className='modal-footer flex-center'>
              <button
                type='reset'
                id='kt_modal_add_customer_cancel'
                className='btn btn-light me-3'
                onClick={(e) => {
                  e.preventDefault()
                  handleDiscard()
                }}
                data-bs-dismiss='modal'
              >
                Discard
              </button>
              <button
                type='submit'
                id='kt_modal_add_customer_submit'
                className='btn btn-primary'
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className='indicator-progress'>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                ) : (
                  <span className='indicator-label'>Submit</span>
                )}
              </button>
            </div>
            {/*end::Modal footer*/}
          </form>
          {/*end::Form*/}
        </div>
        {/*end::Modal content*/}
      </div>
      {/*end::Modal dialog*/}
    </div>
  )
} 