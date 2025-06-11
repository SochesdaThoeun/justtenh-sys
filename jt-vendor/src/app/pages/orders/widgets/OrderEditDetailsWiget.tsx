import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
import { 
  fetchCustomers, 
  setCustomerSearch, 
  setCustomerPage, 
  selectCustomer, 
  setGuestCheckout, 
  setOrderDate, 
  setOrderStatus, 
  setPaymentMethod, 
  setShippingMethod,
  setPaymentStatus,
  setDeliveryServiceName,
  setThirdPartyTrackingId
} from '@/app/redux/order/orderCreation.slice';
import { Customer } from '@/app/redux/models';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { ORDER_STATUS } from '@/app/constants/api.constants';
import ThirdPartyDeliveryModal from './ThirdPartyDeliveryModal';

// Payment method options
const paymentMethodOptions = [
  { value: 'cash_on_delivery', label: 'Cash on Delivery' },
  { value: 'abapay', label: 'ABA KHQR' },
];

// Payment status options
const paymentStatusOptions = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'paid', label: 'Paid' },
];

// Order status options
const orderStatusOptions = [
  { value: ORDER_STATUS.PENDING, label: 'Pending' },
  { value: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
  { value: ORDER_STATUS.PROCESSING, label: 'Processing' },
  { value: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
  { value: ORDER_STATUS.DELIVERED, label: 'Delivered' },
];

// Shipping method options
const shippingMethodOptions = [
  { value: 'direct', label: 'Delivery Direct' },
  { value: 'third_party_delivery', label: 'Third Party Delivery' },
  { value: 'update_third_party_delivery', label: 'Update Third Party Delivery' },
];

const OrderEditDetailsWidget: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get state from Redux
  const {
    customers,
    customersLoading,
    customersError,
    customerPage,
    customerSearch,
    selectedCustomer,
    isGuestCheckout,
    orderDate,
    orderStatus,
    paymentMethod,
    paymentStatus,
    shippingMethod,
    deliveryServiceName,
    thirdPartyTrackingId
  } = useSelector((state: RootState) => state.orderCreation);
  
  // Local state for customer search field
  const [customerSearchValue, setCustomerSearchValue] = useState('');
  
  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string): string => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Customer search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (customerSearchValue !== customerSearch) {
        dispatch(setCustomerSearch(customerSearchValue));
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [customerSearchValue, customerSearch, dispatch]);
  
  // Fetch customers on component mount or when search/page changes
  useEffect(() => {
    dispatch(fetchCustomers({ page: customerPage, search: customerSearch }));
  }, [dispatch, customerPage, customerSearch]);
  
  // Format customer options for Select
  const customerOptions = customers.map(customer => ({
    value: customer.id || `customer_${customer.id}`,
    label: (customer.f_name || customer.l_name)
      ? `${capitalizeFirstLetter(customer.f_name || '')} ${capitalizeFirstLetter(customer.l_name || '')}`.trim() 
      : `${customer.phone || 'No Name'}`,
    data: customer
  }));
  
  // Check if there's a customer with id 0
  const hasCustomerWithIdZero = customers.some(customer => customer.id === 0);
  
  // Add guest option only if there's no customer with id 0
  if (!hasCustomerWithIdZero) {
    customerOptions.unshift({
      value: '',
      label: 'Guest Checkout',
      data: {} as Customer
    });
  }
  
  // Handle customer selection
  const handleCustomerChange = (selectedOption: any) => {
    if (selectedOption.value === '') {
      dispatch(setGuestCheckout(true));
    } else {
      // Type safe handling of customer data
      const customerData = selectedOption.data as Customer;
      dispatch(selectCustomer(customerData));
    }
  };
  
  // Handle date change
  const handleDateChange = (dates: Date[]) => {
    if (dates && dates[0]) {
      const formattedDate = dates[0].toISOString().split('T')[0];
      dispatch(setOrderDate(formattedDate));
    }
  };
  
  // Handle order status change
  const handleOrderStatusChange = (selectedOption: any) => {
    dispatch(setOrderStatus(selectedOption.value));
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (selectedOption: any) => {
    dispatch(setPaymentMethod(selectedOption.value));
  };
  
  // Handle payment status change
  const handlePaymentStatusChange = (selectedOption: any) => {
    dispatch(setPaymentStatus(selectedOption.value));
  };
  
  // Handle shipping method change
  const handleShippingMethodChange = (selectedOption: any) => {
    if (selectedOption.value !== shippingMethod) {
      if (selectedOption.value === 'third_party_delivery' || selectedOption.value === 'update_third_party_delivery') {
        setTempShippingMethod(selectedOption.value);
        setIsUpdateMode(selectedOption.value === 'update_third_party_delivery');
        thirdPartyModalRef.current?.click();
      } else {
        dispatch(setShippingMethod(selectedOption.value));
      }
    }
  };
  
  // Get currently selected options
  const selectedCustomerOption = customerOptions.find(option => 
    isGuestCheckout ? option.value === '' : selectedCustomer && option.value === (selectedCustomer.id || `customer_${selectedCustomer.id}`)
  ) || null;
  
  const selectedOrderStatusOption = orderStatusOptions.find(option => 
    option.value === orderStatus
  ) || orderStatusOptions[0];
  
  const selectedPaymentMethodOption = paymentMethodOptions.find(option => 
    option.value === paymentMethod
  ) || paymentMethodOptions[0];
  
  const selectedPaymentStatusOption = paymentStatusOptions.find(option => 
    option.value === paymentStatus
  ) || paymentStatusOptions[0];
  
  const selectedShippingMethodOption = shippingMethodOptions.find(option => 
    option.value === shippingMethod
  ) || shippingMethodOptions[0];
  
  // Add state declarations for modal handling
  const [tempShippingMethod, setTempShippingMethod] = useState(shippingMethod);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const thirdPartyModalRef = useRef<HTMLButtonElement>(null);
  
  // Add handleThirdPartyDeliveryAssignment function
  const handleThirdPartyDeliveryAssignment = async (deliveryServiceName: string, trackingId: string): Promise<boolean> => {
    // For order creation, dispatch the selected shipping method
    dispatch(setShippingMethod(tempShippingMethod));
    
    // Also save the third party delivery details
    dispatch(setDeliveryServiceName(deliveryServiceName));
    dispatch(setThirdPartyTrackingId(trackingId));
    
    return true;
  };
  
  return (
    <>
      <ThirdPartyDeliveryModal
        ref={thirdPartyModalRef}
        onSaveChanges={handleThirdPartyDeliveryAssignment}
        modalId="thirdPartyDeliveryModal_edit"
        isLoading={false}
        isUpdate={isUpdateMode}
        existingServiceName={deliveryServiceName}
        existingTrackingId={thirdPartyTrackingId}
      />
      <div className="w-100 flex-lg-row-auto w-lg-300px mb-7 me-7 me-lg-10">
        <div className="card card-flush py-4">
          <div className="card-header">
            <div className="card-title">
              <h2>Order Details</h2>
            </div>
          </div>
          <div className="card-body pt-0">
            <div className="d-flex flex-column gap-10">
              {/* Customer Selection */}
              <div className="fv-row">
                <label className="required form-label">Customer</label>
                <Select
                  className="react-select-styled react-select-solid"
                  classNamePrefix="react-select"
                  options={customerOptions}
                  value={selectedCustomerOption}
                  onChange={handleCustomerChange}
                  placeholder="Select a customer"
                  isLoading={customersLoading}
                  isSearchable={true}
                  onInputChange={(value) => setCustomerSearchValue(value)}
                  noOptionsMessage={() => 
                    customersError ? `Error: ${customersError}` : 
                    customers.length === 0 ? "No customers found" : 
                    "Type to search customers"
                  }
                />
                {selectedCustomer && (
                  <div className="fs-7 text-muted mt-2">
                    {selectedCustomer.phone && <div>Phone: {selectedCustomer.phone}</div>}
                    {selectedCustomer.email && <div>Email: {selectedCustomer.email}</div>}
                  </div>
                )}
                {isGuestCheckout && (
                  <div className="fs-7 text-muted mt-2">
                    Guest customers require complete shipping and billing information.
                  </div>
                )}
              </div>

              {/* Order Status */}
              <div className="fv-row">
                <label className="required form-label">Order Status</label>
                <Select
                  className="react-select-styled react-select-solid"
                  classNamePrefix="react-select"
                  options={orderStatusOptions}
                  value={selectedOrderStatusOption}
                  onChange={handleOrderStatusChange}
                  placeholder="Select order status"
                />
              </div>

              {/* Payment Method */}
              <div className="fv-row">
                <label className="required form-label">Payment Method</label>
                <Select
                  className="react-select-styled react-select-solid"
                  classNamePrefix="react-select"
                  options={paymentMethodOptions}
                  value={selectedPaymentMethodOption}
                  onChange={handlePaymentMethodChange}
                  placeholder="Select payment method"
                />
                <div className="text-muted fs-7">
                  This determines how the customer will pay for the order.
                </div>
              </div>

              {/* Payment Status */}
              <div className="fv-row">
                <label className="required form-label">Payment Status</label>
                <Select
                  className="react-select-styled react-select-solid"
                  classNamePrefix="react-select"
                  options={paymentStatusOptions}
                  value={selectedPaymentStatusOption}
                  onChange={handlePaymentStatusChange}
                  placeholder="Select payment status"
                />
                <div className="text-muted fs-7">
                  Current status of payment for this order.
                </div>
              </div>

              {/* Shipping Method */}
              <div className="fv-row">
                <label className="required form-label">Shipping Method</label>
                <Select
                  className="react-select-styled react-select-solid"
                  classNamePrefix="react-select"
                  options={shippingMethodOptions}
                  value={selectedShippingMethodOption}
                  onChange={handleShippingMethodChange}
                  placeholder="Select shipping method"
                />
              </div>

              {/* Show Third Party Delivery Details if selected */}
              {shippingMethod === 'third_party_delivery' && deliveryServiceName && (
                <div className="fv-row mt-5">
                  <div className="bg-light-primary p-4 rounded">
                    <h6 className="mb-3 fw-bold">Third Party Delivery Details</h6>
                    <div className="d-flex flex-column">
                      <div className="mb-2">
                        <span className="fw-bold">Service:</span> {deliveryServiceName}
                      </div>
                      {thirdPartyTrackingId && (
                        <div>
                          <span className="fw-bold">Tracking ID:</span> {thirdPartyTrackingId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Date */}
              <div className="fv-row">
                <label className="required form-label">Order Date</label>
                <Flatpickr
                  value={orderDate ? new Date(orderDate) : new Date()}
                  onChange={handleDateChange}
                  className="form-control form-control-solid"
                  placeholder="Order Date"
                  options={{
                    dateFormat: 'Y-m-d',
                    maxDate: 'today',
                  }}
                />
                <div className="text-muted fs-7">When the order was placed.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderEditDetailsWidget;