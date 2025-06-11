import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'

type ShippingDetailsWidgetProps = {
  onUpdateOrderData: (fields: any) => void
}

export const ShippingDetailsWidget: FC<ShippingDetailsWidgetProps> = ({
  onUpdateOrderData,
}) => {
  const { orderDetails } = useSelector((state: RootState) => state.orderDetailReducer)
  const orderDetail = orderDetails?.[0]

  if (!orderDetail) return <div>Loading order details...</div>
  
  // Extract addresses from orderDetails.order
  const shippingAddress = orderDetail?.order?.shipping_address_data
  const billingAddress = orderDetail?.order?.billing_address_data

  return (
    <div className='d-flex flex-column flex-xl-row gap-7 gap-lg-10 mb-5'>
      {/* Billing address */}
      <div className='card card-flush py-4 flex-row-fluid position-relative col-xl-6'>
        <div className='position-absolute top-0 end-0 bottom-0 opacity-10 d-flex align-items-center me-5'>
          <i className='ki-solid ki-two-credit-cart' style={{ fontSize: '14em' }}></i>
        </div>
        <div className='card-header'>
          <div className='card-title'>
            <h2>Billing Address</h2>
          </div>
        </div>
        <div className='card-body pt-0'>
          {billingAddress?.address},<br />
          {billingAddress?.city} {billingAddress?.zip},<br />
          {billingAddress?.state},<br />
          {billingAddress?.country}.
        </div>
      </div>

      {/* Shipping address */}
      <div className='card card-flush py-4 flex-row-fluid position-relative col-xl-6'>
        <div className='position-absolute top-0 end-0 bottom-0 opacity-10 d-flex align-items-center me-5'>
          <i className='ki-solid ki-delivery' style={{ fontSize: '13em' }}></i>
        </div>
        <div className='card-header'>
          <div className='card-title'>
            <h2>Shipping Address</h2>
          </div>
        </div>
        <div className='card-body pt-0'>
          {shippingAddress?.address},<br />
          {shippingAddress?.city} {shippingAddress?.zip},<br />
          {shippingAddress?.state},<br />
          {shippingAddress?.country}.
        </div>
      </div>
    </div>
  )
}
