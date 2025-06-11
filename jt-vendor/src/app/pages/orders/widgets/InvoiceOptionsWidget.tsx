import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { 
  setEnablePayment, 
  setEnableDueDate, 
  setEnableTerms, 
  setEnableSignature 
} from '@/app/redux/order/invoice.slice';
import { KTIcon } from '@/_metronic/helpers';
import { formatCurrency, formatDate } from '../utils/invoice.utils';
import { Order } from '@/app/redux/order/order.models';

interface InvoiceOptionsWidgetProps {
  orderDetail: Order | null;
  invoiceNumber: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  onPrint: () => void;
  onDownload: () => void;
  extraDiscountAmount?: number;
  extraDiscountType?: string;
}

const InvoiceOptionsWidget: React.FC<InvoiceOptionsWidgetProps> = ({
  orderDetail,
  invoiceNumber,
  subtotal,
  discount,
  tax,
  shipping,
  total,
  onPrint,
  onDownload,
  extraDiscountAmount = 0,
  extraDiscountType = 'amount'
}) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { 
    enablePayment, 
    enableDueDate, 
    enableTerms, 
    enableSignature 
  } = useSelector((state: RootState) => state.invoice);

  // Determine if we should show extra discount
  const showExtraDiscount = extraDiscountAmount > 0;

  const handleTogglePayment = () => {
    dispatch(setEnablePayment(!enablePayment));
  };

  const handleToggleDueDate = () => {
    dispatch(setEnableDueDate(!enableDueDate));
  };

  const handleToggleTerms = () => {
    dispatch(setEnableTerms(!enableTerms));
  };

  const handleToggleSignature = () => {
    dispatch(setEnableSignature(!enableSignature));
  };

  return (
    <div className="card mb-5">
      <div className="card-body p-9">
        <div className="mb-8">
          <h3 className="fs-2 fw-bold mb-6">Invoice Options</h3>
        </div>
        
        <div className="mb-5">
          <div className="form-check form-switch form-check-custom form-check-solid mb-5">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="enablePayment" 
              checked={enablePayment}
              onChange={handleTogglePayment}
            />
            <label className="form-check-label fw-semibold text-gray-700" htmlFor="enablePayment">
              Show Payment Info
            </label>
          </div>
          
          <div className="form-check form-switch form-check-custom form-check-solid mb-5">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="enableDueDate" 
              checked={enableDueDate}
              onChange={handleToggleDueDate}
            />
            <label className="form-check-label fw-semibold text-gray-700" htmlFor="enableDueDate">
              Show Due Date
            </label>
          </div>
          
          <div className="form-check form-switch form-check-custom form-check-solid mb-5">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="enableTerms" 
              checked={enableTerms}
              onChange={handleToggleTerms}
            />
            <label className="form-check-label fw-semibold text-gray-700" htmlFor="enableTerms">
              Show Terms & Conditions
            </label>
          </div>
          
          <div className="form-check form-switch form-check-custom form-check-solid mb-5">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="enableSignature" 
              checked={enableSignature}
              onChange={handleToggleSignature}
            />
            <label className="form-check-label fw-semibold text-gray-700" htmlFor="enableSignature">
              Show Signature Line
            </label>
          </div>
        </div>
        
        {/* Order Summary Information */}
        <div className="mb-8">
          <h4 className="fs-5 fw-semibold mb-3">Order Summary</h4>
          
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-gray-600 fs-6">Order ID:</span>
              <span className="fw-bold fs-6">{orderDetail?.id || '-'}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <span className="text-gray-600 fs-6">Order Date:</span>
              <span className="fw-bold fs-6">{formatDate(orderDetail?.created_at) || '-'}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <span className="text-gray-600 fs-6">Order Status:</span>
              <span className="fw-bold fs-6">{orderDetail?.order_status || '-'}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <span className="text-gray-600 fs-6">Payment Method:</span>
              <span className="fw-bold fs-6">{orderDetail?.payment_method || '-'}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <span className="text-gray-600 fs-6">Payment Status:</span>
              <span className="fw-bold fs-6">{orderDetail?.payment_status || '-'}</span>
            </div>
            
            {orderDetail?.delivery_type && (
              <div className="d-flex justify-content-between mb-2">
                <span className="text-gray-600 fs-6">Delivery Type:</span>
                <span className="fw-bold fs-6">{orderDetail.delivery_type}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2">
              <span className="text-gray-600 fs-6">Subtotal:</span>
              <span className="fw-bold fs-6">{formatCurrency(subtotal)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-gray-600 fs-6">Discount:</span>
              <span className="fw-bold fs-6">{formatCurrency(discount)}</span>
            </div>

            {showExtraDiscount && (
              <div className="d-flex justify-content-between mb-2">
                <span className="text-gray-600 fs-6">
                  Extra Discount {extraDiscountType === 'percentage' ? `(${extraDiscountAmount}%)` : '(Flat)'}:
                </span>
                <span className="fw-bold fs-6">
                  {formatCurrency(extraDiscountType === 'percentage' 
                    ? subtotal * (extraDiscountAmount / 100)
                    : extraDiscountAmount)}
                </span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2">
              <span className="text-gray-600 fs-6">Tax:</span>
              <span className="fw-bold fs-6">{formatCurrency(tax)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-gray-600 fs-6">Shipping:</span>
              <span className="fw-bold fs-6">{formatCurrency(shipping)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2 pt-2 border-top">
              <span className="text-gray-800 fs-5 fw-bold">Total Amount:</span>
              <span className="fw-bolder fs-5 text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-end mt-10">
          <button
            type="button"
            className="btn btn-primary me-3"
            onClick={onDownload}
          >
            <KTIcon iconName="cloud-download" className="fs-2 me-1" />
            Download
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onPrint}
          >
            <KTIcon iconName="printer" className="fs-2 me-1" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceOptionsWidget; 