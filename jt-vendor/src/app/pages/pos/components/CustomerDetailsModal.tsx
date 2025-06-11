import React, { useState, useEffect } from 'react';
import { BillingAddressData as Address, Customer } from '@/app/redux/models';
import { ORDER_STATUS } from '@/app/constants/api.constants';
import Select from 'react-select';

// Country options
const countries = [
  { value: 'AU', label: 'Australia' },
  { value: 'US', label: 'United States' },
  { value: 'KH', label: 'Cambodia' },
];

// Define fields that are required
const requiredFields = [
  'contact_person_name',
  'address',
  'city',
  'zip',
  'phone',
  'email',
  'country'
];

// Local state for form values
interface LocalAddress {
  contact_person_name: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  email: string;
  country: string;
  latitude: string;
  longitude: string;
}

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: {
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: string;
    orderStatus: string;
    paymentStatus: string;
    orderDate: string;
    selectedCustomer?: Customer | null;
  }) => void;
}

// Default walk-in customer details
const walkInCustomerDetails: LocalAddress = {
  contact_person_name: 'Walk-in Customer',
  address: 'Walk-in',
  city: 'Walk-in',
  zip: '00000',
  phone: '000000000000',
  email: 'walking@customer.com',
  country: 'KH',
  latitude: '',
  longitude: ''
};

