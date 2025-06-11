import React, { FC, useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '@/app/redux/store'
import { 
  fetchOrderDetailsThunk, 
  updateOrderStatusThunk, 
  updatePaymentStatusThunk,
  clearErrors
} from '@/app/redux/order/orderDetails.slice'
import UpdateConfirmationModal from '../widgets/UpdateConfirmationModal'
import OrderLocationModal from '../widgets/OrderLocationModal'
import { KTIcon } from '../../../../_metronic/helpers'
import { ShippingDetailsWidget } from '../widgets/ShippingDetailsWidget'
import { ProductListsWidget } from '../widgets/ProductListsWidget'
import { OrderDetailsWidget } from '../widgets/OrderDetailsWidget'
import { OrderHistory } from '@/app/redux/order/order.models'

interface AlertMessage {
  type: 'success' | 'error';
  text: string;
}

// Helper function to safely get deep properties
const getNestedProperty = (obj: any, path: string[]) => {
  return path.reduce((prev, curr) => 
    prev && prev[curr] !== undefined ? prev[curr] : undefined, obj);
}

const OrderDetailsPage: FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const { orderDetails, isLoading, isUpdating, error, updateError } = useSelector((state: RootState) => state.orderDetailReducer)
  const [updatedFields, setUpdatedFields] = useState<any>({})
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null)
  const [orderStatusHistory, setOrderStatusHistory] = useState<string[]>(['', '', '', '', ''])
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(1)
  
  const modalConfirmationButtonRef = useRef<HTMLButtonElement>(null)
  const modalLocationButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetailsThunk(orderId))
    }
  }, [dispatch, orderId])

  // Process order history data when orderDetails change
  useEffect(() => {
    if (orderDetails && orderDetails.length > 0) {
      const orderDetail = orderDetails[0]
      const statusStepMap: Record<string, number> = {
        'pending': 0,
        'confirmed': 1,
        'processing': 2,
        'out_for_delivery': 3,
        'delivered': 4
      }
      
      // Default to order status and created_at
      let currentStep = 1
      let historyDates = ['', '', '', '', '']
      
      // Try to find order status first
      const orderStatus = getNestedProperty(orderDetail, ['order_status']) || 
                         getNestedProperty(orderDetail, ['status'])
      
      const createdAt = getNestedProperty(orderDetail, ['created_at'])
      const updatedAt = getNestedProperty(orderDetail, ['updated_at'])
      
      if (orderStatus && (createdAt || updatedAt)) {
        const status = String(orderStatus).toLowerCase()
        if (statusStepMap[status] !== undefined) {
          const dateToUse = updatedAt || createdAt
          const date = new Date(dateToUse)
          
          // Format the date
          const formattedDate = date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
          
          historyDates[statusStepMap[status]] = formattedDate
          currentStep = (statusStepMap[status] || 0) + 1
        }
      }
      
      // Try to find deeper history data
      // Possible paths to history data
      const possibleHistoryPaths = [
        ['histories'],
        ['order', 'histories'],
        ['order_details', '0', 'histories']
      ]
      
      let histories: any[] = []
      
      // Try each path until we find histories
      for (const path of possibleHistoryPaths) {
        const foundHistories = getNestedProperty(orderDetail, path)
        if (Array.isArray(foundHistories) && foundHistories.length > 0) {
          histories = foundHistories
          break
        }
      }
      
      if (histories.length > 0) {
        // Sort histories by date, newest first
        const sortedHistories = [...histories].sort((a, b) => {
          const dateA = getNestedProperty(a, ['created_at'])
          const dateB = getNestedProperty(b, ['created_at'])
          if (!dateA || !dateB) return 0
          return new Date(dateB).getTime() - new Date(dateA).getTime()
        })
        
        // Get the latest status and determine current step
        const latestStatus = getNestedProperty(sortedHistories[0], ['status'])
        if (latestStatus) {
          const status = String(latestStatus).toLowerCase()
          currentStep = (statusStepMap[status] || 0) + 1 // 1-based for component
        }
        
        // Fill in dates for each status that exists in history
        sortedHistories.forEach((history) => {
          const status = getNestedProperty(history, ['status'])
          const createdAt = getNestedProperty(history, ['created_at'])
          
          if (status && createdAt) {
            const normalizedStatus = String(status).toLowerCase()
            if (statusStepMap[normalizedStatus] !== undefined) {
              const date = new Date(createdAt)
              
              // Format the date: HH:MM AM/PM, DD MMM YYYY
              const formattedDate = date.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
              
              historyDates[statusStepMap[normalizedStatus]] = formattedDate
            }
          }
        })
      }
      
      setCurrentStepNumber(currentStep)
      setOrderStatusHistory(historyDates)
    }
  }, [orderDetails])

  // Clear the alert message after 5 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alertMessage])

  const showModalConfirmation = () => {
    dispatch(clearErrors())
    setAlertMessage(null)
    modalConfirmationButtonRef.current?.click()
  }
  
  const showLocationModal = () => {
    modalLocationButtonRef.current?.click()
  }

  const handleSave = (fields: any) => {
    // Store the updated fields for confirmation
    setUpdatedFields(fields)
    showModalConfirmation()
  }

  const processUpdates = async (fields: any) => {
    if (!orderDetails || !orderDetails[0] || !orderId) return

    const orderId_number = parseInt(orderId)
    dispatch(clearErrors())

    //console.log('orderId_number', orderId_number)
    
    try {
      // Process order status update
      if (fields.orderStatus) {
        const result = await dispatch(updateOrderStatusThunk({
          orderID: orderId_number,
          status: fields.orderStatus
        })).unwrap()
        
        setAlertMessage({
          type: 'success',
          text: `Order status successfully updated to "${fields.orderStatus}"`
        })
      }
      
      // Process payment status update
      if (fields.paymentStatus) {
        const result = await dispatch(updatePaymentStatusThunk({
          orderId: orderId_number,
          status: fields.paymentStatus
        })).unwrap()
        
        setAlertMessage({
          type: 'success',
          text: `Payment status successfully updated to "${fields.paymentStatus}"`
        })
      }

      // After successful updates, refresh the order details
      await dispatch(fetchOrderDetailsThunk(orderId)).unwrap()
      
      // Clear the updated fields
      setUpdatedFields({})
      return true
    } catch (error: any) {
      setAlertMessage({
        type: 'error',
        text: error || 'Failed to update order details'
      })
      return false
    }
  }

  const handleExportInvoice = () => {
    if (orderId) {
      navigate(`/orders/list/invoice/${orderId}`)
    }
  }

  return (
    <>
      {isLoading && (
        <div className="d-flex justify-content-center my-10">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading order details...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger d-flex align-items-center p-5 mb-10">
          <span className="svg-icon svg-icon-2hx svg-icon-danger me-4">
            <KTIcon iconName="cross-circle" className="fs-1" />
          </span>
          <div className="d-flex flex-column">
            <h5 className="mb-1">Failed to load order details</h5>
            <span>{error}</span>
          </div>
        </div>
      )}

      {alertMessage && (
        <div className={`alert alert-${alertMessage.type === 'success' ? 'success' : 'danger'} d-flex align-items-center p-5 mb-10`}>
          <span className="svg-icon svg-icon-2hx me-4">
            <KTIcon className={`fs-1 text-${alertMessage.type === 'success' ? 'success' : 'danger'}`} iconName={alertMessage.type === 'success' ? 'check-circle' : 'cross-circle'} />
          </span>
          <div className="d-flex flex-column">
            <h5 className="mb-1">{alertMessage.type === 'success' ? 'Success' : 'Failed'}</h5>
            <span>{alertMessage.text}</span>
          </div>
        </div>
      )}
      

      {!isLoading && orderDetails && (
        <div>
          <UpdateConfirmationModal
            ref={modalConfirmationButtonRef}
            onSaveChanges={processUpdates}
            modalId={'ConfirmationModal'}
            isLoading={isUpdating}
            updatedFields={updatedFields}
            updateError={updateError}
          />
          <OrderLocationModal
            ref={modalLocationButtonRef}
            onSaveChanges={() => {}}
            modalId={'LocationModal'}
            stepsData={orderStatusHistory}
            currentStep={currentStepNumber}
          />
          <OrderDetailsWidget
            onShowConfirmation={showModalConfirmation}
            onShowLocation={showLocationModal}
            onUpdateOrderData={handleSave}
            onExportInvoice={handleExportInvoice}
          />
          <ShippingDetailsWidget 
            onUpdateOrderData={handleSave} 
          />

          <ProductListsWidget />
        </div>
      )}
    </>
  )
}

export { OrderDetailsPage }
