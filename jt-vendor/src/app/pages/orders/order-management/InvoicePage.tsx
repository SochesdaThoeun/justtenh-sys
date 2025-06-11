import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/app/redux/store'
import { fetchOrderDetailsThunk } from '@/app/redux/order/orderDetails.slice'
import { resetInvoiceSettings } from '@/app/redux/order/invoice.slice'
import LoadingIndicator from '../components/LoadingIndicator'
import ErrorDisplay from '../components/ErrorDisplay'
import InvoiceContent from '../components/InvoiceContent'

const InvoicePage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const dispatch: AppDispatch = useDispatch()
  
  // Get loading and error states from Redux
  const { isLoading, error } = useSelector((state: RootState) => ({
    isLoading: state.orderDetailReducer.isLoading,
    error: state.orderDetailReducer.error
  }))
  
  // Fetch order details when component mounts
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetailsThunk(orderId))
    }
    
    // Reset invoice settings when component mounts
    dispatch(resetInvoiceSettings())
    
    // Cleanup when component unmounts
    return () => {
      dispatch(resetInvoiceSettings())
    }
  }, [dispatch, orderId])

  return (
    <div>
      {isLoading && (
        <LoadingIndicator message="Loading invoice data..." />
      )}
      
      {error && (
        <ErrorDisplay 
          title="Failed to load invoice data" 
          message={error} 
        />
      )}

      {!isLoading && !error && (
        <InvoiceContent orderId={orderId} />
      )}
    </div>
  )
}

export { InvoicePage } 