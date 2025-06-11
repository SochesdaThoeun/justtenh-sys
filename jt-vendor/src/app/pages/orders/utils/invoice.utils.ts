import { Order, OrderDetailsModel } from '@/app/redux/order/order.models';

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return '';
  }
};

// Helper function for safely accessing nested properties
export const getNestedValue = (obj: any, path: string, defaultValue: string = ''): string => {
  try {
    const value = path.split('.').reduce((o, key) => (o || {})[key], obj);
    return value !== undefined && value !== null ? String(value) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// Function to get line items from order details
export const getLineItems = (orderDetails: Order[]) => {
  if (!orderDetails || orderDetails.length === 0) return [];
  
  return orderDetails.map((orderDetail: any) => {
    const unitPrice = orderDetail.product_details?.unit_price || 0;
    const qty = orderDetail.qty || 0;
    const taxRate = orderDetail.product_details?.tax || 0;
    
    let computedTax = 0;
    if(orderDetail.product_details?.tax_model === "include"){
      computedTax = (unitPrice * qty) - (unitPrice * qty)/(1 + taxRate/100);
    } else {
      computedTax = unitPrice * qty * (taxRate/100);
    }
    
    let computedDiscount = 0;
    if(orderDetail.product_details?.discount_type === "flat"){
      computedDiscount = (orderDetail.product_details?.discount || 0) * qty;
    } else {
      computedDiscount = unitPrice * qty * ((orderDetail.product_details?.discount || 0)/100);
    }
    
    // Total adds computedTax and deducts discount
    const total = (unitPrice * qty) + computedTax - computedDiscount;
    
    return {
      id: orderDetail.id || orderDetail.product_id,
      name: orderDetail.product_details?.name || orderDetail.product_name || '',
      description: orderDetail.variant || '',
      quantity: qty,
      unitPrice: unitPrice,
      tax: computedTax,
      discount: computedDiscount,
      amount: total,
      code: orderDetail.product_details?.code || '',
      image: orderDetail.product_details?.images?.[0] || ''
    };
  });
};

// Calculate subtotal
export const calculateSubtotal = (lineItems: any[]): number => {
  // Subtotal is just the sum of unit price * quantity before tax and discounts
  return lineItems.reduce((sum: number, item: any) => 
    sum + (item.unitPrice * item.quantity), 0);
};

// Get discount amount - both line item and order level
export const getDiscountAmount = (lineItems: any[], orderDetail: Order | null): number => {
  // Combine both line item discounts and order discount
  const lineItemDiscounts = lineItems.reduce((sum: number, item: any) => 
    sum + item.discount, 0);
  
  const orderDiscount = orderDetail?.discount_amount || 0;
  
  // Calculate extra discount from the order
  let extraDiscount = 0;
  const extraDiscountAmount = (orderDetail as any)?.order?.extra_discount || 0;
  const extraDiscountType = (orderDetail as any)?.order?.extra_discount_type || 'amount';
  
  if (extraDiscountAmount > 0) {
    if (extraDiscountType === 'amount') {
      extraDiscount = extraDiscountAmount;
    } else {
      // If percentage, calculate based on subtotal (price * qty)
      const subtotal = lineItems.reduce((sum: number, item: any) => 
        sum + (item.unitPrice * item.quantity), 0);
      extraDiscount = subtotal * (extraDiscountAmount / 100);
    }
  }
  
  return lineItemDiscounts + orderDiscount + extraDiscount;
};

// Get shipping cost
export const getShippingCost = (orderDetail: Order | null): number => {
  return orderDetail?.shipping_cost || 
          (orderDetail as any)?.order?.shipping_cost || 0;
};

// Get tax amount from line items
export const getTaxAmount = (lineItems: any[]): number => {
  return lineItems.reduce((sum: number, item: any) => sum + item.tax, 0);
};

// Calculate grand total
export const calculateTotal = (
  subtotal: number, 
  taxAmount: number, 
  discountAmount: number, 
  shippingCost: number
): number => {
  // Raw subtotal (price * qty) + tax - discount + shipping
  return subtotal + taxAmount - discountAmount + shippingCost;
};

// Get billing address from ShippingDetailsWidget format
export const getBillingAddress = (orderDetail: Order | null) => {
  if (!orderDetail) return { name: '', address: '', location: '' };
  
  const billingData = orderDetail.billing_address_data || 
                      (orderDetail as any)?.order?.billing_address_data || {};
  
  return {
    name: billingData.contact_person_name || '',
    address: billingData.address || '',
    city: billingData.city || '',
    zip: billingData.zip || '',
    country: billingData.country || '',
    phone: billingData.phone || '',
    email: billingData.email || '',
  };
};

// Get shipping address from ShippingDetailsWidget format
export const getShippingAddress = (orderDetail: Order | null) => {
  if (!orderDetail) return { name: '', address: '', location: '' };
  
  const shippingData = orderDetail.shipping_address_data || 
                      (orderDetail as any)?.order?.shipping_address_data || {};
  
  return {
    name: shippingData.contact_person_name || '',
    address: shippingData.address || '',
    city: shippingData.city || '',
    zip: shippingData.zip || '',
    country: shippingData.country || '',
    phone: shippingData.phone || '',
    email: shippingData.email || '',
  };
};

// Get order details from OrderDetailsWidget format
export const getOrderDetails = (orderDetail: Order | null, orderId: string | undefined) => {
  if (!orderDetail) return {};
  
  return {
    id: (orderDetail as any)?.order_id || orderId,
    date: orderDetail.created_at || (orderDetail as any)?.order?.created_at,
    status: (orderDetail as any)?.order_status || (orderDetail as any)?.order?.order_status,
    paymentMethod: orderDetail.payment_method || (orderDetail as any)?.order?.payment_method,
    paymentStatus: orderDetail.payment_status || (orderDetail as any)?.order?.payment_status,
    deliveryType: orderDetail.delivery_type || (orderDetail as any)?.order?.delivery_type,
  };
};

// Get customer details from OrderDetailsWidget format
export const getCustomerDetails = (orderDetail: Order | null) => {
  if (!orderDetail) return {};
  
  const isGuest = (orderDetail as any)?.order?.is_guest;
  
  return {
    name: isGuest 
      ? (orderDetail as any)?.order?.shipping_address_data?.contact_person_name 
      : (orderDetail as any)?.order?.customer?.name,
    email: isGuest
      ? (orderDetail as any)?.order?.shipping_address_data?.email
      : (orderDetail as any)?.order?.customer?.email,
    phone: isGuest
      ? (orderDetail as any)?.order?.shipping_address_data?.phone
      : (orderDetail as any)?.order?.customer?.phone,
  };
}; 