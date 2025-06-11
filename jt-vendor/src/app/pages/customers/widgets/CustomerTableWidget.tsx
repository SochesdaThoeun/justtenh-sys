import React from 'react'
import { PaginationWidget } from '../../../components/common/PaginationWidget'

// Type for transformed customer data to display in UI
export type DisplayCustomer = {
  name: string
  profileUrl: string
  email: string
  location: string
  date: string
}

interface CustomerTableWidgetProps {
  loading: boolean
  customers: DisplayCustomer[]
  entriesPerPage: number
  total: number
  onPageChange: (page: number) => void
}

export const CustomerTableWidget: React.FC<CustomerTableWidgetProps> = ({
  loading,
  customers,
  entriesPerPage,
  total,
  onPageChange,
}) => {
  return (
    <div className='card-body pt-0'>
      {loading ? (
        <div className='d-flex justify-content-center py-10'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      ) : (
        <div className='table-responsive'>
          <table className='table align-middle table-row-dashed fs-6 gy-5' id='kt_customers_table'>
            <thead>
              <tr className='text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0'>
                <th className='w-10px pe-2'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid me-3'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      data-kt-check='true'
                      data-kt-check-target='#kt_customers_table .form-check-input'
                      value='1'
                    />
                  </div>
                </th>
                <th className='min-w-125px'>Customer Name</th>
                <th className='min-w-125px'>Email</th>
                <th className='min-w-125px'>Location</th>
                <th className='min-w-125px'>Created Date</th>
                <th className='text-end min-w-70px'>Actions</th>
              </tr>
            </thead>
            <tbody className='fw-semibold text-gray-600'>
              {customers.map((customer, index) => (
                <tr key={index}>
                  <td>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                      <input className='form-check-input' type='checkbox' value='1' />
                    </div>
                  </td>
                  <td>
                    <a href={customer.profileUrl} className='text-gray-800 text-hover-primary mb-1'>
                      {customer.name}
                    </a>
                  </td>
                  <td>
                    <a
                      href={`mailto:${customer.email}`}
                      className='text-gray-600 text-hover-primary mb-1'
                    >
                      {customer.email}
                    </a>
                  </td>
                  <td>{customer.location}</td>
                  <td>{customer.date}</td>
                  <td className='text-end'>
                    <button
                      className='btn btn-sm btn-light btn-flex btn-center btn-active-light-primary'
                      data-kt-menu-trigger='click'
                      data-kt-menu-placement='bottom-end'
                    >
                      Actions
                      <i className='ki-outline ki-down fs-5 ms-1'></i>
                    </button>
                    <div
                      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4'
                      data-kt-menu='true'
                    >
                      <div className='menu-item px-3'>
                        <a href={customer.profileUrl} className='menu-link px-3'>
                          View
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <PaginationWidget
        totalEntries={total}
        entriesPerPage={entriesPerPage}
        onPageChange={onPageChange}
      />
    </div>
  )
} 