// Empty address for reset functionality
const emptyAddress: LocalAddress = {
  contact_person_name: '',
  address: '',
  city: '',
  zip: '',
  phone: '',
  email: '',
  country: 'AU',
  latitude: '',
  longitude: ''
};

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  // Local state for shipping and billing addresses
  const [localShippingAddress, setLocalShippingAddress] = useState<LocalAddress>({...emptyAddress});
  const [localBillingAddress, setLocalBillingAddress] = useState<LocalAddress>({...emptyAddress});

  // Order details state
  const [orderStatus, setOrderStatus] = useState(ORDER_STATUS.DELIVERED);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Customer selection state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearchValue, setCustomerSearchValue] = useState('');

  // Validation state
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});
  const [billingErrors, setBillingErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState({
    shipping: false,
    billing: false
  });

  // Sample customer data for demonstration - replace with API call in production
  useEffect(() => {
    // In a real app, you would fetch this from an API
    const sampleCustomers: Customer[] = [
      { 
        id: 0, 
        f_name: 'Walk-in', 
        l_name: 'Customer', 
        phone: '000000000000', 
        email: 'walking@customer.com' 
      },
      { 
        id: 1, 
        f_name: 'John', 
        l_name: 'Doe', 
        phone: '1234567890', 
        email: 'john@example.com' 
      },
      { 
        id: 2, 
        f_name: 'Jane', 
        l_name: 'Smith', 
        phone: '9876543210', 
        email: 'jane@example.com' 
      },
      { 
        id: 3, 
        f_name: 'Bob', 
        l_name: 'Johnson', 
        phone: '5551234567', 
        email: 'bob@example.com' 
      }
    ];
    
    setCustomers(sampleCustomers);
  }, []);
  
  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string): string => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // Format customer options for Select
  const customerOptions = customers.map(customer => ({
    value: customer.id || `customer_${customer.id}`,
    label: (customer.f_name || customer.l_name)
      ? `${capitalizeFirstLetter(customer.f_name || '')} ${capitalizeFirstLetter(customer.l_name || '')}`.trim() 
      : `${customer.phone || 'No Name'}`,
    data: customer
  }));
  
  // Get currently selected option
  const selectedCustomerOption = customerOptions.find(option => 
    selectedCustomer && (option.value === selectedCustomer.id || option.value === `customer_${selectedCustomer.id}`)
  ) || null;
  
  // Handle customer selection
  const handleCustomerChange = (selectedOption: any) => {
    // Type safe handling of customer data
    const customerData = selectedOption.data as Customer;
    setSelectedCustomer(customerData);
    
    // Pre-fill form with customer data
    if (customerData) {
      const customerName = customerData.f_name ? 
        `${customerData.f_name || ''} ${customerData.l_name || ''}`.trim() : '';
        
      // If it's walk-in customer (id === 0), use the pre-defined values
      if (customerData.id === 0) {
        setLocalShippingAddress({
          ...walkInCustomerDetails
        });
        
        if (sameAsBilling) {
          setLocalBillingAddress({
            ...walkInCustomerDetails
          });
        }
      } else {
        // For regular customers, just update the contact info
        setLocalShippingAddress(prev => ({
          ...prev,
          contact_person_name: customerName || prev.contact_person_name,
          phone: customerData.phone || prev.phone,
          email: customerData.email || prev.email
        }));
        
        if (sameAsBilling) {
          setLocalBillingAddress(prev => ({
            ...prev,
            contact_person_name: customerName || prev.contact_person_name,
            phone: customerData.phone || prev.phone,
            email: customerData.email || prev.email
          }));
        }
      }
      
      // Clear validation errors
      setShippingErrors({});
      setBillingErrors({});
    }
  };
  
  // Reset form fields
  const resetFormFields = () => {
    setLocalShippingAddress({...emptyAddress});
    if (sameAsBilling) {
      setLocalBillingAddress({...emptyAddress});
    }
    
    // Clear validation errors
    setShippingErrors({});
    setBillingErrors({});
    
    // Reset touched state
    setTouched({
      shipping: false,
      billing: false
    });
    
    // Keep the same customer selected, just clear address fields
  };

  // Validate fields
  const validateAddress = (address: any, type: 'shipping' | 'billing') => {
    const errors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      if (!address[field]) {
        errors[field] = `${field.replace(/_/g, ' ')} is required`;
      }
    });
    
    // Email validation
    if (address.email && !/\S+@\S+\.\S+/.test(address.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (address.phone && !/^[+]?[\d\s()-]{7,}$/.test(address.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (type === 'billing') {
      setBillingErrors(errors);
    } else {
      setShippingErrors(errors);
    }
    
    return Object.keys(errors).length === 0;
  };

  // Handle shipping field change
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setLocalShippingAddress(prev => {
      const updated = { ...prev, [name]: value };
      
      // Live validation if form has been touched
      if (touched.shipping) {
        validateAddress(updated, 'shipping');
      }
      
      // If billing is same as shipping, update billing too
      if (sameAsBilling) {
        setLocalBillingAddress(prevBilling => ({
          ...prevBilling,
          [name]: value
        }));
      }
      
      return updated;
    });
  };

  // Handle billing field change
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setLocalBillingAddress(prev => {
      const updated = { ...prev, [name]: value };
      
      // Live validation if form has been touched
      if (touched.billing) {
        validateAddress(updated, 'billing');
      }
      
      return updated;
    });
  };

  // Handle same as shipping toggle
  const handleSameAsBilling = () => {
    setSameAsBilling(!sameAsBilling);
    
    if (!sameAsBilling) {
      setLocalBillingAddress(localShippingAddress);
    }
  };

  // Apply walk-in customer details
  const applyWalkInCustomer = () => {
    setLocalShippingAddress(walkInCustomerDetails);
    
    if (sameAsBilling) {
      setLocalBillingAddress(walkInCustomerDetails);
    }
    
    // Clear any validation errors
    setShippingErrors({});
    setBillingErrors({});
  };

  // Handle walk-in customer and save
  const handleWalkInCustomer = () => {
    // Find the walk-in customer (id === 0) in the customers list
    const walkInCustomer = customers.find(c => c.id === 0) || null;
    
    // Select the walk-in customer
    if (walkInCustomer) {
      setSelectedCustomer(walkInCustomer);
    }
    
    // Apply walk-in customer details
    applyWalkInCustomer();
    
    // Convert to Address type for save
    const addressData: Address = {
      contact_person_name: walkInCustomerDetails.contact_person_name,
      address: walkInCustomerDetails.address,
      city: walkInCustomerDetails.city,
      zip: walkInCustomerDetails.zip,
      phone: walkInCustomerDetails.phone,
      email: walkInCustomerDetails.email,
      country: walkInCustomerDetails.country,
      latitude: walkInCustomerDetails.latitude,
      longitude: walkInCustomerDetails.longitude
    };
    
    // Save the walk-in customer data
    onSave({
      shippingAddress: addressData,
      billingAddress: addressData,
      paymentMethod,
      orderStatus,
      paymentStatus,
      orderDate,
      selectedCustomer: walkInCustomer
    });
  };

  // Show errors for a field
  const getFieldError = (field: string, type: 'shipping' | 'billing') => {
    const errors = type === 'billing' ? billingErrors : shippingErrors;
    
    if (errors[field]) {
      return (
        <div className="fv-plugins-message-container invalid-feedback">
          <div>{errors[field]}</div>
        </div>
      );
    }
    
    return null;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark forms as touched for validation
    setTouched({
      shipping: true,
      billing: !sameAsBilling
    });
    
    // Validate both forms
    const shippingValid = validateAddress(localShippingAddress, 'shipping');
    const billingValid = sameAsBilling || validateAddress(localBillingAddress, 'billing');
    
    // If valid, update Redux state
    if (shippingValid && (sameAsBilling || billingValid)) {
      // Convert localShippingAddress to Address type
      const shippingAddressData: Address = {
        contact_person_name: localShippingAddress.contact_person_name,
        address: localShippingAddress.address,
        city: localShippingAddress.city,
        zip: localShippingAddress.zip,
        phone: localShippingAddress.phone,
        email: localShippingAddress.email,
        country: localShippingAddress.country,
        latitude: localShippingAddress.latitude,
        longitude: localShippingAddress.longitude
      };
      
      let billingAddressData: Address;
      
      if (sameAsBilling) {
        // Use shipping address for billing too
        billingAddressData = {
          contact_person_name: localShippingAddress.contact_person_name,
          address: localShippingAddress.address,
          city: localShippingAddress.city,
          zip: localShippingAddress.zip,
          phone: localShippingAddress.phone,
          email: localShippingAddress.email,
          country: localShippingAddress.country,
          latitude: localShippingAddress.latitude,
          longitude: localShippingAddress.longitude
        };
      } else {
        // Convert localBillingAddress to Address type
        billingAddressData = {
          contact_person_name: localBillingAddress.contact_person_name,
          address: localBillingAddress.address,
          city: localBillingAddress.city,
          zip: localBillingAddress.zip,
          phone: localBillingAddress.phone,
          email: localBillingAddress.email,
          country: localBillingAddress.country,
          latitude: localBillingAddress.latitude,
          longitude: localBillingAddress.longitude
        };
      }

      onSave({
        shippingAddress: shippingAddressData,
        billingAddress: billingAddressData,
        paymentMethod,
        orderStatus,
        paymentStatus,
        orderDate,
        selectedCustomer: selectedCustomer
      });
    }
  };

  // When the modal is closed, don't render anything
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      id="customerDetailsModal"
      tabIndex={-1}
      aria-hidden="true"
      role="dialog"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered mw-800px">
        <div className="modal-content">
          <div className="modal-header pb-0 border-0 justify-content-end">
            <div className="btn btn-sm btn-icon btn-active-color-primary" onClick={onClose}>
              <i className="ki-duotone ki-cross fs-1">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </div>
          </div>
          
          <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Left column - Order Details */}
                <div className="col-lg-4">
                  <div className="card card-flush py-4 mb-5">
                    <div className="card-header">
                      <div className="card-title">
                        <h2>Order Details</h2>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <div className="d-flex flex-column gap-5">
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
                            isSearchable={true}
                            onInputChange={(value) => setCustomerSearchValue(value)}
                            noOptionsMessage={() => "Type to search customers"}
                          />
                          {selectedCustomer && (
                            <div className="fs-7 text-muted mt-2">
                              {selectedCustomer.phone && <div>Phone: {selectedCustomer.phone}</div>}
                              {selectedCustomer.email && <div>Email: {selectedCustomer.email}</div>}
                            </div>
                          )}
                        </div>
                        
                        {/* Order Status */}
                        <div className="fv-row">
                          <label className="required form-label">Order Status</label>
                          <select
                            className="form-select"
                            value={orderStatus}
                            onChange={(e) => setOrderStatus(e.target.value)}
                          >
                            <option value={ORDER_STATUS.PENDING}>Pending</option>
                            <option value={ORDER_STATUS.CONFIRMED}>Confirmed</option>
                            <option value={ORDER_STATUS.PROCESSING}>Processing</option>
                            <option value={ORDER_STATUS.OUT_FOR_DELIVERY}>Out for Delivery</option>
                            <option value={ORDER_STATUS.DELIVERED}>Delivered</option>
                          </select>
                        </div>

                        {/* Payment Method */}
                        <div className="fv-row">
                          <label className="required form-label">Payment Method</label>
                          <select
                            className="form-select"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          >
                            <option value="cash_on_delivery">Cash on Delivery</option>
                            <option value="abapay">ABA KHQR</option>
                          </select>
                        </div>

                        {/* Payment Status */}
                        <div className="fv-row">
                          <label className="required form-label">Payment Status</label>
                          <select
                            className="form-select"
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                          >
                            <option value="unpaid">Unpaid</option>
                            <option value="paid">Paid</option>
                          </select>
                        </div>

                        {/* Order Date */}
                        <div className="fv-row">
                          <label className="required form-label">Order Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column - Delivery Details */}
                <div className="col-lg-8">
                  <div className="card card-flush py-4">
                    <div className="card-header">
                      <div className="card-title">
                        <h2>Delivery Details</h2>
                      </div>
                      <div className="card-toolbar">
                        <button
                          type="button"
                          className="btn btn-sm btn-light-danger"
                          onClick={resetFormFields}
                        >
                          <i className="ki-duotone ki-trash fs-5 me-1">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                          </i>
                          Reset
                        </button>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <div className="d-flex flex-column gap-5 gap-md-7">
                        {/* Shipping Address */}
                        <div className="fs-3 fw-bold mb-n2">Shipping Address</div>
                        <div className="d-flex flex-column flex-md-row gap-5">
                          <div className="flex-row-fluid">
                            <label className="required form-label">Contact Person</label>
                            <input
                              className={`form-control ${shippingErrors.contact_person_name ? 'is-invalid' : ''}`}
                              name="contact_person_name"
                              placeholder="Contact Person Name"
                              value={localShippingAddress.contact_person_name}
                              onChange={handleShippingChange}
                              onBlur={() => {
                                setTouched(prev => ({ ...prev, shipping: true }));
                                validateAddress(localShippingAddress, 'shipping');
                              }}
                            />
                            {getFieldError('contact_person_name', 'shipping')}
                          </div>
                          <div className="flex-row-fluid">
                            <label className="required form-label">Phone</label>
                            <input
                              className={`form-control ${shippingErrors.phone ? 'is-invalid' : ''}`}
                              name="phone"
                              placeholder="Phone Number"
                              value={localShippingAddress.phone}
                              onChange={handleShippingChange}
                              onBlur={() => {
                                setTouched(prev => ({ ...prev, shipping: true }));
                                validateAddress(localShippingAddress, 'shipping');
                              }}
                            />
                            {getFieldError('phone', 'shipping')}
                          </div>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-5">
                          <div className="flex-row-fluid">
                            <label className="required form-label">Email</label>
                            <input
                              className={`form-control ${shippingErrors.email ? 'is-invalid' : ''}`}
                              name="email"
                              placeholder="Email"
                              type="email"
                              value={localShippingAddress.email}
                              onChange={handleShippingChange}
                              onBlur={() => {
                                setTouched(prev => ({ ...prev, shipping: true }));
                                validateAddress(localShippingAddress, 'shipping');
                              }}
                            />
                            {getFieldError('email', 'shipping')}
                          </div>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-5">
                          <div className="flex-row-fluid">
                            <label className="required form-label">Address Line 1</label>
                            <input
                              className={`form-control ${shippingErrors.address ? 'is-invalid' : ''}`}
                              name="address"
                              placeholder="Address Line 1"
                              value={localShippingAddress.address}
                              onChange={handleShippingChange}
                              onBlur={() => {
                                setTouched(prev => ({ ...prev, shipping: true }));
                                validateAddress(localShippingAddress, 'shipping');
                              }}
                            />
                            {getFieldError('address', 'shipping')}
                          </div>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-5">
                          <div className="flex-row-fluid">
                            <label className="form-label">City</label>
                            <input
                              className={`form-control ${shippingErrors.city ? 'is-invalid' : ''}`}
                              name="city"
                              placeholder="City"
                              value={localShippingAddress.city}
                              onChange={handleShippingChange}
                              onBlur={() => {
                                setTouched(prev => ({ ...prev, shipping: true }));
                                validateAddress(localShippingAddress, 'shipping');
                              }}
                            />
                            {getFieldError('city', 'shipping')}
                          </div>
                          <div className="flex-row-fluid">
                            <label className="required form-label">Postcode</label>
                            <input
                              className={`form-control ${shippingErrors.zip ? 'is-invalid' : ''}`}
                              name="zip"
                              placeholder="Postcode"
                              value={localShippingAddress.zip}
                              onChange={handleShippingChange}
                              onBlur={() => {
                                setTouched(prev => ({ ...prev, shipping: true }));
                                validateAddress(localShippingAddress, 'shipping');
                              }}
                            />
                            {getFieldError('zip', 'shipping')}
                          </div>
                        </div>
                        <div className="fv-row">
                          <label className="required form-label">Country</label>
                          <select
                            className={`form-select ${shippingErrors.country ? 'is-invalid' : ''}`}
                            name="country"
                            value={localShippingAddress.country}
                            onChange={handleShippingChange}
                            onBlur={() => {
                              setTouched(prev => ({ ...prev, shipping: true }));
                              validateAddress(localShippingAddress, 'shipping');
                            }}
                          >
                            {countries.map((country) => (
                              <option key={country.value} value={country.value}>
                                {country.label}
                              </option>
                            ))}
                          </select>
                          {getFieldError('country', 'shipping')}
                        </div>
                        <div className="form-check form-check-custom form-check-solid">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={sameAsBilling}
                            onChange={handleSameAsBilling}
                            id="same_as_shipping"
                          />
                          <label className="form-check-label" htmlFor="same_as_shipping">
                            Billing address is the same as shipping address
                          </label>
                        </div>
                      </div>

                      {!sameAsBilling && (
                        <div className="d-flex flex-column gap-5 gap-md-7 mt-10">
                          <div className="fs-3 fw-bold mb-n2">Billing Address</div>
                          <div className="d-flex flex-column flex-md-row gap-5">
                            <div className="flex-row-fluid">
                              <label className="required form-label">Contact Person</label>
                              <input
                                className={`form-control ${billingErrors.contact_person_name ? 'is-invalid' : ''}`}
                                name="contact_person_name"
                                placeholder="Contact Person Name"
                                value={localBillingAddress.contact_person_name}
                                onChange={handleBillingChange}
                                onBlur={() => {
                                  setTouched(prev => ({ ...prev, billing: true }));
                                  validateAddress(localBillingAddress, 'billing');
                                }}
                              />
                              {getFieldError('contact_person_name', 'billing')}
                            </div>
                            <div className="flex-row-fluid">
                              <label className="required form-label">Phone</label>
                              <input
                                className={`form-control ${billingErrors.phone ? 'is-invalid' : ''}`}
                                name="phone"
                                placeholder="Phone Number"
                                value={localBillingAddress.phone}
                                onChange={handleBillingChange}
                                onBlur={() => {
                                  setTouched(prev => ({ ...prev, billing: true }));
                                  validateAddress(localBillingAddress, 'billing');
                                }}
                              />
                              {getFieldError('phone', 'billing')}
                            </div>
                          </div>
                          <div className="d-flex flex-column flex-md-row gap-5">
                            <div className="flex-row-fluid">
                              <label className="required form-label">Email</label>
                              <input
                                className={`form-control ${billingErrors.email ? 'is-invalid' : ''}`}
                                name="email"
                                placeholder="Email"
                                type="email"
                                value={localBillingAddress.email}
                                onChange={handleBillingChange}
                                onBlur={() => {
                                  setTouched(prev => ({ ...prev, billing: true }));
                                  validateAddress(localBillingAddress, 'billing');
                                }}
                              />
                              {getFieldError('email', 'billing')}
                            </div>
                          </div>
                          <div className="d-flex flex-column flex-md-row gap-5">
                            <div className="flex-row-fluid">
                              <label className="required form-label">Address Line 1</label>
                              <input
                                className={`form-control ${billingErrors.address ? 'is-invalid' : ''}`}
                                name="address"
                                placeholder="Address Line 1"
                                value={localBillingAddress.address}
                                onChange={handleBillingChange}
                                onBlur={() => {
                                  setTouched(prev => ({ ...prev, billing: true }));
                                  validateAddress(localBillingAddress, 'billing');
                                }}
                              />
                              {getFieldError('address', 'billing')}
                            </div>
                          </div>
                          <div className="d-flex flex-column flex-md-row gap-5">
                            <div className="flex-row-fluid">
                              <label className="form-label">City</label>
                              <input
                                className={`form-control ${billingErrors.city ? 'is-invalid' : ''}`}
                                name="city"
                                placeholder="City"
                                value={localBillingAddress.city}
                                onChange={handleBillingChange}
                                onBlur={() => {
                                  setTouched(prev => ({ ...prev, billing: true }));
                                  validateAddress(localBillingAddress, 'billing');
                                }}
                              />
                              {getFieldError('city', 'billing')}
                            </div>
                            <div className="flex-row-fluid">
                              <label className="required form-label">Postcode</label>
                              <input
                                className={`form-control ${billingErrors.zip ? 'is-invalid' : ''}`}
                                name="zip"
                                placeholder="Postcode"
                                value={localBillingAddress.zip}
                                onChange={handleBillingChange}
                                onBlur={() => {
                                  setTouched(prev => ({ ...prev, billing: true }));
                                  validateAddress(localBillingAddress, 'billing');
                                }}
                              />
                              {getFieldError('zip', 'billing')}
                            </div>
                          </div>
                          <div className="fv-row">
                            <label className="required form-label">Country</label>
                            <select
                              className={`form-select ${billingErrors.country ? 'is-invalid' : ''}`}
                              name="country"
                              value={localBillingAddress.country}
                              onChange={handleBillingChange}
                              onBlur={() => {
                                setTouched(prev => ({ ...prev, billing: true }));
                                validateAddress(localBillingAddress, 'billing');
                              }}
                            >
                              {countries.map((country) => (
                                <option key={country.value} value={country.value}>
                                  {country.label}
                                </option>
                              ))}
                            </select>
                            {getFieldError('country', 'billing')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-light-primary me-3"
              onClick={handleWalkInCustomer}
            >
              <i className="ki-duotone ki-walking fs-2 me-2">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
              Use Walk-in Customer
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              Save Customer Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal; 