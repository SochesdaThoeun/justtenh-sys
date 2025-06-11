import React from 'react'
import Select, { SingleValue } from 'react-select'
import { KTIcon } from '../../../../_metronic/helpers'

const statusOptions = [
  { value: '', label: 'Select status...' },
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'locked', label: 'Locked' },
]

interface CustomerFilterWidgetProps {
  searchValue: string
  setSearchValue: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  handleReset: () => void
  handleApply: () => void
  handleExportCSV: () => void
}

export const CustomerFilterWidget: React.FC<CustomerFilterWidgetProps> = ({
  searchValue,
  setSearchValue,
  handleExportCSV,
}) => {
  return (
    <div className='card-header border-0 pt-6'>
      {/*begin::Search*/}
      <div className='card-title'>
        <div className='d-flex align-items-center position-relative my-1'>
          <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
          <input
            type='text'
            className='form-control form-control-solid w-250px ps-14'
            placeholder='Search Customers'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      {/*end::Search*/}

      {/*begin::Card toolbar*/}
      <div className='card-toolbar'>
        <div className='d-flex justify-content-end' data-kt-customer-table-toolbar='base'>
         
          
          {/* Export to CSV */}
          <button type='button' className='btn btn-light-primary me-3' onClick={handleExportCSV}>
            <KTIcon iconName='exit-up' className='fs-2' />
            Export
          </button>
          {/* Add Customer (Bootstrap Modal Trigger) */}
          <button
            type='button'
            className='btn btn-primary'
            data-bs-toggle='modal'
            data-bs-target='#kt_modal_add_customer'
          >
            <KTIcon iconName='plus' className='fs-2' />
            Add Customer
          </button>
        </div>
      </div>
      {/*end::Card toolbar*/}
    </div>
  )
} 