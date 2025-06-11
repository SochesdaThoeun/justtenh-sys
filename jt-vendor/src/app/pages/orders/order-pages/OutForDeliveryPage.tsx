import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchOrderList, fetchOrderCustomer, setStatusFilter } from '@/app/redux/order/orderSlice'
import { AppDispatch } from '@/app/redux/store'
import { AllOrdersHeader } from '@/app/pages/orders/components/AllOrdersHeader'
import { AllOrdersBody } from '@/app/pages/orders/components/AllOrdersBody'
import { AllOrdersPagination } from '@/app/pages/orders/components/AllOrdersPagination'

// -------------------------------------------------------
// Type Definitions
// -------------------------------------------------------
type Props = {
  className: string
}
const OutForDeliveryPage: FC<Props> = ({ className }) => {
  const dispatch: AppDispatch = useDispatch()

  // Initial fetch on component mount
  useEffect(() => {
    // First fetch the customer list, which won't be affected by order filters
    dispatch(fetchOrderCustomer());
    
    // Set the status filter to include both pending and confirmed orders
    dispatch(setStatusFilter('OutForDelivery'));
    
    // Then fetch the initial order list with status set to pending and confirmed
    dispatch(fetchOrderList({
      offset: 1,
      searchvalue: '',
      from_date: null,
      to_date: null,
      customer_id: ''
    }));
  }, [dispatch]);

  return (
    <div className={`card ${className}`}>
      <AllOrdersHeader />
      <div className='card-body py-3'>
        <AllOrdersBody />
        <AllOrdersPagination />
      </div>
    </div>
  )
}

export {OutForDeliveryPage}
