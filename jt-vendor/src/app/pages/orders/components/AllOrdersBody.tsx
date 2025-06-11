import React from 'react'
import {Link} from 'react-router-dom'
import {KTIcon} from '../../../../_metronic/helpers'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'

// -------------------------------------------------------
// Body Widget Props (Table Content)
// -------------------------------------------------------
type AllOrdersBodyProps = {
  orders?: any[]; // Add props to accept orders
  limit?: number; // Optional limit to show only a certain number of orders
}

export const AllOrdersBody: React.FC<AllOrdersBodyProps> = ({ orders: propOrders, limit }) => {
  // Use orders from props if provided, otherwise from redux
  const { orders: reduxOrders = [] } = useSelector((state: RootState) => state.orderReducer)
  
  const orders = propOrders || reduxOrders;
  
  // Apply limit if provided
  const displayOrders = limit ? orders.slice(0, limit) : orders;

  return (
    <div className='table-responsive'>
      <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
        {/* TABLE HEAD */}
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
            <th className='min-w-120px text-end'>Actions</th>
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody>
          {displayOrders.map((item, index) => (
            <tr key={index}>
              <td>
                <div className='form-check form-check-sm form-check-custom form-check-solid'>
                  <input
                    className='form-check-input widget-13-check'
                    type='checkbox'
                    value={item.id}
                  />
                </div>
              </td>
              <td>
                <Link
                  to={`/orders/list/all/order_details/${item.id}`}
                  className='text-gray-900 fw-bold text-hover-primary fs-6'
                >
                  {item.id}
                </Link>
              </td>
              <td>
                <span className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                  {item.created_at 
                    ? new Date(item.created_at).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit' 
                      })
                    : 'N/A'
                  }
                </span>
                <span className='text-muted fw-semibold text-muted d-block fs-7'>
                  Payment: {item.payment_status || 'N/A'}
                </span>
              </td>
              <td>
                <span className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                  {item.billing_address_data?.contact_person_name
                    ? (item.billing_address_data.contact_person_name.charAt(0).toUpperCase() +
                       item.billing_address_data.contact_person_name.slice(1)) + 
                       (item.is_guest ? ' (Guest)' : '')
                    : item.is_guest ? '(Guest)' : 'Unknown'
                  }
                </span>
                <span className='text-muted fw-semibold text-muted d-block fs-7'>
                  {item.billing_address_data?.phone || 'N/A'}
                </span>
              </td>
              <td className='text-gray-900 fw-bold fs-6'>$ {(item.order_amount || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td>
                <span className={`badge badge-light-${
                  !item.order_status ? 'secondary' :
                  item.order_status === 'pending' ? 'secondary' :
                  item.order_status === 'confirmed' ? 'primary' :
                  item.order_status === 'OutForDelivery' ? 'info' :
                  item.order_status === 'packaging' ? 'warning' :
                  item.order_status === 'delivered' ? 'success' :
                  'danger'
                }`}>
                  {!item.order_status 
                    ? 'N/A'
                    : item.order_status === 'confirmed' 
                      ? 'Paid' 
                      : item.order_status === 'OutForDelivery' 
                        ? 'Delivering' 
                        : item.order_status === 'failedForDelivered' 
                          ? 'Failed Delivery' : item.order_status.charAt(0).toUpperCase() + item.order_status.slice(1)
                  }
                </span>
              </td>
              <td className='text-end'>
                <Link
                  to={`/orders/list/all/order_details/${item.id}`}
                  className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                >
                  <KTIcon iconName='switch' className='fs-3' />
                </Link>
                <Link
                  to={`/orders/list/all/order_edit/${item.id}`}
                  className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                >
                  <KTIcon iconName='pencil' className='fs-3' />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 