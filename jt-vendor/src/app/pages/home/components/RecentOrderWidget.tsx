import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { AllOrdersBody } from '@/app/pages/orders/components/AllOrdersBody'

type Props = {
  className: string
}

const RecentOrderWidget: React.FC<Props> = ({className}) => {
  // Get data directly from Redux
  const recentOrders = useSelector((state: RootState) => 
    state.vendorReducer.recentOrders || []
  );
  
  // Use the provided recentOrders or fallback to empty array
  const data = recentOrders.length > 0 ? recentOrders : [];
  
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Recent Orders</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>{recentOrders.length} recent orders</span>
        </h3>
        <div className='card-toolbar'>
          {/* begin::Menu */}
          <Link to='/orders/list/all' className='btn btn-sm btn-color-primary btn-active-light-primary'>
            Show All
          </Link>
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* Use AllOrdersBody component */}
        <AllOrdersBody orders={data} limit={10} />
      </div>
      {/* begin::Body */}
    </div>
  )
}

export {RecentOrderWidget}
