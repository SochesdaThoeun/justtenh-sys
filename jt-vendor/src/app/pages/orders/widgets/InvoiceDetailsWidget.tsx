import React, { forwardRef } from 'react';
import { Order } from '@/app/redux/order/order.models';
import { PRODUCT_IMAGE_URL } from '@/app/constants/api.constants';
import { 
  formatCurrency, 
  formatDate, 
  getBillingAddress, 
  getShippingAddress, 
  getCustomerDetails,
  getOrderDetails
} from '../utils/invoice.utils';

interface InvoiceDetailsWidgetProps {
  orderDetail: Order | null;
  orderId: string | undefined;
  invoiceNumber: string;
  enableTerms: boolean;
  enableSignature: boolean;
  lineItems: any[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  extraDiscountAmount?: number;
  extraDiscountType?: string;
}

const InvoiceDetailsWidget = forwardRef<HTMLDivElement, InvoiceDetailsWidgetProps>(
  ({ 
    orderDetail, 
    orderId, 
    invoiceNumber, 
    enableTerms, 
    enableSignature,
    lineItems,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    extraDiscountAmount = 0,
    extraDiscountType = 'amount'
  }, ref) => {
    // Extract addresses and other details
    const billingAddress = getBillingAddress(orderDetail);
    const shippingAddress = getShippingAddress(orderDetail);
    const customerDetails = getCustomerDetails(orderDetail);
    const details = getOrderDetails(orderDetail, orderId);

    // Determine if we should show extra discount details
    const showExtraDiscount = extraDiscountAmount > 0;

    return (
      <div className="card-body p-9" ref={ref}>
        <div className="d-flex justify-content-between mb-5">
          <div>
            <h1 className="fs-2hx fw-bold">Order Invoice</h1>
          </div>
        </div>
        
        {/* Invoice Header Section */}
        <div className="row mb-8">
          <div className="col-6">
            <div className="mb-3">
              <label className="form-label fw-bold text-dark">Invoice No.</label>
              <div className="fw-semibold fs-6">{invoiceNumber}</div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-dark">Invoice Date</label>
              <div className="fw-semibold fs-6">{formatDate(details.date)}</div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-dark">Payment Method</label>
              <div className="fw-semibold fs-6">{details.paymentMethod}</div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-dark">Payment Status</label>
              <div className="fw-semibold fs-6">
                <span className={`badge badge-light-${details.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                  {details.paymentStatus}
                </span>
              </div>
            </div>
          </div>
          
          {/* Client Information */}
          <div className="col-6">
            <div className="fs-6 fw-bold text-dark mb-3">Client Information</div>
            <div className="mb-3">
              <label className="form-label fw-semibold text-muted">Customer</label>
              <div className="fw-semibold fs-6">
                <div>{customerDetails.name}</div>
                {customerDetails.email && <div>Email: {customerDetails.email}</div>}
                {customerDetails.phone && <div>Phone: {customerDetails.phone}</div>}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold text-muted">Billing Address</label>
              <div className="fw-semibold fs-6">
                <div>{billingAddress.name}</div>
                <div>{billingAddress.address}</div>
                <div>{billingAddress.city} {billingAddress.zip}</div>
                {billingAddress.country && <div>{billingAddress.country}</div>}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold text-muted">Shipping Address</label>
              <div className="fw-semibold fs-6">
                <div>{shippingAddress.name}</div>
                <div>{shippingAddress.address}</div>
                <div>{shippingAddress.city} {shippingAddress.zip}</div>
                {shippingAddress.country && <div>{shippingAddress.country}</div>}
              </div>
            </div>
          </div>
        </div>
        
        {/* Line Items Table */}
        <div className="mb-8">
          <div className="table-responsive">
            <table className="table align-middle gs-0 gy-4">
              <thead>
                <tr className="fw-bold text-muted bg-light">
                  <th className="ps-4 min-w-300px rounded-start">Product</th>
                  <th className="min-w-100px">Code</th>
                  <th className="min-w-70px text-end">Qty</th>
                  <th className="min-w-100px text-end">Unit Price</th>
                  <th className="min-w-100px text-end">Tax</th>
                  <th className="min-w-100px text-end">Discount</th>
                  <th className="min-w-125px rounded-end text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        {item.image && (
                          <a href="#" className="symbol symbol-50px me-3">
                            <span
                              className="symbol-label"
                              style={{ backgroundImage: `url(${PRODUCT_IMAGE_URL + item.image})` }}
                            ></span>
                          </a>
                        )}
                        <div className="ms-5">
                          <div className="fw-semibold">{item.name}</div>
                          <div className="fw-light">Variant: {item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td>{item.code}</td>
                    <td className="text-end">{item.quantity}</td>
                    <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-end">{formatCurrency(item.tax)}</td>
                    <td className="text-end">{formatCurrency(item.discount)}</td>
                    <td className="text-end fw-bold">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="d-flex justify-content-end mt-4">
            <div className="w-25">
              <div className="d-flex flex-stack mb-3">
                <div className="fw-semibold pe-10 text-gray-600 fs-7">Subtotal:</div>
                <div className="text-end fw-bold fs-6 text-gray-800">
                  {formatCurrency(subtotal)}
                </div>
              </div>
              
              {/* Always show discount line, with 0 if no discount */}
              <div className="d-flex flex-stack mb-3">
                <div className="fw-semibold pe-10 text-gray-600 fs-7">Discount:</div>
                <div className="text-end fw-bold fs-6 text-gray-800">
                  -{formatCurrency(discount)}
                </div>
              </div>
              
              {/* Show extra discount if present */}
              {showExtraDiscount && (
                <div className="d-flex flex-stack mb-3">
                  <div className="fw-semibold pe-10 text-gray-600 fs-7">
                    Extra Discount {extraDiscountType === 'percentage' ? `(${extraDiscountAmount}%)` : '(Flat)'}:
                  </div>
                  <div className="text-end fw-bold fs-6 text-gray-800">
                    -{formatCurrency(extraDiscountType === 'percentage' 
                      ? subtotal * (extraDiscountAmount / 100)
                      : extraDiscountAmount)}
                  </div>
                </div>
              )}
              
              {/* Always show tax line, with 0 if no tax */}
              <div className="d-flex flex-stack mb-3">
                <div className="fw-semibold pe-10 text-gray-600 fs-7">Tax:</div>
                <div className="text-end fw-bold fs-6 text-gray-800">
                  {formatCurrency(tax)}
                </div>
              </div>
              
              <div className="d-flex flex-stack mb-3">
                <div className="fw-semibold pe-10 text-gray-600 fs-7">Shipping:</div>
                <div className="text-end fw-bold fs-6 text-gray-800">
                  {formatCurrency(shipping)}
                </div>
              </div>
              
              <div className="d-flex flex-stack border-top pt-3 mt-3">
                <div className="fw-semibold pe-10 text-gray-600 fs-7">Total:</div>
                <div className="text-end fw-bolder fs-6 text-primary">
                  {formatCurrency(total)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Terms & Conditions */}
        {enableTerms && (
          <div className="mb-8">
            <div className="fw-bold text-dark mb-3">Terms & Conditions</div>
            <div className="fs-6 fw-semibold text-gray-700">
              <ol>
                <li>Payment is due within 14 days of invoice</li>
                <li>Please include invoice number on your payment</li>
                <li>All goods remain the property of the seller until paid in full</li>
              </ol>
            </div>
          </div>
        )}
        
        {/* Order Note */}
        {orderDetail?.order_note && (
          <div className="mb-8">
            <div className="fw-bold text-dark mb-3">Order Note</div>
            <div className="fs-6 fw-semibold text-gray-700">
              {orderDetail.order_note}
            </div>
          </div>
        )}
        
        {/* Signature Section */}
        {enableSignature && (
          <div className="d-flex flex-stack flex-wrap mt-15">
            <div className="d-flex flex-column me-10 mb-10">
              <div className="fw-bold fs-6 mb-3">Signature</div>
              <div className="border-bottom border-gray-300 w-150px" style={{ height: '75px' }}></div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default InvoiceDetailsWidget; 