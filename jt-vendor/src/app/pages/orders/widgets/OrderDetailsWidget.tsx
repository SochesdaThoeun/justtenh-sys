import React, { FC, useState, useEffect, useRef } from 'react'
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/app/redux/store'
import { KTIcon } from '../../../../_metronic/helpers'
import ThirdPartyDeliveryModal from './ThirdPartyDeliveryModal'
import { toast } from 'sonner'
import { assignThirdPartyDeliveryThunk, fetchOrderDetailsThunk } from '@/app/redux/order/orderDetails.slice'

type OrderDetailsWidgetProps = {
  onShowConfirmation: () => void
  onShowLocation: () => void
  onUpdateOrderData: (fields: any) => void
  onExportInvoice: () => void
}

export const OrderDetailsWidget: FC<OrderDetailsWidgetProps> = ({
  onShowConfirmation,
  onShowLocation,
  onUpdateOrderData,
  onExportInvoice,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { orderDetails, isAssigningDelivery } = useSelector((state: RootState) => state.orderDetailReducer)
  const orderDetail = orderDetails?.[0]
  const thirdPartyModalRef = useRef<HTMLButtonElement>(null)

  if (!orderDetail) return <div>Loading order details...</div>

  // Track current values to prevent UI changes until confirmed
  const [currentOrderStatus, setCurrentOrderStatus] = useState(orderDetail.order?.order_status)
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState(orderDetail.order?.payment_status)
  const [currentShippingMethod, setCurrentShippingMethod] = useState(orderDetail.order?.delivery_type)
  const [isUpdateMode, setIsUpdateMode] = useState(false)

  const optionsOrderStatus = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'OutForDelivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'returned', label: 'Returned' },
    { value: 'failedForDelivered', label: 'Failed to Deliver' },
    { value: 'canceled', label: 'Canceled' },
  ]
  
  const optionsPaymentStatus = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
  ]

  const optionsShippingMethod = [
    { value: 'direct', label: 'Delivery Direct' },
    { value: 'third_party_delivery', label: 'Third Party Delivery' },
    { value: 'update_third_party_delivery', label: 'Update Third Party Delivery' },
  ]

  // Handle order status change
  const handleOrderStatusChange = (selectedOption: any) => {
    if (selectedOption?.value !== currentOrderStatus) {
      onUpdateOrderData({ orderStatus: selectedOption?.value })
      onShowConfirmation()
      // Note: Only update local state after confirmation in parent component confirms success
      // The parent should call the handler with updated orderDetails
    }
  }

  // Handle payment status change
  const handlePaymentStatusChange = (selectedOption: any) => {
    if (selectedOption?.value !== currentPaymentStatus) {
      onUpdateOrderData({ paymentStatus: selectedOption?.value })
      onShowConfirmation()
    }
  }

  // Handle shipping method change
  const handleShippingMethodChange = (selectedOption: any) => {
    if (selectedOption?.value !== currentShippingMethod) {
      // Update shipping method in state
      setCurrentShippingMethod(selectedOption?.value)
      
      // If third party delivery is selected or updating third party delivery, show the modal for additional details
      if (selectedOption?.value === 'third_party_delivery' || selectedOption?.value === 'update_third_party_delivery') {
        // Set update mode flag
        setIsUpdateMode(selectedOption?.value === 'update_third_party_delivery')
        // Show the third party delivery modal
        thirdPartyModalRef.current?.click()
      } else {
        // For other shipping methods, update normally
        onUpdateOrderData({ shippingMethod: selectedOption?.value })
        onShowConfirmation()
      }
    }
  }

  // Handle third party delivery assignment
  const handleThirdPartyDeliveryAssignment = async (deliveryServiceName: string, trackingId: string) => {
    if (!orderDetail?.order_id) {
      toast.error('Order ID is missing')
      return false
    }

    try {
      // Check if this is an update or a new assignment
      const isUpdate = currentShippingMethod === 'update_third_party_delivery'
      
      const result = await dispatch(assignThirdPartyDeliveryThunk({
        orderId: parseInt(orderDetail.order_id.toString()),
        deliveryServiceName: deliveryServiceName,
        trackingId: trackingId
      })).unwrap()

      if (result && result.success) {
        toast.success(isUpdate ? 'Third party delivery updated successfully' : 'Third party delivery assigned successfully')
        // Refresh order details
        if (typeof orderDetail.order_id === 'string' || typeof orderDetail.order_id === 'number') {
          dispatch(fetchOrderDetailsThunk(orderDetail.order_id.toString()))
        }
        return true
      } else {
        toast.error(isUpdate ? 'Failed to update third party delivery' : 'Failed to assign third party delivery')
        return false
      }
    } catch (error) {
      console.error('Error with third party delivery:', error)
      toast.error('An error occurred while processing third party delivery')
      return false
    }
  }

  // Update local state when Redux store changes (after successful update)
  useEffect(() => {
    if (orderDetail) {
      setCurrentOrderStatus(orderDetail.order?.order_status)
      setCurrentPaymentStatus(orderDetail.order?.payment_status)
      setCurrentShippingMethod(orderDetail.order?.delivery_type)
    }
  }, [orderDetail])

  return (
    <>
      <ThirdPartyDeliveryModal
        ref={thirdPartyModalRef}
        onSaveChanges={handleThirdPartyDeliveryAssignment}
        modalId="thirdPartyDeliveryModal"
        isLoading={isAssigningDelivery}
        isUpdate={isUpdateMode}
        existingServiceName={orderDetail.order?.delivery_service_name || ''}
        existingTrackingId={orderDetail.order?.third_party_delivery_tracking_id || ''}
      />
      
      <div className='d-flex flex-column flex-xl-row gap-5 mb-5 gap-lg-5'>
        {/* Order details */}
        <div className='card card-flush py-4 flex-row-fluid col-xl-4'>
          <div className='card-header'>
            <div className='card-title'>
              <h2>Order Details (#{orderDetail?.order_id})</h2>
            </div>
          </div>
          <div className='card-body pt-0'>
            <div>
              <table className='table align-middle table-row-bordered mb-0 fs-6 gy-5 '>
                <tbody className='fw-semibold text-gray-600'>
                  <tr>
                    <td className='text-muted'>
                      <div className='d-flex align-items-center'>
                        <i className='ki-solid ki-calendar fs-2 me-2'></i>Date Added
                      </div>
                    </td>
                    <td className='fw-bold text-end'>
                      {new Date(orderDetail?.created_at || '').toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className='text-muted'>
                      <div className='d-flex align-items-center'>
                        <i className='ki-solid ki-wallet fs-2 me-2'></i>Order Status
                      </div>
                    </td>
                    <td className='mb fw-bold text-first'>
                      <Select
                        className='react-select-styled react-select-solid'
                        classNamePrefix='react-select'
                        options={optionsOrderStatus}
                        onChange={handleOrderStatusChange}
                        placeholder='Select Order Status'
                        value={optionsOrderStatus.find(op => op.value === currentOrderStatus)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className='text-muted'>
                      <div className='d-flex align-items-center'>
                        <i className='ki-solid ki-credit-cart fs-2 me-2'></i>Payment Status
                      </div>
                    </td>
                    <td className='fw-bold text-first'>
                      <Select
                        className='react-select-styled react-select-solid'
                        classNamePrefix='react-select'
                        options={optionsPaymentStatus}
                        onChange={handlePaymentStatusChange}
                        placeholder='Select Status'
                        value={optionsPaymentStatus.find(op => op.value === currentPaymentStatus)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className='text-muted'>
                      <div className='d-flex align-items-center'>
                        <i className='ki-solid ki-truck fs-2 me-2'></i>Shipping Method
                      </div>
                    </td>
                    <td className='fw-bold text-first'>
                      <Select
                        className='react-select-styled react-select-solid'
                        classNamePrefix='react-select'
                        options={optionsShippingMethod}
                        onChange={handleShippingMethodChange}
                        placeholder='Select Shipping'
                        value={optionsShippingMethod.find(op => op.value === currentShippingMethod)}
                      />
                    </td>
                  </tr>
                  
                  {/* Show third-party delivery details if available */}
                  {orderDetail.order?.delivery_type === 'third_party_delivery' && (
                    <tr>
                      <td className='text-muted' colSpan={2}>
                        <div className='mt-3 p-3 bg-light rounded'>
                          <h6 className='mb-2'>Third Party Delivery Details:</h6>
                          <p className='mb-1'>
                            <strong>Service:</strong> {orderDetail.order?.delivery_service_name || 'N/A'}
                          </p>
                          {orderDetail.order?.third_party_delivery_tracking_id && (
                            <p className='mb-0'>
                              <strong>Tracking ID:</strong> {orderDetail.order.third_party_delivery_tracking_id}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Customer details */}
        <div className='card card-flush py-4 flex-row-fluid col-xl-4'>
          <div className='card-header'>
            <div className='card-title'>
              <h2>Customer Details</h2>
            </div>
          </div>
          <div className='card-body pt-0'>
            <div className='table-responsive'>
              <table className='table align-middle table-row-bordered mb-0 fs-6 gy-5'>
                <tbody className='fw-semibold text-gray-600'>
                  <tr>
                    <td className='text-muted'>
                      <div className='d-flex align-items-center'>
                        <i className='ki-solid ki-user fs-2 me-2'></i>Customer
                      </div>
                    </td>
                    <td className='fw-bold text-end'>
                      <div className='d-flex align-items-center justify-content-end'>
                        <a href='#' className='text-gray-600 text-hover-primary'>
                          {!orderDetail.order?.customer?.name || orderDetail.order?.customer_id === 0
                            ? orderDetail.order?.shipping_address_data?.contact_person_name
                            : orderDetail.order?.customer?.name}
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className='text-muted'>
                      <div className='d-flex align-items-center'>
                        <i className='ki-solid ki-sms fs-2 me-2'></i>Email
                      </div>
                    </td>
                    <td className='fw-bold text-end'>
                      <a href='#' className='text-gray-600 text-hover-primary'>
                        {!orderDetail.order?.customer?.name || orderDetail.order?.customer_id === 0
                          ? orderDetail.order?.shipping_address_data?.email
                          : orderDetail.order?.customer?.email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className='text-muted'>
                      <div className='d-flex align-items-center'>
                        <i className='ki-solid ki-phone fs-2 me-2'></i>Phone
                      </div>
                    </td>
                    <td className='fw-bold text-end'>
                      {!orderDetail.order?.customer?.name || orderDetail.order?.customer_id === 0
                        ? orderDetail.order?.shipping_address_data?.phone
                        : orderDetail.order?.customer?.phone}
                    </td>
                  </tr>
                  <tr>
                    <td className='text-muted'>
                      <div className='d-flex align-items-center'>
                        <i className='ki-solid ki-purchase fs-2 me-2'></i>Orders
                      </div>
                    </td>
                    <td className='fw-bold text-end'>{orderDetail.qty}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className='card card-flush py-4 flex-row-fluid col-xl-4'>
          <div className='card-header'>
            <div className='card-title'>
              <h2>Documents</h2>
            </div>
          </div>
          <div className='card-body pt-0'>
            <div className='table-responsive'>
              <table className='table align-middle table-row-bordered mb-0 fs-6 gy-5 '>
                <tbody className='fw-semibold text-gray-600'>
                  <tr>
                    <td className='text-muted'>
                      <div className='d-flex align-items-center'>
                        Invoice
                        <span className='ms-1' data-bs-toggle='tooltip' title='View the invoice'>
                          <i className='ki-solid ki-information-5 text-gray-500 fs-6'></i>
                        </span>
                      </div>
                    </td>
                    <td className='fw-bold text-end'>{orderDetail?.order_id}</td>
                  </tr>
                  <tr>
                    <td className='text-muted'>Payment Method</td>
                    <td className='fw-bold text-end'>{orderDetail.order?.payment_method}</td>
                  </tr>
                  <tr>
                    <td className='text-muted'>Reference Code</td>
                    <td className='fw-bold text-end'>{orderDetail.order?.payment_note}</td>
                  </tr>
                  <tr>
                    <td className='text-muted'>Payment Status</td>
                    <td className='fw-bold text-end'>{orderDetail.order?.payment_status}</td>
                  </tr>
                  <tr>
                    <td className='text-muted'>
                      <div className='d-flex align-items-center'>
                        Shipping
                        <span className='ms-1' data-bs-toggle='tooltip' title='View shipping manifest'>
                          <i className='ki-solid ki-information-5 text-gray-500 fs-6'></i>
                        </span>
                      </div>
                    </td>
                    <td className='fw-bold text-end'>{orderDetail.order?.shipping_method_id}</td>
                  </tr>
                </tbody>
              </table>
              <div className='d-flex justify-content-end'>
                <button type='button' className='btn btn-light-primary me-4' onClick={onExportInvoice}>
                  <KTIcon iconName='exit-up' className='fs-2' />
                  Invoice
                </button>
                <button type='button' className='btn btn-light-primary' onClick={onShowLocation}>
                  <KTIcon iconName='geolocation' className='fs-2' />
                  Location
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
