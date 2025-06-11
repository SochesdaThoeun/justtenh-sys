
import React from 'react'
import {KTIcon} from '../../../helpers'

type Props = {
  className: string
}

const RecentOrderWidget: React.FC<Props> = ({className}) => {

  const data = [
    {
      orderId: '56037-XDER',
      date: '05/28/2020',
      code: 'Paid',
      customer: 'Intertico',
      details: 'Web, UI/UX Design',
      total: '$3560',
      status: { label: 'Delivered', color: 'success' },
    },
    {
      orderId: '05822-FXSP',
      date: '04/18/2021',
      code: 'Paid',
      customer: 'Agoda',
      details: 'Houses & Hotels',
      total: '$4850',
      status: { label: 'Packaging', color: 'warning' },
    },
    {
      orderId: '4472-QREX',
      date: '07/23/2019',
      code: 'Paid',
      customer: 'RoadGee',
      details: 'Transportation',
      total: '$8376',
      status: { label: 'Canceled', color: 'danger' },
    },
    {
      orderId: '4472-QREX',
      date: '07/23/2019',
      code: 'Paid',
      customer: 'RoadGee',
      details: 'Transportation',
      total: '$8376',
      status: { label: 'Returned', color: 'danger' },
    },
    {
      orderId: '4472-QREX',
      date: '07/23/2019',
      code: 'Paid',
      customer: 'RoadGee',
      details: 'Transportation',
      total: '$8376',
      status: { label: 'Failed ', color: 'danger' },
    },
    {
      orderId: '00347-BCLQ',
      date: '12/21/2021',
      code: 'Paid',
      customer: 'The Hill',
      details: 'Insurance',
      total: '$9486',
      status: { label: 'Delivering', color: 'info' },
    },
    {
      orderId: '59486-XDER',
      date: '05/28/2020',
      code: 'Paid',
      customer: 'Phillipines',
      details: 'Transportation',
      total: '$8476',
      status: { label: 'Pending', color: 'primary' },
    },
    {
      orderId: '59486-XDER',
      date: '05/28/2020',
      code: 'Paid',
      customer: 'Phillipines',
      details: 'Transportation',
      total: '$8476',
      status: { label: 'Confirmed', color: 'primary' },
    },
  ];
  
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Recent Orders</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Over 500 orders</span>
        </h3>
        <div className='card-toolbar'>
          {/* begin::Menu */}

          <a href='/orders/list/all' className='btn btn-sm btn-color-primary btn-active-light-primary'>
            Show All
          </a>
         
          {/* end::Menu */}
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
              {data.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input
                          className="form-check-input widget-13-check"
                          type="checkbox"
                          value={item.orderId}
                        />
                      </div>
                    </td>
                    <td>
                      <a
                        href="./all/order_details"
                        className="text-gray-900 fw-bold text-hover-primary fs-6"
                      >
                        {item.orderId}
                      </a>
                    </td>
                    <td>
                      <a
                        href="#"
                        className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                      >
                        {item.date}
                      </a>
                      <span className="text-muted fw-semibold text-muted d-block fs-7">
                        Code: {item.code}
                      </span>
                    </td>
                    <td>
                      <a
                        href="#"
                        className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                      >
                        {item.customer}
                      </a>
                      <span className="text-muted fw-semibold text-muted d-block fs-7">
                        {item.details}
                      </span>
                    </td>
                    <td className="text-gray-900 fw-bold text-hover-primary fs-6">
                      {item.total}
                    </td>
                    <td>
                      <span
                        className={`badge badge-light-${item.status.color}`}
                      >
                        {item.status.label}
                      </span>
                    </td>
                    <td className="text-end">
                      <a
                        href="./orders/list/all/order_details"
                        className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                      >
                        <KTIcon iconName="switch" className="fs-3" />
                      </a>
                      <a
                        href="./orders/list/all/order_edit"
                        className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                      >
                        <KTIcon iconName="pencil" className="fs-3" />
                      </a>
                    </td>
                  </tr>
                ))}
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

export {RecentOrderWidget}
