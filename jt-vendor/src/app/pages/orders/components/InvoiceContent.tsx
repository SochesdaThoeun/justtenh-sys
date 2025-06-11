import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
import { Order } from '@/app/redux/order/order.models';
import { generateInvoiceNumber } from '@/app/redux/order/invoice.slice';
import InvoiceDetailsWidget from '../widgets/InvoiceDetailsWidget';
import InvoiceOptionsWidget from '../widgets/InvoiceOptionsWidget';
import { 
  getLineItems
} from '../utils/invoice.utils';
import { printInvoice, downloadInvoice } from '../utils/invoice.service';

interface InvoiceContentProps {
  orderId: string | undefined;
}

const InvoiceContent: React.FC<InvoiceContentProps> = ({ orderId }) => {
  const dispatch: AppDispatch = useDispatch();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  // Get data from Redux
  const { 
    enableTerms, 
    enableSignature,
    currentInvoiceNumber 
  } = useSelector((state: RootState) => state.invoice);
  
  const { orderDetails } = useSelector((state: RootState) => ({
    orderDetails: state.orderDetailReducer.orderDetails as unknown as Order[],
  }));
  
  // Get current order if available
  const orderDetail = orderDetails && orderDetails.length > 0 ? orderDetails[0] : null;
  
  // Get line items for display
  const lineItems = getLineItems(orderDetails || []);
  
  // Extract tax, shipping and discount details using type assertion
  const orderTax = (orderDetail as any)?.tax || 0;
  const orderTaxModel = (orderDetail as any)?.tax_model || 'exclude';
  const shippingCost = (orderDetail as any)?.order?.shipping_cost || 0;
  const extraDiscountAmount = (orderDetail as any)?.order?.extra_discount || 0;
  const extraDiscountType = (orderDetail as any)?.order?.extra_discount_type || 'amount';
  
  // Calculate base subtotal
  const subtotal = lineItems.reduce((acc, item) => {
    const unitPrice = item.unitPrice;
    const qty = item.quantity;
    
    // Calculate item discount
    let itemDiscount = 0;
    // Use type assertion for discount properties
    const itemDiscountType = (item as any).discountType || 'percentage';
    if (itemDiscountType === "flat") {
      itemDiscount = item.discount * qty;
    } else {
      itemDiscount = unitPrice * qty * (item.discount/100);
    }
    
    return acc + ((unitPrice * qty) - itemDiscount);
  }, 0);
  
  // Calculate tax amount based on tax model
  let taxAmount = 0;
  if (orderTaxModel === 'exclude') {
    taxAmount = subtotal * (orderTax / 100);
  } else {
    taxAmount = subtotal - (subtotal / (1 + orderTax / 100));
  }
  
  // Calculate extra discount based on type
  let discountAmount = 0;
  if (extraDiscountType === 'amount') {
    discountAmount = extraDiscountAmount;
  } else {
    discountAmount = subtotal * (extraDiscountAmount / 100);
  }
  
  // Calculate total amount
  const totalAmount = subtotal + (orderTaxModel === 'exclude' ? taxAmount : 0) 
                      + shippingCost - discountAmount;

  // Generate invoice number on first render
  useEffect(() => {
    if (orderId && !currentInvoiceNumber) {
      dispatch(generateInvoiceNumber(orderId));
    }
  }, [dispatch, orderId, currentInvoiceNumber]);

  // Handle print functionality
  const handlePrintInvoice = () => {
    if (!invoiceRef.current || !currentInvoiceNumber) return;
    printInvoice(invoiceRef.current.innerHTML, currentInvoiceNumber);
  };

  // Handle download functionality
  const handleDownloadInvoice = () => {
    if (!invoiceRef.current || !currentInvoiceNumber) return;
    downloadInvoice(invoiceRef.current.innerHTML, currentInvoiceNumber);
  };

  return (
    <div className="row gx-5">
      {/* Main Content - Invoice */}
      <div className="col-lg-8">
        <div className="card mb-5">
          <InvoiceDetailsWidget
            ref={invoiceRef}
            orderDetail={orderDetail}
            orderId={orderId}
            invoiceNumber={currentInvoiceNumber || ''}
            enableTerms={enableTerms}
            enableSignature={enableSignature}
            lineItems={lineItems}
            subtotal={subtotal}
            discount={discountAmount}
            tax={taxAmount}
            shipping={shippingCost}
            total={totalAmount}
            extraDiscountAmount={extraDiscountAmount}
            extraDiscountType={extraDiscountType}
          />
        </div>
      </div>
      
      {/* Sidebar - Invoice Options */}
      <div className="col-lg-4">
        <InvoiceOptionsWidget
          orderDetail={orderDetail}
          invoiceNumber={currentInvoiceNumber || ''}
          subtotal={subtotal}
          discount={discountAmount}
          tax={taxAmount}
          shipping={shippingCost}
          total={totalAmount}
          onPrint={handlePrintInvoice}
          onDownload={handleDownloadInvoice}
          extraDiscountAmount={extraDiscountAmount}
          extraDiscountType={extraDiscountType}
        />
      </div>
    </div>
  );
};

export default InvoiceContent; 