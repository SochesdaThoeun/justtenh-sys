
import React, { useState } from 'react'
import Flatpickr from 'react-flatpickr'
import {KTIcon} from '../../../helpers'

type Props = {
  className: string
}

const TablesWidget13: React.FC<Props> = ({className}) => {
  const [dateState, setDateState] = useState<any>({
    date1: new Date(),
  });
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <div className='card-title'>
        {/* begin::Search */}
        <div className='d-flex align-items-center position-relative my-1'>
          <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
          <input
            type='text'
            data-kt-user-table-filter='search'
            className='form-control form-control-solid w-250px ps-14'
            placeholder='Search user'
            value=''
            onChange={(e) => {}}
          />
        </div>
        {/* end::Search */}
      </div>
        <div className='card-toolbar'>
          {/* begin::Menu */}

          <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
          <button
            disabled={false}
            type='button'
            className='btn btn-light-primary me-3'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            <KTIcon iconName='filter' className='fs-2' />
            Filter
          </button>
          {/* end::Filter Button */}
          {/* begin::SubMenu */}
          <div className='menu menu-sub menu-sub-dropdown w-300px w-md-325px' data-kt-menu='true'>
            {/* begin::Header */}
            <div className='px-7 py-5'>
              <div className='fs-5 text-gray-900 fw-bolder'>Filter Options</div>
            </div>
            {/* end::Header */}

            {/* begin::Separator */}
            <div className='separator border-gray-200'></div>
            {/* end::Separator */}

            {/* begin::Content */}
            <div className='px-7 py-5' data-kt-user-table-filter='form'>
              {/* begin::Input group */}
              <div className='mb-10'>
                <label className='form-label fs-6 fw-bold'>Customer:</label>
                <select
                  className='form-select form-select-solid fw-bolder'
                  data-kt-select2='true'
                  data-placeholder='Customers'
                  data-allow-clear='true'
                  data-kt-user-table-filter='role'
                >
                  <option value='Administrator'>Administrator</option>
                  <option value='Analyst'>Analyst</option>
                  <option value='Developer'>Developer</option>
                  <option value='Support'>Support</option>
                  <option value='Trial'>Trial</option>
                </select>
              </div>
              {/* end::Input group */}

              {/* begin::Input group */}
              <div className='mb-10'>
                <label className='form-label fs-6 fw-bold'>Date Type</label>
                <select
                  className='form-select form-select-solid fw-bolder'
                  data-kt-select2='true'
                  data-placeholder='Date Type'
                  data-allow-clear='true'
                  data-kt-user-table-filter='two-step'
                  data-hide-search='true'
                  onChange={(e) => {}}
                  value="0"
                >
                  <option value=''></option>
                  <option value='ThisYear'>This Year</option>
                  <option value='ThisMonth'>This Month</option>
                  <option value='ThisWeek'>This Week</option>
                  <option value='CustomDate'>Custom Date</option>
                </select>
              </div>

              <div className='mb-10'>
                <Flatpickr
                  value={dateState.date}
                  onChange={([date1]) => {
                    setDateState({ date1 });
                  }}
                  className='form-control form-control-solid'
                  placeholder='Start Date'
                />

              </div>

              <div className='mb-10'>
                <Flatpickr
                  value={dateState.date}
                  onChange={([date1]) => {
                    setDateState({ date1 });
                  }}
                  className='form-control form-control-solid'
                  placeholder='End Date'
                />

              </div>

              
              {/* end::Input group */}

              {/* begin::Actions */}
              <div className='d-flex justify-content-end'>
                <button
                  type='button'
                  disabled={false}
                  onClick={() => {}}
                  className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
                  data-kt-menu-dismiss='true'
                  data-kt-user-table-filter='reset'
                >
                  Reset
                </button>
                <button
                  disabled={false}
                  type='button'
                  onClick={() => {}}
                  className='btn btn-primary fw-bold px-6'
                  data-kt-menu-dismiss='true'
                  data-kt-user-table-filter='filter'
                >
                  Apply
                </button>
              </div>
              {/* end::Actions */}
            </div>
            {/* end::Content */}
          </div>

            {/* begin::Export */}
            <button type='button' className='btn btn-light-primary me-3'>
              <KTIcon iconName='exit-up' className='fs-2' />
              Export
            </button>
            {/* end::Export */}

            {/* begin::Add user */}
            <button type='button' className='btn btn-primary' onClick={()=>{}}>
              <KTIcon iconName='plus' className='fs-2' />
              Add Order
            </button>
            {/* end::Add user */}
          </div>
         
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value='1'
                      data-kt-check='true'
                      data-kt-check-target='.widget-13-check'
                    />
                  </div>
                </th>
                <th className='min-w-150px'>Order Id</th>
                <th className='min-w-120px'>Date</th>
                <th className='min-w-120px'>Customer</th>
                <th className='min-w-120px'>Total</th>
                <th className='min-w-120px'>Status</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <tr>
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input widget-13-check' type='checkbox' value='1' />
                  </div>
                </td>
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                    56037-XDER
                  </a>
                </td>
                
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                    05/28/2020
                  </a>
                  <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: Paid</span>
                </td>
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                    Intertico
                  </a>
                  <span className='text-muted fw-semibold text-muted d-block fs-7'>
                    Web, UI/UX Design
                  </span>
                </td>
                <td className='text-gray-900 fw-bold text-hover-primary fs-6'>$3560</td>
                <td>
                  <span className='badge badge-light-success'>Approved</span>
                </td>
                <td className='text-end'>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTIcon iconName='switch' className='fs-3' />
                  </a>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTIcon iconName='pencil' className='fs-3' />
                  </a>
                  <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTIcon iconName='trash' className='fs-3' />
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input widget-13-check' type='checkbox' value='1' />
                  </div>
                </td>
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                    05822-FXSP
                  </a>
                </td>
                
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                    04/18/2021
                  </a>
                  <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: Paid</span>
                </td>
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                    Agoda
                  </a>
                  <span className='text-muted fw-semibold text-muted d-block fs-7'>
                    Houses &amp; Hotels
                  </span>
                </td>
                <td className='text-gray-900 fw-bold text-hover-primary fs-6'>$4850</td>
                <td>
                  <span className='badge badge-light-warning'>In Progress</span>
                </td>
                <td className='text-end'>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTIcon iconName='switch' className='fs-3' />
                  </a>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTIcon iconName='pencil' className='fs-3' />
                  </a>
                  <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTIcon iconName='trash' className='fs-3' />
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input widget-13-check' type='checkbox' value='1' />
                  </div>
                </td>
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                    4472-QREX
                  </a>
                </td>
                
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                    07/23/2019
                  </a>
                  <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: Paid</span>
                </td>
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                    RoadGee
                  </a>
                  <span className='text-muted fw-semibold text-muted d-block fs-7'>
                    Transportation
                  </span>
                </td>
                <td className='text-gray-900 fw-bold text-hover-primary fs-6'>$8376</td>
                <td>
                  <span className='badge badge-light-danger'>Success</span>
                </td>
                <td className='text-end'>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTIcon iconName='switch' className='fs-3' />
                  </a>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTIcon iconName='pencil' className='fs-3' />
                  </a>
                  <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTIcon iconName='trash' className='fs-3' />
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input widget-13-check' type='checkbox' value='1' />
                  </div>
                </td>
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                    00347-BCLQ
                  </a>
                </td>
                
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                    12/21/2021
                  </a>
                  <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: Paid</span>
                </td>
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                    The Hill
                  </a>
                  <span className='text-muted fw-semibold text-muted d-block fs-7'>Insurance</span>
                </td>
                <td className='text-gray-900 fw-bold text-hover-primary fs-6'>$9486</td>
                <td>
                  <span className='badge badge-light-info'>Rejected</span>
                </td>
                <td className='text-end'>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTIcon iconName='switch' className='fs-3' />
                  </a>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTIcon iconName='pencil' className='fs-3' />
                  </a>
                  <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTIcon iconName='trash' className='fs-3' />
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input widget-13-check' type='checkbox' value='1' />
                  </div>
                </td>
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                    59486-XDER
                  </a>
                </td>
                
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                    05/28/2020
                  </a>
                  <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: Paid</span>
                </td>
                <td>
                  <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                    Phillipines
                  </a>
                  <span className='text-muted fw-semibold text-muted d-block fs-7'>
                    Transportation
                  </span>
                </td>
                <td className='text-gray-900 fw-bold text-hover-primary fs-6'>$8476</td>
                <td>
                  <span className='badge badge-light-primary'>Approved</span>
                </td>
                <td className='text-end'>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTIcon iconName='switch' className='fs-3' />
                  </a>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTIcon iconName='pencil' className='fs-3' />
                  </a>
                  <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTIcon iconName='trash' className='fs-3' />
                  </a>
                </td>
              </tr>
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export {TablesWidget13}
